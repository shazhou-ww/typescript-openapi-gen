/**
 * generateOpenApi(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import * as yaml from 'js-yaml';

export function generateOpenApi(doc: OpenApiDocument, volume: Volume): Volume {
  const openApiDoc = toOpenApiFormat(doc);
  const content = yaml.dump(openApiDoc, { indent: 2, lineWidth: -1 });

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/openapi.yaml', content);

  return volume;
}

function toOpenApiFormat(doc: OpenApiDocument): Record<string, unknown> {
  // TODO: 实现完整的转换逻辑
  return {
    openapi: '3.0.0',
    info: { title: 'Generated API', version: '1.0.0' },
    paths: doc.paths,
    components: { schemas: doc.types },
  };
}
