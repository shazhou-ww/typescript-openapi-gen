/**
 * generateSharedTypes(volume: Volume, doc: OpenApiDocument, sharedTypesDir: string): void
 * - volume: 内存文件系统
 * - doc: OpenApiDocument
 * - sharedTypesDir: 共享类型目录路径
 */

import type { OpenApiDocument, Volume, JSONSchema, Ref } from '../types';
import { schemaToTypeScript } from './type-generator';

export function generateSharedTypes(
  volume: Volume,
  doc: OpenApiDocument,
  sharedTypesDir: string
): void {
  const indexLines: string[] = [];

  for (const [typeName, schema] of Object.entries(doc.types)) {
    const typeDef = schemaToTypeScript(schema, typeName);
    const fileName = `${typeName}.ts`;
    const filePath = `${sharedTypesDir}/${fileName}`;

    const content = `/**
 * ${typeName} type definition
 */

export type ${typeName} = ${typeDef};
`;

    volume.writeFileSync(filePath, content);
    indexLines.push(`export type { ${typeName} } from './${typeName}';`);
  }

  if (indexLines.length > 0) {
    volume.writeFileSync(`${sharedTypesDir}/index.ts`, indexLines.join('\n'));
  }
}

