# Analyzers (单模块文件夹)

## 职责

分析 OpenApiDocument，返回诊断结果。

## 聚合入口

```typescript
runAnalysis(doc: OpenApiDocument, task: AnalysisTask): Promise<AnalysisResult>
```

- **doc**: OpenApiDocument
- **task**: 分析任务，包含要运行的 analyzer 名称列表
- **返回**: AnalysisResult，包含 success 和 diagnostics

## 可用的 Analyzers

- `structure` - 检查文档结构（路径、操作是否存在）
- `refs` - 检查引用是否有效

## 内部实现

- `runner.ts` - 主运行函数
- `structure-analyzer.ts` - 结构分析器
- `refs-analyzer.ts` - 引用分析器
