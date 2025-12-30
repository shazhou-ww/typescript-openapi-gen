/**
 * PathUtil: 路径计算相关的工具函数集合
 * 
 * 职责边界：
 * - 应该包含：所有与路径计算、路径转换、路径解析相关的工具函数
 * - 不应该包含：字符串通用操作（如 capitalize）、其他领域的工具函数
 * 
 * 导出: PathUtil 对象
 */

export const PathUtil = {
  segmentToFsName(segment: string): string {
    const match = segment.match(/^\{(.+)\}$/);
    return match ? `_${match[1]}` : segment;
  },

  routePathToFsPath(routePath: string): string {
    return routePath
      .split('/')
      .filter(Boolean)
      .map(segment => PathUtil.segmentToFsName(segment))
      .join('/');
  },

  extractPathParams(routePath: string): string[] {
    const paramRegex = /\{([^}]+)\}/g;
    const params: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = paramRegex.exec(routePath)) !== null) {
      params.push(match[1]);
    }

    return params;
  },

  segmentToExportName(segment: string): string {
    // Convert segment to valid JavaScript identifier
    // Replace all non-alphanumeric characters (except _ and $) with underscore
    return segment.replace(/[^a-zA-Z0-9_$]/g, '_');
  },
};

