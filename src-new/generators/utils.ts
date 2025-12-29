/**
 * 工具函数
 * 
 * 导出: capitalize, segmentToFsName, routePathToFsPath
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

