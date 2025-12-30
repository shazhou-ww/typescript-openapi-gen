# Router Generators

Router 生成器模块，负责为不同框架生成路由代码。

## 职责

为各种 Web 框架生成路由代码，将 OpenAPI 规范转换为框架特定的路由实现。

## 导出函数

### elysia.ts

- `generateElysiaRouter` - 生成 Elysia 框架的路由插件

### express.ts

- `generateExpressRouter` - 生成 Express 框架的路由

### fastify.ts

- `generateFastifyRouter` - 生成 Fastify 框架的路由装饰器

### hono.ts

- `generateHonoRouter` - 生成 Hono 框架的路由装饰器

## 文件覆盖策略

所有 router 文件都完全覆盖（router 文件应该总是重新生成）。

