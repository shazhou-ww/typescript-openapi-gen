# IR 统一化方案建议（最终版）

## 问题描述

当前 IR 生成存在不一致问题：

1. **Allinone 版本**：
   - 使用内部引用：`$ref: "#/components/schemas/LLMConfigResponse"`
   - IR 中保持为：`{ "$ref": "#/components/schemas/LLMConfigResponse" }`

2. **Split 版本**：
   - 使用外部引用：`$ref: "../components/schemas/LLMConfigResponse.yaml"`
   - IR 中被解析为：完整的对象（包含所有 properties）

3. **结果**：
   - 136 个路径中只有 29 个完全一致（21%）
   - 107 个路径有差异
   - IR 不应该体现引用方式的差异

## 设计理念

**IR（Intermediate Representation）的核心目标：**
- ✅ **关注类型名称**：IR 应该关注各个 API 涉及到的类型是什么（如 `MessageRequestBody`）
- ✅ **统一引用表示**：所有类型引用都统一为类型名称，而不是完整的 `$ref` 路径
- ❌ **不关心存储路径**：`#/components/schemas/MessageRequestBody` vs `../components/schemas/MessageRequestBody.yaml` 不重要
- ❌ **不保留路径结构**：IR 中应该是 `MessageRequestBody`，而不是 `components.schemas.MessageRequestBody`

## 推荐方案：统一为类型名称引用

### 核心思路

**无论是内部引用还是外部引用，都统一转换为类型名称引用。**

IR 中的表示：
- ✅ `{ "$ref": "MessageRequestBody" }` 或 `{ "type": "MessageRequestBody" }`
- ❌ `{ "$ref": "#/components/schemas/MessageRequestBody" }`
- ❌ `{ "$ref": "../components/schemas/MessageRequestBody.yaml" }`

### 实现策略

#### 1. 提取类型名称

从引用中提取类型名称：
- `#/components/schemas/MessageRequestBody` → `MessageRequestBody`
- `../components/schemas/MessageRequestBody.yaml` → `MessageRequestBody`
- `#/components/schemas/ValidationError` → `ValidationError`

#### 2. 统一转换

所有引用都转换为：
```json
{
  "$ref": "MessageRequestBody"
}
```

或者使用更简洁的形式：
```json
{
  "type": "MessageRequestBody"
}
```

#### 3. 验证类型存在

确保转换后的类型名称在主文档的 `components.schemas` 中存在。

## 实现方案

### 核心修改

#### 1. 添加类型名称提取函数

```typescript
/**
 * 从 $ref 中提取类型名称
 */
function extractTypeName(ref: string): string | null {
  // 内部引用：#/components/schemas/TypeName
  if (ref.startsWith('#/components/schemas/')) {
    return ref.replace('#/components/schemas/', '')
  }
  
  // 外部引用：../components/schemas/TypeName.yaml
  const externalMatch = ref.match(/components\/schemas\/([^\/\.]+)(?:\.yaml)?(?:#.*)?$/)
  if (externalMatch) {
    return externalMatch[1]
  }
  
  // 其他情况
  return null
}

/**
 * 将 $ref 转换为类型名称引用
 */
function convertToTypeRef(ref: string, mainDoc: OpenAPIDocument): { "$ref": string } | null {
  const typeName = extractTypeName(ref)
  if (!typeName) {
    return null
  }
  
  // 验证类型存在于主文档中
  if (mainDoc.components?.schemas?.[typeName]) {
    return { "$ref": typeName }
  }
  
  return null
}
```

#### 2. 修改 `resolveInternalRefs`

```typescript
async function resolveInternalRefs(
  obj: any,
  mainDoc: OpenAPIDocument,
  baseDir?: string,
): Promise<any> {
  if (typeof obj === 'object' && '$ref' in obj) {
    const ref = (obj as any).$ref
    
    // 尝试转换为类型名称引用
    const typeRef = convertToTypeRef(ref, mainDoc)
    if (typeRef) {
      return typeRef
    }
    
    // 如果是外部引用，先解析再转换
    if (baseDir && (ref.startsWith('./') || ref.startsWith('../'))) {
      const resolvedValue = await resolveExternalRef(ref, baseDir, mainDoc)
      if (resolvedValue !== undefined) {
        // 递归处理解析后的值
        return await resolveInternalRefs(resolvedValue, mainDoc, baseDir)
      }
    }
    
    // 无法转换的情况，返回原对象
    return obj
  }
  
  // 递归处理对象和数组
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => resolveInternalRefs(item, mainDoc, baseDir)))
  }
  
  if (typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await resolveInternalRefs(value, mainDoc, baseDir)
    }
    return result
  }
  
  return obj
}
```

