# 项目编码规则

## 核心原则

本项目采用函数式编程风格，所有代码必须遵循以下规则：

### 1. 函数式风格

- **不使用 class**：所有逻辑都通过纯函数实现
- **不使用 interface**：使用 type 定义类型
- **纯函数优先**：函数不应有副作用，除非明确需要

### 2. 函数大小限制

- **每个函数不超过 20 行**
- 大函数必须拆分为多个小函数
- 通过组合小函数来实现复杂逻辑

### 3. 文件大小限制

- **每个文件不超过 200 行**
- 大文件必须拆分为多个小文件
- 每个文件保持单一职责

### 4. 文件职责原则

- **每个文件最多只 export 一个函数或一个聚合对象**，types 不限
- 每个文件必须有明确的单一职责
- 文件名应该清晰反映其职责
- **职责边界必须清晰**：能够明确说明什么代码应该放进来，什么代码不该进来

#### 允许的模式

- **单函数导出**：`export function functionName(...) { ... }`
- **聚合对象导出**：将特定领域的工具函数聚合到一个对象中
  - 示例：`path-util.ts` 导出 `PathUtil` 对象，包含所有路径计算相关的工具函数
  - 示例：`string-util.ts` 导出 `capitalize` 函数，专门处理字符串操作
  - 对象内的函数应该有明确的领域边界（如路径计算、字符串处理）

#### 禁止的模式

- **通用工具文件**：`utils.ts` 这种没有明确职责边界的文件
  - 问题：无法明确说明什么代码应该放进来，什么代码不该进来
  - 解决：按领域拆分为多个文件（如 `path-util.ts`、`string-util.ts`）

### 5. 文件夹结构规范

#### 单模块文件夹 (Single Module Folder)

- **必须包含 `index.ts`**
- **单一职责**：`index.ts` 中只 export 一个函数（types 可以多个）
- **扁平结构**：所有实现文件直接放在模块目录下，不需要 `impl/` 子目录
- 示例：
  - `loader/` - 负责加载 OpenAPI 文档，export `load` 函数
  - `analyzers/` - 负责分析文档，export `runAnalysis` 函数
  - `generators/` - 负责生成代码，export `runGeneration` 函数
  - `command/` - 负责 CLI 程序，export `createProgram` 函数

#### 类型模块文件夹 (Types Module Folder)

- **可以有 `index.ts`** 统一导出
- **无单一职责限制**：按语义组织相关类型
- 示例：`types/` - 包含 `document.ts`、`task.ts`、`result.ts` 等

#### 多模块文件夹 (Multi-Module Folder)

- **不包含 `index.ts`**：每个文件都是独立的模块
- **按领域组织**：相关但职责不同的工具函数放在一起
- **导入时直接引用具体文件**：`import { PathUtil } from './common/path-util'`
- 示例：
  - `common/` - 包含 `path-util.ts`、`string-util.ts`、`route-collector.ts` 等
  - `utils/` - 允许，类似 `common/` 的多模块文件夹

### 6. 导入规范

- **禁止显式导入 `index.ts`**
- 导入模块时直接导入文件夹：`import { load } from './loader'`
- 内部文件间导入具体文件：`import { toDocument } from './to-document'`

### 7. 文件夹文档

- **每个文件夹必须有 `README.md`**
- 说明模块职责、聚合入口函数、内部实现文件列表

### 8. 文件布局规范

每个文件必须遵循统一的布局：

```typescript
// 文件顶部职责说明注释
/**
 * functionName(params): ReturnType
 * - param1: 参数说明
 * - 返回: 返回值说明
 */

// imports 部分
import statements...

// types 部分（如果需要）
type definitions...

// 文件级常量和变量（如果需要）
const SOME_CONSTANT = ...
const someMapping = { ... }

// export function (只有一个)
export function mainFunction(...) {
  // 函数实现
}

// internal functions (如果需要)
function helperFunction(...) {
  // 辅助函数实现
}
```

### 9. 文件职责说明

- **每个文件顶部必须有职责说明注释**
- 使用 `/** */` 格式
- 格式要求：
  - 输出函数名和签名
  - 输入参数代表什么
  - 输出结果代表什么

## 代码审查清单

提交代码前请检查：

- [ ] 是否使用了 class 或 interface？
- [ ] 每个函数是否超过 20 行？
- [ ] 每个文件是否超过 200 行？
- [ ] 文件是否只 export 一个函数或一个聚合对象？
- [ ] 文件的职责边界是否清晰（能明确说明什么代码应该放进来，什么代码不该进来）？
- [ ] 单模块文件夹是否有 index.ts 且只 export 一个函数？
- [ ] 是否直接导入了 index.ts？
- [ ] 每个文件夹是否有 README.md？
- [ ] 文件布局是否符合规范？
- [ ] 文件顶部是否有职责说明？

## 重构指南

### 函数拆分技巧

1. **提取纯函数**：将复杂逻辑提取为独立的纯函数
2. **参数传递**：通过参数传递数据，避免闭包
3. **组合函数**：使用函数组合来构建复杂行为（如 reduce）

### 文件拆分技巧

1. **职责分离**：每个文件只做一件事
2. **类型分离**：将类型定义移到 `types/` 模块
3. **工具函数按领域拆分**：
   - 不要创建通用的 `utils.ts`
   - 按领域创建专门的文件（如 `path-util.ts`、`string-util.ts`）
   - 如果工具函数属于同一领域，可以聚合到一个对象中导出
4. **职责边界检查**：在拆分前问自己：
   - 这个文件的职责是什么？
   - 什么代码应该放进来？
   - 什么代码不应该放进来？
   - 如果无法清晰回答，说明职责边界不清晰，需要进一步拆分

### 文件夹组织

1. **单模块文件夹**：有 index.ts，只 export 一个函数
2. **类型模块**：types/ 按语义组织，无单一职责限制
3. **文档化**：为每个文件夹创建 README.md
