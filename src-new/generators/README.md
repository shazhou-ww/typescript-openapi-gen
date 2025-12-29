# Generators (多模块文件夹)

## 共同点

所有模块都负责从 OpenAPI 文档生成各种类型的代码文件和配置。

## 包含模块

- **registry/**: 生成器注册表管理
- **composite/**: 组合生成器
- **controller/**: 控制器代码生成
- **openapi/**: OpenAPI 规范生成
- **ir/**: 中间表示生成
- **formatter/**: 代码格式化
- **defaults/**: 默认生成器配置
