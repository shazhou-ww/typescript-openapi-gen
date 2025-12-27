# Split OpenAPI 版本修复指南

## 问题概述

在 split 版本的 OpenAPI 定义中，有 5 个路径的引用指向了错误的文件，导致这些路径无法正确解析。另外 2 个路径的引用是正确的，但可能有细微的内容差异。这些问题导致生成的 IR 与 allinone 版本不一致。

## 修复方法

需要在 `mitsein.yaml` 文件中修正这些路径的 `$ref` 引用，使其指向正确的文件。

## 需要修复的路径

> **注意：** 前 5 个路径的引用指向了错误的文件，必须修复。后 2 个路径的引用是正确的，但可能有内容差异，需要进一步检查。

### 1. `/api/agent/quick-start`

**当前引用（错误）：**
```yaml
/api/agent/quick-start:
  $ref: ./api/agent-runs.yaml#/~1api~1agent~1quick-start
```

**应该改为：**
```yaml
/api/agent/quick-start:
  $ref: ./api/common.yaml#/~1api~1agent~1quick-start
```

**原因：** 该路径实际定义在 `api/common.yaml` 文件中，而不是 `api/agent-runs.yaml`。

---

### 2. `/api/share/project/get`

**当前引用（错误）：**
```yaml
/api/share/project/get:
  $ref: ./api/projects.yaml#/~1api~1share~1project~1get
```

**应该改为：**
```yaml
/api/share/project/get:
  $ref: ./api/common.yaml#/~1api~1share~1project~1get
```

**原因：** 该路径实际定义在 `api/common.yaml` 文件中，而不是 `api/projects.yaml`。

---

### 3. `/api/share/thread/get`

**当前引用（错误）：**
```yaml
/api/share/thread/get:
  $ref: ./api/threads.yaml#/~1api~1share~1thread~1get
```

**应该改为：**
```yaml
/api/share/thread/get:
  $ref: ./api/common.yaml#/~1api~1share~1thread~1get
```

**原因：** 该路径实际定义在 `api/common.yaml` 文件中，而不是 `api/threads.yaml`。

---

### 4. `/api/thread/{thread_id}/agent/start`

**当前引用（错误）：**
```yaml
/api/thread/{thread_id}/agent/start:
  $ref: ./api/agent-runs.yaml#/~1api~1thread~1{thread_id}~1agent~1start
```

**应该改为：**
```yaml
/api/thread/{thread_id}/agent/start:
  $ref: ./api/threads.yaml#/~1api~1thread~1{thread_id}~1agent~1start
```

**原因：** 该路径实际定义在 `api/threads.yaml` 文件中，而不是 `api/agent-runs.yaml`。

---

### 5. `/api/thread/{thread_id}/agent-runs`

**当前引用（错误）：**
```yaml
/api/thread/{thread_id}/agent-runs:
  $ref: ./api/agent-runs.yaml#/~1api~1thread~1{thread_id}~1agent-runs
```

**应该改为：**
```yaml
/api/thread/{thread_id}/agent-runs:
  $ref: ./api/threads.yaml#/~1api~1thread~1{thread_id}~1agent-runs
```

**原因：** 该路径实际定义在 `api/threads.yaml` 文件中，而不是 `api/agent-runs.yaml`。

---

### 6. `/api/debug/config/llm`

**当前引用：**
```yaml
/api/debug/config/llm:
  $ref: ./api/debug.yaml#/~1api~1debug~1config~1llm
```

**状态：** ✅ 引用正确，路径确实存在于 `api/debug.yaml` 文件中。

**说明：** 该路径的引用是正确的，但生成的 IR 中可能有内容差异。差异可能在于：
- Allinone 版本可能将某些内部引用（如 `#/components/schemas/LLMParameterLimits`）解析为了完整对象
- Split 版本保持了 `$ref` 形式（这是正确的行为）

如果修复前 5 个路径后仍有差异，需要检查 allinone 版本是否过度解析了某些引用。

---

### 7. `/api/triggers`

**当前引用：**
```yaml
/api/triggers:
  $ref: ./api/triggers.yaml#/~1api~1triggers
```

**状态：** ✅ 引用正确，路径确实存在于 `api/triggers.yaml` 文件中。

**说明：** 该路径的引用是正确的，但生成的 IR 中可能有内容差异。差异可能在于：
- Allinone 版本可能将某些内部引用解析为了完整对象
- Split 版本保持了 `$ref` 形式（这是正确的行为）

如果修复前 5 个路径后仍有差异，需要检查 allinone 版本是否过度解析了某些引用。

---

## 快速修复清单

在 `mitsein.yaml` 文件的 `paths` 部分，需要修改以下 5 处：

| 路径 | 当前引用 | 应该改为 |
|------|---------|---------|
| `/api/agent/quick-start` | `./api/agent-runs.yaml#/~1api~1agent~1quick-start` | `./api/common.yaml#/~1api~1agent~1quick-start` |
| `/api/share/project/get` | `./api/projects.yaml#/~1api~1share~1project~1get` | `./api/common.yaml#/~1api~1share~1project~1get` |
| `/api/share/thread/get` | `./api/threads.yaml#/~1api~1share~1thread~1get` | `./api/common.yaml#/~1api~1share~1thread~1get` |
| `/api/thread/{thread_id}/agent/start` | `./api/agent-runs.yaml#/~1api~1thread~1{thread_id}~1agent~1start` | `./api/threads.yaml#/~1api~1thread~1{thread_id}~1agent~1start` |
| `/api/thread/{thread_id}/agent-runs` | `./api/agent-runs.yaml#/~1api~1thread~1{thread_id}~1agent-runs` | `./api/threads.yaml#/~1api~1thread~1{thread_id}~1agent-runs` |

## 修复步骤

1. 打开 `mitsein.yaml` 文件
2. 找到 `paths` 部分
3. 按照上述列表，逐个修正每个路径的 `$ref` 引用
4. 保存文件
5. 使用 `tsoapi ir` 命令重新生成 IR，验证修复是否成功

## 验证方法

修复后，可以使用以下命令验证：

```bash
# 生成 split 版本的 IR
tsoapi ir mitsein.yaml --output ir-split.yaml

# 生成 allinone 版本的 IR
tsoapi ir mitsein.allinone.yaml --output ir-allinone.yaml

# 比较两个 IR 文件
# 应该看到所有路径都完全一致
```

## 预期结果

修复完成后：
- 前 5 个路径应该能够正确解析（不再是未解析的 `$ref`）
- 所有 136 个路径应该完全一致（或至少 129+ 个路径一致）
- IR 中的内部引用（`#/components/schemas/...`）应该保持为 `$ref` 形式，而不是解析为完整对象
- split 版本和 allinone 版本的 IR 应该基本一致（如果后 2 个路径仍有差异，需要进一步检查）

## 注意事项

- JSON Pointer 路径（`#/~1api~1...`）中的 `~1` 表示 `/`，`~0` 表示 `~`
- 修改时只需要更改文件路径部分（`./api/xxx.yaml`），JSON Pointer 部分保持不变
- 确保文件路径使用相对路径，相对于 `mitsein.yaml` 文件的位置
