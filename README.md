# typescript-openapi-gen

Generate TypeScript controller code from OpenAPI specification.

## Installation

```bash
pnpm install
pnpm build
```

## Usage

### Generate Controllers

```bash
tsoapi gen controller <openapi-file> -o <output-directory>
```

**Example:**

```bash
tsoapi gen controller openapi.yaml -o ./src/controllers
```

This will generate a controller skeleton with:
- Route-based folder structure matching your API paths
- Type definitions for request inputs and response outputs
- Shared types from OpenAPI schemas
- Support for SSE (Server-Sent Events) endpoints

### Generated Structure

For an OpenAPI spec with paths like `/pets` and `/pets/{petId}`, the generator creates:

```
controllers/
├── types/
│   └── index.ts          # Shared types from components/schemas
├── pets/
│   ├── index.ts          # Re-exports
│   ├── types.ts          # Input/Output types for this route
│   ├── get.ts            # GET handler
│   ├── post.ts           # POST handler
│   └── _petId/
│       ├── index.ts
│       ├── types.ts
│       ├── get.ts
│       ├── put.ts
│       └── delete.ts
```

## Development

```bash
# Run in development mode
pnpm dev gen controller <file> -o <output>

# Build
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## License

ISC

