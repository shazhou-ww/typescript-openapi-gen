/**
 * writeVolumeToDisk(volume: Volume, outputDir: string): Promise<void>
 * - volume: 内存文件系统
 * - outputDir: 输出目录
 * - 返回: Promise<void>
 */

import type { Volume } from '../../types';
import * as fs from 'node:fs';
import * as path from 'node:path';

export async function writeVolumeToDisk(volume: Volume, outputDir: string): Promise<void> {
  const files = getAllFiles(volume, '/');

  for (const filePath of files) {
    const fullPath = path.join(outputDir, filePath);
    const dir = path.dirname(fullPath);

    await fs.promises.mkdir(dir, { recursive: true });

    const content = volume.readFileSync(filePath, 'utf-8') as string;
    await fs.promises.writeFile(fullPath, content);
  }
}

function getAllFiles(volume: Volume, dir: string): string[] {
  const files: string[] = [];

  try {
    const items = volume.readdirSync(dir) as string[];
    for (const item of items) {
      const fullPath = dir === '/' ? `/${item}` : `${dir}/${item}`;
      const stat = volume.statSync(fullPath);

      if (stat.isFile()) {
        files.push(fullPath);
      } else if (stat.isDirectory()) {
        getAllFiles(volume, fullPath).forEach(f => files.push(f));
      }
    }
  } catch {
    // 忽略错误
  }

  return files;
}
