# Loader (单模块文件夹)

## 职责

createLoader(): LoaderAPI

- 返回: 包含加载和转换功能的完整 Loader API

## 主要功能

- load(filePath: string): Promise&lt;OpenApiDocument&gt; - 加载并解析 OpenAPI 文档

- toIR(document: OpenApiDocument): IR - 将文档转换为中间表示
