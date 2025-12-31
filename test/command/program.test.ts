/**
 * program.test.ts
 * 测试 createProgram 函数
 */

import { describe, it, expect } from 'vitest';
import { createProgram } from '../../src/command/program';
import type { ProgramDeps } from '../../src/command/deps';
import type { OpenApiDocument, AnalysisTask, GenerationTask, AnalysisResult, GenerationResult } from '../../src/types';
import { Volume } from 'memfs';

describe('createProgram', () => {
  const mockDeps: ProgramDeps = {
    load: async (path: string): Promise<OpenApiDocument> => {
      return {
        paths: {},
        types: {},
      };
    },
    runAnalysis: async (doc: OpenApiDocument, task: AnalysisTask): Promise<AnalysisResult> => {
      return {
        success: true,
        diagnostics: [],
      };
    },
    runGeneration: async (doc: OpenApiDocument, task: GenerationTask): Promise<GenerationResult> => {
      return {
        success: true,
        diagnostics: [],
        files: [],
        volume: new Volume(),
      };
    },
  };

  it('should create program with correct name', () => {
    const program = createProgram(mockDeps);

    expect(program.name()).toBe('tsoapi');
  });

  it('should create program with description', () => {
    const program = createProgram(mockDeps);

    expect(program.description()).toBe('Generate TypeScript controllers and routes from OpenAPI specifications');
  });

  it('should create program with version', () => {
    const program = createProgram(mockDeps);

    expect(program.version()).toBe('0.2.3');
  });

  it('should register commands', () => {
    const program = createProgram(mockDeps);

    const commands = program.commands.map(cmd => cmd.name());
    
    expect(commands.length).toBeGreaterThan(0);
  });
});


