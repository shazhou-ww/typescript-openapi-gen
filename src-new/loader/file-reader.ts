/**
 * readFileContent(filePath: string): string
 * - filePath: 要读取的文件的路径
 * - 返回: 文件的文本内容
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

export function readFileContent(filePath: string): string {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`OpenAPI file not found: ${absolutePath}`);
  }

  return fs.readFileSync(absolutePath, 'utf-8');
}
