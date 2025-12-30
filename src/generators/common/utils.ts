/**
 * 工具函数
 * 
 * 导出: capitalize, segmentToFsName, routePathToFsPath, extractPathParams, segmentToExportName
 */

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function segmentToFsName(segment: string): string {
  const match = segment.match(/^\{(.+)\}$/);
  return match ? `_${match[1]}` : segment;
}

export function routePathToFsPath(routePath: string): string {
  return routePath
    .split('/')
    .filter(Boolean)
    .map(segmentToFsName)
    .join('/');
}

export function extractPathParams(routePath: string): string[] {
  const paramRegex = /\{([^}]+)\}/g;
  const params: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = paramRegex.exec(routePath)) !== null) {
    params.push(match[1]);
  }

  return params;
}

export function segmentToExportName(segment: string): string {
  // Convert segment to valid JavaScript identifier
  // Replace all non-alphanumeric characters (except _ and $) with underscore
  return segment.replace(/[^a-zA-Z0-9_$]/g, '_');
}

