# Command (单模块文件夹)

## 职责

创建 CLI 程序，注册所有命令。

## 聚合入口

```typescript
createProgram(deps: ProgramDeps): Command
```

- **deps**: 依赖对象
  - `load`: 加载 OpenAPI 文档
  - `runAnalysis`: 运行分析
  - `runGeneration`: 运行生成
- **返回**: Commander Program 实例

## 内部实现

- `impl/program.ts` - 创建程序
- `impl/ir-command.ts` - IR 命令
- `impl/gen-command.ts` - 生成命令
- `impl/deps.ts` - 依赖类型定义
