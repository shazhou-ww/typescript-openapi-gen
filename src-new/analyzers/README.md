# Analyzers (多模块文件夹)

## 共同点

所有模块都负责对 OpenAPI 文档进行分析和验证，提供诊断信息和分析结果。

## 包含模块

- **registry/**: 分析器注册表管理
- **validator/**: OpenAPI 文档验证器
- **defaults.ts**: 默认分析器配置
