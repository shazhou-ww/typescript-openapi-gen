# OpenAPI Generator

OpenAPI 生成器模块，负责从 OpenAPI 文档生成 OpenAPI 规范文件。

## 职责

- 生成完整的 OpenAPI 文档（all-in-one）
- 生成分片的 OpenAPI 文档（in-controller 模式）
  - 在每个 controller folder 中生成 route.yaml/json 片段
  - 在 shared-types 中生成 schema.yaml/json 片段
  - 在顶层生成合并后的 openapi.yaml/json

## 聚合入口函数

- `generateOpenApi` - 主入口函数，在 `index.ts` 中导出

## 内部实现文件

- `index.ts` - 主入口，导出 `generateOpenApi` 函数
- `converter.ts` - OpenAPI 格式转换工具（将 OpenApiDocument 转换为标准 OpenAPI 格式）
- `fragment-generator.ts` - OpenAPI 片段生成工具（生成 route 片段和 schema 片段）

## 生成模式

### All-in-One 模式

当 `openApi.allInOnePath` 指定时，在指定路径生成完整的 OpenAPI 文档。

### In-Controller 模式

当 `openApi.inController` 为 true 时：
- 在每个 controller folder 中生成 `route.yaml` 或 `route.json`（包含该 controller 的所有路由）
- 在 shared-types folder 中生成 `schema.yaml` 或 `schema.json`（包含所有共享类型定义）
- 在顶层生成 `openapi.yaml` 或 `openapi.json`（合并所有片段）

## 文件覆盖策略

- 所有生成的 OpenAPI 文件（yaml/json）都会被覆盖