#### 3. 修改 `resolveComponentsRefs`

```typescript
async function resolveComponentsRefs(
  components: any,
  baseDir: string,
  mainDoc: OpenAPIDocument,
): Promise<any> {
  // ... 现有代码 ...
  
  for (const [name, value] of Object.entries(section as any)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && '$ref' in value) {
      const ref = (value as any).$ref
      
      // 尝试转换为类型名称引用
      const typeRef = convertToTypeRef(ref, mainDoc)
      if (typeRef) {
        resolved[sectionKey][name] = typeRef
        continue
      }
      
      // 外部引用：先解析再转换
      if (ref.startsWith('./') || ref.startsWith('../')) {
        const resolvedValue = await resolveExternalRef(ref, baseDir, mainDoc)
        if (resolvedValue !== undefined) {
          // 递归处理，会再次尝试转换为类型名称引用
          resolved[sectionKey][name] = await resolveInternalRefs(resolvedValue, mainDoc, baseDir)
        } else {
          resolved[sectionKey][name] = value
        }
      } else if (ref.startsWith('#')) {
        // 内部引用：转换为类型名称引用
        const typeRef = convertToTypeRef(ref, mainDoc)
        resolved[sectionKey][name] = typeRef || value
      } else {
        resolved[sectionKey][name] = value
      }
    }
    // ... 其他情况 ...
  }
}
```

## 示例

### 转换前

**Allinone 版本：**
```yaml
schema:
  $ref: "#/components/schemas/MessageRequestBody"
```

**Split 版本：**
```yaml
schema:
  $ref: "../components/schemas/MessageRequestBody.yaml"
```

### 转换后（统一）

**两个版本都变成：**
```yaml
schema:
  $ref: "MessageRequestBody"
```

或者更简洁的形式：
```yaml
schema:
  type: "MessageRequestBody"
```

## 实施步骤

### 阶段 1：实现类型名称提取

1. 实现 `extractTypeName` 函数
2. 处理各种引用格式：
   - `#/components/schemas/TypeName`
   - `../components/schemas/TypeName.yaml`
   - `./components/schemas/TypeName.yaml#/...`

### 阶段 2：实现转换逻辑

1. 实现 `convertToTypeRef` 函数
2. 验证类型存在于主文档中
3. 处理边界情况（类型不存在、名称不匹配等）

### 阶段 3：集成到解析流程

1. 在 `resolveInternalRefs` 中调用转换
2. 在 `resolveComponentsRefs` 中调用转换
3. 确保所有引用都被转换

### 阶段 4：测试验证

1. 重新生成 allinone 和 split 版本的 IR
2. 验证所有引用都转换为类型名称
3. 验证两个版本完全一致

## 预期效果

实施后：
- ✅ **完全统一**：Allinone 和 Split 版本的 IR **完全一致**
- ✅ **简洁明确**：引用都是类型名称，如 `MessageRequestBody`
- ✅ **消除路径差异**：不再有 `#/components/schemas/` 或 `../components/schemas/` 的区别
- ✅ **符合设计理念**：关注类型名称，不关心存储路径

## 注意事项

1. **类型名称唯一性**：确保 `components.schemas` 中的类型名称是唯一的
2. **验证存在性**：转换前验证类型在主文档中存在
3. **错误处理**：如果类型不存在，应该保留原引用或报错
4. **向后兼容**：确保代码生成逻辑能处理新的引用格式

## 引用格式对比

| 原始格式 | 转换后 |
|---------|--------|
| `#/components/schemas/MessageRequestBody` | `MessageRequestBody` |
| `../components/schemas/MessageRequestBody.yaml` | `MessageRequestBody` |
| `./components/schemas/ValidationError.yaml` | `ValidationError` |
| `#/components/schemas/HTTPValidationError` | `HTTPValidationError` |

## 可选：更简洁的表示

如果不想使用 `$ref`，可以考虑直接使用类型名称：

```yaml
# 选项 1：使用 $ref（保持 OpenAPI 兼容）
schema:
  $ref: "MessageRequestBody"

# 选项 2：使用 type（更简洁）
schema:
  type: "MessageRequestBody"

# 选项 3：使用自定义字段
schema:
  typeName: "MessageRequestBody"
```

建议使用选项 1（`$ref`），因为：
- 保持与 OpenAPI 规范的兼容性
- 代码生成逻辑可能已经处理了 `$ref`
- 语义清晰（明确表示这是一个引用）
