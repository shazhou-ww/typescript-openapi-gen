import { Analyzer, OpenApiDocument, Diagnostic } from '../../types';

/**
 * 验证诊断类型
 */
export interface ValidationDiagnostic extends Diagnostic {
  code?: string;
}

/**
 * OpenAPI 验证器的 analyze 函数
 */
async function* analyzeOpenApi(document: OpenApiDocument): AsyncGenerator<ValidationDiagnostic> {
  // 基础结构验证
  yield* validateBasicStructure(document);

  // 路径验证
  yield* validatePaths(document);

  // 组件验证
  yield* validateComponents(document);

  // 安全验证
  yield* validateSecurity(document);
}

/**
 * OpenAPI 验证器的 report 函数
 */
function reportValidationDiagnostic(diagnostic: ValidationDiagnostic): void {
  const prefix = diagnostic.type === 'error' ? '❌' :
                 diagnostic.type === 'warning' ? '⚠️' : 'ℹ️';

  console.log(`${prefix} ${diagnostic.message}`);

  if (diagnostic.location) {
    const location = diagnostic.location;
    let locationStr = '';
    if (location.file) locationStr += `file: ${location.file}`;
    if (location.line) locationStr += ` line: ${location.line}`;
    if (location.column) locationStr += ` column: ${location.column}`;
    if (locationStr) console.log(`   at ${locationStr}`);
  }

  if (diagnostic.code) {
    console.log(`   code: ${diagnostic.code}`);
  }
}

/**
 * 创建 OpenAPI 验证器
 */
export function createOpenApiValidator(): Analyzer<ValidationDiagnostic> {
  return {
    analyze: analyzeOpenApi,
    report: reportValidationDiagnostic,
  };
}

function* validateBasicStructure(document: OpenApiDocument): Generator<ValidationDiagnostic> {
  // 检查必需字段
  if (!document.openapi && !('swagger' in document)) {
    yield {
      type: 'error',
      message: 'Missing required field: openapi or swagger',
      code: 'MISSING_VERSION',
    };
  }

  if (!document.info) {
    yield {
      type: 'error',
      message: 'Missing required field: info',
      code: 'MISSING_INFO',
    };
  }

  if (!document.paths) {
    yield {
      type: 'error',
      message: 'Missing required field: paths',
      code: 'MISSING_PATHS',
    };
  }
}

function* validatePaths(document: OpenApiDocument): Generator<ValidationDiagnostic> {
  if (!document.paths) return;

  for (const [path, pathItem] of Object.entries(document.paths)) {
    // 验证路径格式
    if (!path.startsWith('/')) {
      yield {
        type: 'error',
        message: `Path must start with '/': ${path}`,
        location: { file: 'paths' },
        code: 'INVALID_PATH_FORMAT',
      };
    }

    // 验证路径参数
    const pathParams = path.match(/\{([^}]+)\}/g) || [];
    const operationParams = new Set<string>();

    if (pathItem) {
      // 检查每个操作
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
      for (const method of methods) {
        const operation = pathItem[method];
        if (operation) {
          // 收集操作中的参数
          if (operation.parameters) {
            for (const param of operation.parameters) {
              if ('$ref' in param) continue; // 跳过引用
              if (param.in === 'path' && param.name) {
                operationParams.add(param.name);
              }
            }
          }

          // 验证路径参数是否在操作中定义
          for (const param of pathParams) {
            const paramName = param.slice(1, -1); // 移除 { }
            if (!operationParams.has(paramName)) {
              yield {
                type: 'error',
                message: `Path parameter '${paramName}' in path '${path}' is not defined in ${method.toUpperCase()} operation`,
                location: { file: `paths.${path}.${method}` },
                code: 'UNDEFINED_PATH_PARAMETER',
              };
            }
          }
        }
      }
    }
  }
}

function* validateComponents(document: OpenApiDocument): Generator<ValidationDiagnostic> {
  if (!document.components) return;

  // 验证 schemas
  if (document.components.schemas) {
    for (const [name, schema] of Object.entries(document.components.schemas)) {
      yield* validateSchema(name, schema, `components.schemas.${name}`);
    }
  }
}

function* validateSecurity(document: OpenApiDocument): Generator<ValidationDiagnostic> {
  // 验证全局安全要求
  if (document.security) {
    for (const [index, requirement] of document.security.entries()) {
      for (const [schemeName, scopes] of Object.entries(requirement)) {
        // 检查安全方案是否存在
        const scheme = document.components?.securitySchemes?.[schemeName];
        if (!scheme) {
          yield {
            type: 'error',
            message: `Security scheme '${schemeName}' referenced in global security is not defined`,
            location: { file: `security[${index}]` },
            code: 'UNDEFINED_SECURITY_SCHEME',
          };
        }
      }
    }
  }
}

function* validateSchema(name: string, schema: any, path: string): Generator<ValidationDiagnostic> {
  // 基本 schema 验证
  if (schema.type === 'object' && schema.properties) {
    // 验证必需属性
    if (schema.required) {
      for (const requiredProp of schema.required) {
        if (!(requiredProp in schema.properties)) {
          yield {
            type: 'error',
            message: `Required property '${requiredProp}' is not defined in schema '${name}'`,
            location: { file: path },
            code: 'UNDEFINED_REQUIRED_PROPERTY',
          };
        }
      }
    }
  }
}
