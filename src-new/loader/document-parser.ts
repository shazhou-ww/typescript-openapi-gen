/**
 * parseDocumentContent(content: string, filePath: string): unknown
 * - content: 文件的文本内容
 * - filePath: 文件路径，用于确定解析格式
 * - 返回: 解析后的文档对象
 */
import * as path from 'node:path';
import * as yaml from 'js-yaml';

export function parseDocumentContent(content: string, filePath: string): unknown {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === '.yaml' || ext === '.yml') {
      return yaml.load(content);
    }

    if (ext === '.json') {
      return JSON.parse(content);
    }

    // 尝试作为 YAML 解析（YAML 是 JSON 的超集）
    try {
      return yaml.load(content);
    } catch {
      return JSON.parse(content);
    }
  } catch (error) {
    throw new Error(`Failed to parse OpenAPI file: ${error instanceof Error ? error.message : String(error)}`);
  }
}
