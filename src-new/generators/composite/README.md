# Generators Composite (单模块文件夹)

## 职责

createCompositeGenerator(generators: Generator[]): Generator
- generators: 要组合的生成器数组
- 返回: 组合生成器，按顺序执行所有子生成器
