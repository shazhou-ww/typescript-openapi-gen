# TypeScript OpenAPI Generator

Generate TypeScript controllers and routes from OpenAPI specifications with full type safety and framework support.

## Features

- 🚀 **Multi-Framework Support**: Generate routes for Elysia, Express, Fastify, and Hono
- 📝 **Type-Safe Controllers**: Auto-generated TypeScript interfaces and Zod validation
- 🔄 **Server-Sent Events**: Built-in support for SSE endpoints
- 🎯 **Framework-Specific Optimization**: Tailored code generation for each framework
- ⚡ **Fast Generation**: Optimized parsing and code generation
- 🎨 **Auto-Formatting**: Integrated Prettier support

## Installation

```bash
npm install -g typescript-openapi-gen
# or
pnpm add -g typescript-openapi-gen
# or
yarn global add typescript-openapi-gen
```

## Quick Start

### 1. Generate Controllers

```bash
tsoapi gen controller openapi.yaml -o ./src/controllers
```

### 2. Generate Routes

Choose your framework:

```bash
# Elysia (recommended)
tsoapi gen router elysia openapi.yaml -o ./src

# Express
tsoapi gen router express openapi.yaml -o ./src

# Fastify
tsoapi gen router fastify openapi.yaml -o ./src

# Hono
tsoapi gen router hono openapi.yaml -o ./src
```

### 3. Or Generate Everything at Once

```bash
# Generate both controllers and routes
tsoapi gen elysia openapi.yaml -o ./src
```

## Generated Code Structure

For an OpenAPI spec with `/pets` and `/pets/{petId}` endpoints:

```
src/
├── controllers/           # Generated controllers
│   ├── index.ts          # Main exports
│   ├── shared-types/     # Shared OpenAPI types
│   │   ├── index.ts
│   │   ├── Pet.gen.ts
│   │   └── Error.gen.ts
│   └── pets/             # Route-specific controllers
│       ├── index.ts
│       ├── types.gen.ts  # Input/output types
│       ├── methods.gen.ts # Validated handlers
│       ├── get.ts        # User handler (GET /pets)
│       ├── post.ts       # User handler (POST /pets)
│       └── _petId/       # Path parameters
│           ├── get.ts    # GET /pets/{petId}
│           ├── put.ts    # PUT /pets/{petId}
│           └── delete.ts # DELETE /pets/{petId}
├── elysia-router.ts      # Generated routes
└── ...
```

## Framework-Specific Features

### Elysia
- Native type inference with chained route definitions
- Built-in SSE support with `yield*`

### Express
- Traditional middleware pattern
- SSE with proper headers and streaming

### Fastify
- `@fastify/type-provider-typebox` integration
- Native SSE plugin support

### Hono
- `hono/streaming` integration
- Optimized for edge environments

## Advanced Usage

### Custom Output Structure

```bash
# Custom folder names
tsoapi gen controller openapi.yaml \
  --output-dir ./src \
  --controller-folder handlers \
  --shared-types-folder types

# Custom route file
tsoapi gen router elysia openapi.yaml \
  --output-dir ./src \
  --router-file api-routes.ts
```

### Prettier Integration

The generator automatically detects and uses your project's Prettier configuration, or you can specify a custom config:

```bash
tsoapi gen controller openapi.yaml -o ./src --prettier ./prettier.config.js
```

## Type Safety Strategy

1. **Route Layer**: Extracts parameters from framework requests
2. **Controller Layer**: Zod schemas validate and transform inputs
3. **Handler Layer**: Your business logic with full type safety

```typescript
// Generated types.gen.ts
export interface GetInput {
  query: { limit?: number; offset?: number }
}
export const GetInputSchema = z.object({
  query: z.object({
    limit: z.number().int().max(100).optional(),
    offset: z.number().int().optional(),
  })
})

// Generated methods.gen.ts
export async function handleGet(input: unknown): Promise<GetOutput> {
  const validated = GetInputSchema.parse(input)
  return _handleGet(validated) // Your handler with validated input
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Development mode
pnpm dev gen controller openapi.yaml -o ./src
```

## Examples

See the `test/e2e/gen/petstore/` directory for complete generated examples.

## License

ISC

