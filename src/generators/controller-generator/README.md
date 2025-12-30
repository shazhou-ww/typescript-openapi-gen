# Controller Generator

Controller 生成器模块，负责从 OpenAPI 文档生成 TypeScript controller 代码。

## 职责

- 生成 controller 骨架代码
- 生成类型定义和 Zod schema
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
- `method.ts` - 生成单个 HTTP 方法的 handler 文件
- `methods.ts` - 生成 methods.ts 文件（包含验证逻辑）
- `types.ts` - 生成类型定义和 Zod schema

## 文件覆盖策略

- Handler 文件（post.ts, get.ts, put.ts, delete.ts, patch.ts, head.ts, options.ts）：保留现有文件
- 其他文件（index.ts, types.ts, methods.ts）：覆盖
