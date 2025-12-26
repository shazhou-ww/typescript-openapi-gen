/**
 * Format property name for TypeScript object type
 * Wraps in quotes if the name contains special characters
 */
export function formatPropertyName(name: string): string {
  const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)
  return isValidIdentifier ? name : `'${name}'`
}

/**
 * Build auto-generated file header comment
 */
export function buildFileHeader(description: string): string[] {
  return [
    `// Auto-generated ${description}`,
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
  ]
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

