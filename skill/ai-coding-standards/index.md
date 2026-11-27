# AI Coding Standards

> 版本: v1.0
> 最后更新: 2026-09-21
> 变更记录: 初始版本

目标只有三个:

1. 让不同成员使用 AI 生成的代码风格尽量一致。
2. 让 AI 优先复用现有组件、页面结构和工具方法，而不是重新发明一套。
3. 让新代码更容易维护、更容易继续迭代。

## 使用方式

当你把设计稿、原型图、需求说明或接口文档交给 AI 时，请同时明确要求:

`请先阅读 ai-coding-standards 目录下的规范，再基于当前项目已有模式实现。`

建议至少让 AI 阅读以下文件:

- `index.md`
- `01-project-scan.md`
- `02-naming.md`
- `03-ui-standards.md`
- `04-development-principles.md`
- `05-code-style.md`
- `06-ai-prompt-template.md`
- `07-page-scaffold-examples.md`
- `08-module-reuse-map.md`

## 适用范围

本规范适用于以下内容:

- 新页面开发
- 现有页面改造
- 查询页 / 列表页 / 详情页 / 编辑页
- API 封装
- 业务组件封装
- AI 辅助生成的 Vue / TypeScript / Less / Markdown 代码

## 强制要求

AI 生成代码时必须遵守:

1. 优先复用 `src/components`、`src/ui`、`src/utils`、`src/composables` 中已有能力。
2. 优先沿用项目既有页面结构，尤其是查询页的拆分方式。
3. 不要擅自引入新的 UI 框架、状态管理方案、请求库或表格方案。
4. 不要仅根据通用 Vue 最佳实践输出“模板化代码”，必须贴合本项目现有写法。
5. 新代码要能被现有 ESLint / Prettier / TypeScript 约束接受。
6. 提示通知统一使用 `notification`，成功提示默认写 `message: '提示'`。
7. `HandTableNew` 的操作列必须先维护动作数组，再循环渲染。
8. `QueryTableLayout` 默认不维护 `formHeader`，除非同类页面已有明确要求。
9. `src/api` 只维护标准接口定义和调用封装，不在接口文件中写本地 mock 数据。
10. 没有真实接口时，假数据仅可放在页面私有目录中维护。
11. 完成代码后默认只做 lint / build 校验，不主动启动本地 dev server，除非需求明确要求。

## 文档说明

- [01-project-scan.md](./01-project-scan.md)
  项目扫描、业务地图、技术栈、目录结构、典型页面模式。
- [02-naming.md](./02-naming.md)
  文件、变量、函数、组件、目录、接口命名规则。
- [03-ui-standards.md](./03-ui-standards.md)
  UI 组件复用规则、常用路径、页面布局模式、按钮与表格约束。
- [04-development-principles.md](./04-development-principles.md)
  组件拆分、注释、复用、改造边界、实现原则。
- [05-code-style.md](./05-code-style.md)
  ESLint / Prettier / TypeScript / API 封装 / Vue SFC 编码规范。
- [06-ai-prompt-template.md](./06-ai-prompt-template.md)
  给 AI 的标准提示词模板。
- [07-page-scaffold-examples.md](./07-page-scaffold-examples.md)
  标准查询页、编辑页、详情页、弹窗页脚手架示例。
- [08-module-reuse-map.md](./08-module-reuse-map.md)
  按场景整理的模块复用地图，帮助 AI 优先复用现有资产。

## 维护原则

当项目结构、基础组件或编码规范发生明显变化时，必须同步更新本目录。

优先更新以下内容:

- 新增或废弃的公共组件
- 新的页面标准结构
- 新的命名约定
- ESLint / Prettier / TypeScript 规则变化
- 新的业务模块地图

## 开发流程(必须遵守，没有例外！！！)

1. 根据文档说明，制定详细的开发计划并生成md文档，提示用户确认。
2. 若用户对开发计划有异议或有多种实现方式，必须与用户沟通确定唯一实现方案，确认无误后再次更新开发计划md文档后，再次提示用户确认。
3. 确认后，严格根据开发计划，开始实现代码。不须私自变更开发计划。
4. 开发使用模板必须使用**exampleFile**目录下的文件。若没有可用的模板文件，优先开发模板文件，之后再根据模板文件实现代码。
