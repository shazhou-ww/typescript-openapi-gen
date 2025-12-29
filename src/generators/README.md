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
- `express-router` - 生成 Express 路由文件
- `elysia-router` - 生成 Elysia 路由文件
- `fastify-router` - 生成 Fastify 路由文件
- `hono-router` - 生成 Hono 路由文件

## 内部实现

- `runner.ts` - 主运行函数
- `controller-generator.ts` - 控制器生成器
- `controller-recursive.ts` - 递归生成控制器
- `controller-files.ts` - 生成控制器文件
- `controller-types.ts` - 生成类型文件
- `controller-method.ts` - 生成方法文件
- `controller-index.ts` - 生成 index 文件
- `shared-types-generator.ts` - 生成共享类型
- `route-tree.ts` - 构建路由树
- `route-collector.ts` - 收集路由
- `express-router-generator.ts` - Express 路由生成器
- `elysia-router-generator.ts` - Elysia 路由生成器
- `fastify-router-generator.ts` - Fastify 路由生成器
- `hono-router-generator.ts` - Hono 路由生成器
- `openapi-generator.ts` - OpenAPI 生成器
- `ir-generator.ts` - IR 生成器
- `file-writer.ts` - 文件写入工具
- `type-generator.ts` - 类型生成工具
- `utils.ts` - 工具函数
