/**
 * string-util.test.ts
 * 测试 capitalize 函数
 */

import { describe, it, expect } from 'vitest';
import { capitalize } from '../../../src/generators/common/string-util';

describe('capitalize', () => {
  it('should capitalize first letter of lowercase string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should keep first letter capitalized if already uppercase', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle string with numbers', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });

  it('should handle string with special characters', () => {
    expect(capitalize('!hello')).toBe('!hello');
  });
});


