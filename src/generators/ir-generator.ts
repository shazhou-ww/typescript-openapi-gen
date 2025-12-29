/**
 * generateIr(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';

export function generateIr(doc: OpenApiDocument, volume: Volume): Volume {
  const content = JSON.stringify(doc, null, 2);

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/ir.json', content);

  return volume;
}
