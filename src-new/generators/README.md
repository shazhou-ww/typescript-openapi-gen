# Generators (单模块文件夹)

## 职责

从 OpenApiDocument 生成代码，返回生成结果。

## 聚合入口

```typescript
runGeneration(doc: OpenApiDocument, task: GenerationTask): Promise<GenerationResult>
```

- **doc**: OpenApiDocument
- **task**: 生成任务，包含要运行的 generator 名称列表、输出目录等
- **返回**: GenerationResult，包含 success、diagnostics、files、volume

## 可用的 Generators

- `controller` - 生成控制器代码
- `openapi` - 生成 OpenAPI 规范文件
- `ir` - 生成 IR JSON 文件

## 内部实现

- `runner.ts` - 主运行函数
- `controller-generator.ts` - 控制器生成器
- `openapi-generator.ts` - OpenAPI 生成器
- `ir-generator.ts` - IR 生成器
- `file-writer.ts` - 文件写入工具
