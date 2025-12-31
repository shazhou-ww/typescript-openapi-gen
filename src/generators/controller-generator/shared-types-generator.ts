/**
 * generateSharedTypes(volume: Volume, doc: OpenApiDocument, sharedTypesDir: string): void
 * - volume: 内存文件系统
 * - doc: OpenApiDocument
 * - sharedTypesDir: 共享类型目录路径
 */

import type { OpenApiDocument, Volume } from '../../types';
import { schemaToTypeScript } from '../common/type-generator';
import { schemaToElysia } from '../common/elysia-schema-converter';

export function generateSharedTypes(
  volume: Volume,
  doc: OpenApiDocument,
  sharedTypesDir: string
): void {
  const typeExports: string[] = [];
  const schemaExports: string[] = [];

  for (const [typeName, schema] of Object.entries(doc.types)) {
    const typeDef = schemaToTypeScript(schema, typeName);
    const schemaDef = schemaToElysia(schema, sharedTypesDir);
    const fileName = `${typeName}.ts`;
    const filePath = `${sharedTypesDir}/${fileName}`;

    const content = `// Auto-generated type file
// DO NOT EDIT - This file is regenerated on each run

import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

export const ${typeName}Schema = ${schemaDef};

export type ${typeName} = Static<typeof ${typeName}Schema>;
`;

    volume.writeFileSync(filePath, content);
    typeExports.push(`export type { ${typeName} } from './${typeName}';`);
    schemaExports.push(`export { ${typeName}Schema } from './${typeName}';`);
  }

  if (typeExports.length > 0 || schemaExports.length > 0) {
    const indexContent = [
      '// Auto-generated index file',
      '// DO NOT EDIT - This file is regenerated on each run',
      '',
      ...typeExports,
      ...(typeExports.length > 0 && schemaExports.length > 0 ? [''] : []),
      ...schemaExports,
    ].join('\n');
    volume.writeFileSync(`${sharedTypesDir}/index.ts`, indexContent);
  }
}

