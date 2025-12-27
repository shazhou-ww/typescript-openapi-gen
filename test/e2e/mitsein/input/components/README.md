# OpenAPI Components

本目录包含 OpenAPI 的组件定义，按类型分类。

## 📁 目录结构

```
components/
├── schemas/          # Schema 定义（每个类型一个文件）
├── parameters/       # 参数定义（每个参数一个文件）
└── responses/        # 响应定义（每个响应一个文件）
```

## 📋 Schema 文件

### 公共类型

- `ThreadIdRequest.yaml` - Thread ID 请求
- `ProjectIdRequest.yaml` - Project ID 请求
- `AgentRunIdRequest.yaml` - Agent Run ID 请求
- `PaginationRequest.yaml` - 分页请求
- `StandardResponse.yaml` - 标准响应
- `ErrorResponse.yaml` - 错误响应
- `PaginationResponse.yaml` - 分页响应

### RequestBody 类型

- `MessageAddRequestBody.yaml` - 添加消息请求体
- `AgentStartRequestBody.yaml` - 启动 Agent 请求体
- 其他 RequestBody 类型...

### Request 类型

- `AddChartMessageRequest.yaml`
- `AddThemeMessageRequest.yaml`
- `ListMessagesRequest.yaml`
- `ThreadCreateRequest.yaml`
- `CreateProjectRequest.yaml`
- 等等...

### Response 类型

- `QuickStartResponse.yaml`
- `VersionInfo.yaml`
- `LLMConfigResponse.yaml`
- 等等...

## 📋 Parameters

- `ThreadIdPath.yaml` - 路径参数 thread_id
- `ProjectIdPath.yaml` - 路径参数 project_id
- `AgentRunIdPath.yaml` - 路径参数 agent_run_id

## 📋 Responses

- `ValidationError.yaml` - 422 验证错误
- `NotFound.yaml` - 404 未找到
- `InternalServerError.yaml` - 500 服务器错误

## 🔗 引用方式

在路由文件中使用 `$ref` 引用：

```yaml
$ref: '#/components/schemas/MessageAddRequestBody'
```

在合并后的主文件中，这些引用会被正确解析。

## 📝 维护说明

- 每个文件只包含一个类型定义
- 使用清晰的命名（PascalCase）
- 添加必要的描述和约束
- 保持文件结构一致

