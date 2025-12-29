# Loader (单模块文件夹)

## 职责

加载 OpenAPI 文档并转换为规范化的 OpenApiDocument (IR)。

## 聚合入口

```typescript
load(path: string): Promise<OpenApiDocument>
```

- **path**: OpenAPI 文件路径（支持 YAML/JSON）
- **返回**: 规范化的 OpenApiDocument

## 内部实现

- `loader.ts` - 主加载函数
- `file-reader.ts` - 读取文件内容
- `document-parser.ts` - 解析 YAML/JSON
- `document-validator.ts` - 验证文档结构
- `to-document.ts` - 转换为 OpenApiDocument
- `to-path-item.ts` - 转换 PathItem
- `to-operation.ts` - 转换 Operation
- `to-json-schema.ts` - 转换 JSONSchema
