/**
 * capitalize(str: string): string
 * - str: 字符串
 * - 返回: 首字母大写的字符串
 * 
 * 职责边界：
 * - 应该包含：字符串基础操作相关的工具函数
 * - 不应该包含：路径计算、类型转换等其他领域的工具函数
 */

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

