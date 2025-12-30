# Common Utilities

Generator 模块的公共工具函数集合。

## 职责

提供所有 generator 共享的工具函数和辅助功能。

## 导出函数

### utils.ts

- `capitalize` - 首字母大写
- `segmentToFsName` - 将路径段转换为文件系统名称
- `routePathToFsPath` - 将路由路径转换为文件系统路径
- `extractPathParams` - 提取路径参数
- `segmentToExportName` - 将路径段转换为导出名称

### route-collector.ts

- `collectRoutes` - 收集并扁平化路由列表
- `FlatRoute` - 扁平化路由类型

### type-generator.ts

- `schemaToTypeScript` - 将 JSON Schema 转换为 TypeScript 类型字符串

### zod-schema-converter.ts

- `schemaToZod` - 将 JSON Schema 转换为 Zod schema 代码字符串

### shared-types-generator.ts

- `generateSharedTypes` - 生成共享类型文件
