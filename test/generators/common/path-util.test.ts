/**
 * path-util.test.ts
 * 测试 PathUtil 对象的所有方法
 */

import { describe, it, expect } from 'vitest';
import { PathUtil } from '../../../src/generators/common/path-util';

describe('PathUtil', () => {
  describe('segmentToFsName', () => {
    it('should convert path parameter segment to filesystem name', () => {
      expect(PathUtil.segmentToFsName('{id}')).toBe('_id');
      expect(PathUtil.segmentToFsName('{userId}')).toBe('_userId');
    });

    it('should keep normal segment unchanged', () => {
      expect(PathUtil.segmentToFsName('users')).toBe('users');
      expect(PathUtil.segmentToFsName('posts')).toBe('posts');
    });

    it('should handle empty segment', () => {
      expect(PathUtil.segmentToFsName('')).toBe('');
    });
  });

  describe('routePathToFsPath', () => {
    it('should convert route path to filesystem path', () => {
      expect(PathUtil.routePathToFsPath('/users')).toBe('users');
      expect(PathUtil.routePathToFsPath('/users/{id}')).toBe('users/_id');
      expect(PathUtil.routePathToFsPath('/api/users/{userId}/posts')).toBe('api/users/_userId/posts');
    });

    it('should handle path with multiple segments', () => {
      expect(PathUtil.routePathToFsPath('/a/b/c')).toBe('a/b/c');
    });

    it('should handle root path', () => {
      expect(PathUtil.routePathToFsPath('/')).toBe('');
    });

    it('should handle path with trailing slash', () => {
      expect(PathUtil.routePathToFsPath('/users/')).toBe('users');
    });
  });

  describe('extractPathParams', () => {
    it('should extract path parameters from route path', () => {
      expect(PathUtil.extractPathParams('/users/{id}')).toEqual(['id']);
      expect(PathUtil.extractPathParams('/users/{userId}/posts/{postId}')).toEqual(['userId', 'postId']);
    });

    it('should return empty array for path without parameters', () => {
      expect(PathUtil.extractPathParams('/users')).toEqual([]);
      expect(PathUtil.extractPathParams('/api/users/posts')).toEqual([]);
    });

    it('should handle multiple parameters in same segment', () => {
      expect(PathUtil.extractPathParams('/users/{id}/posts/{id}')).toEqual(['id', 'id']);
    });

    it('should handle empty path', () => {
      expect(PathUtil.extractPathParams('')).toEqual([]);
    });
  });

  describe('segmentToExportName', () => {
    it('should convert segment to valid JavaScript identifier', () => {
      expect(PathUtil.segmentToExportName('users')).toBe('users');
      expect(PathUtil.segmentToExportName('_id')).toBe('_id');
    });

    it('should replace non-alphanumeric characters with underscore', () => {
      expect(PathUtil.segmentToExportName('user-id')).toBe('user_id');
      expect(PathUtil.segmentToExportName('user.id')).toBe('user_id');
      expect(PathUtil.segmentToExportName('user@name')).toBe('user_name');
    });

    it('should preserve alphanumeric characters and underscore', () => {
      expect(PathUtil.segmentToExportName('user123')).toBe('user123');
      expect(PathUtil.segmentToExportName('_user_$name')).toBe('_user_$name');
    });

    it('should handle empty string', () => {
      expect(PathUtil.segmentToExportName('')).toBe('');
    });
  });
});


