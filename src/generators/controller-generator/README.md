# Controller Generator

Controller 生成器模块，负责从 OpenAPI 文档生成 TypeScript controller 代码。

## 职责

- 生成 controller 骨架代码
- 生成类型定义和 Elysia schema
- 生成 handler 方法文件
- 生成 index 文件用于导出

## 聚合入口函数

- `generateController` - 主入口函数，在 `index.ts` 中导出

## 内部实现文件

- `index.ts` - 主入口，导出 `generateController` 函数
- `route-tree.ts` - 构建路由树结构
- `shared-types-generator.ts` - 生成共享类型文件
- `recursive.ts` - 递归生成 controllers
- `files.ts` - 生成 controller 文件集合
- `index-file.ts` - 生成 index.ts 文件
- `operations.ts` - 生成 operations.ts 文件（包含所有 operation handlers）
- `types.ts` - 生成类型定义和 Elysia schema

## 生成的文件结构

每个 controller path 下包含：
- `types.ts` - 输入/输出类型和 Elysia schema（RouteSchema）
- `operations.ts` - 所有 operation handlers 的实现
- `index.ts` - 导出 types、schemas 和 operations

## 文件覆盖策略

- `operations.ts`：不覆盖（用户实现）
- 其他文件（index.ts, types.ts）：覆盖
