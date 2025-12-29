# Loader (单模块文件夹)

## 职责

加载 OpenAPI 文档并转换为规范化的 OpenApiDocument (IR)。

使用 `@apidevtools/swagger-parser` 自动解析所有 `$ref`（包括跨文件引用）。

## 聚合入口

```typescript
load(path: string): Promise<OpenApiDocument>
```

- **path**: OpenAPI 文件路径（支持 YAML/JSON）
- **返回**: 规范化的 OpenApiDocument

## 内部实现

- `loader.ts` - 主加载函数（使用 swagger-parser）
- `to-document.ts` - 转换为 OpenApiDocument
- `to-path-item.ts` - 转换 PathItem
- `to-operation.ts` - 转换 Operation
- `to-json-schema.ts` - 转换 JSONSchema
