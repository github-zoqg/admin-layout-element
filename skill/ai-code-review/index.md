# AI Code Review 规范

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 目的: 统一代码审查标准，提升代码质量，降低线上故障率

---

## 1. 审查目标与原则

### 1.1 核心目标

| 目标 | 说明 | 度量指标 |
|------|------|----------|
| **功能正确性** | 代码实现符合需求，业务逻辑无漏洞 | Bug 逃逸率 < 1% |
| **架构一致性** | 遵循项目分层、组件复用、状态管理规范 | 架构违规 PR 为 0 |
| **代码可维护性** | 命名规范、注释完整、单一职责、低耦合 | 圈复杂度 < 15，文件 < 300 行 |
| **性能达标** | 无明显性能瓶颈，符合性能基线 | 首屏 < 1.2s，包体积 < 300KB gzip |
| **安全合规** | 无 XSS/注入/敏感信息泄露/权限越界 | 安全扫描 0 高危 |
| **工程规范** | 通过 ESLint/Prettier/TypeScript/CI 检查 | 自动化检查 100% 通过 |

### 1.2 审查原则

| 原则 | 执行标准 |
|------|----------|
| **小步快跑** | 单次 PR 变更 ≤ 300 行，拆分大特性 |
| **自动化优先** | 格式/类型/构建/测试全自动化，人工聚焦业务逻辑 |
| **两人以上通过** | 至少 1 位业务熟悉者 + 1 位架构/资深 Approve |
| **零容忍红线** | 红线规则（见下）触发直接驳回，不计入通过 |
| **及时反馈** | PR 提交 2 小时内首次 Review，24 小时内完成 |
| **知识传递** | Review 评论需包含"为什么"，促进团队成长 |

---

## 2. 红线规则 (Zero Tolerance)

触发即驳回，不接受"后续修复"承诺：

| 红线编号 | 规则 | 检测方式 | 示例 |
|----------|------|----------|------|
| **RL-01** | 绕过 ESLint/Prettier/TS 检查 | CI 强制门禁 | `eslint-disable` 无正当理由 |
| **RL-02** | 引入未评审的新依赖/新技术栈 | 依赖变更 Review | 新增 UI 库、状态管理、请求库 |
| **RL-03** | 硬编码敏感信息 (Token/密钥/内网IP) | 静态扫描 + 人工 | `const API_KEY = 'sk-xxx'` |
| **RL-04** | 直接操作 DOM / 使用 `v-html` 渲染用户输入 | 代码审查 | `el.innerHTML = userInput` |
| **RL-05** | 破坏现有 API 契约 (Props/Emits/Store/接口) | 类型检查 + 兼容测试 | 删除必填 Prop、修改 Event payload |
| **RL-06** | 无错误处理的异步调用 | 代码审查 | `await api()` 无 try-catch |
| **RL-07** | 绕过权限控制 (按钮/路由/接口) | 代码审查 | 删除 `v-permission`、硬编码角色判断 |
| **RL-08** | 提交未通过构建/测试的代码 | CI 门禁 | `npm run build` 失败仍合并 |

---

## 3. 审查维度与检查清单

### 3.1 架构与设计 (P0)

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **分层正确** | View → Component → Composable → Utils/Config/API/Store | 目录结构、import 路径 |
| **组件复用** | 优先用 L1 组件库，≥3 处复用才提取 L1 | 对照 08-module-reuse-map.md |
| **状态分层** | 全局/页面/URL/缓存 分层清晰，无滥用 Store | Pinia 模块划分、ref/reactive 用法 |
| **通信规范** | Props/Emits/Slots/Store/EventBus 场景正确 | 04-development-principles.md §1.3 |
| **路由菜单** | meta 完整、懒加载、权限字段、keepAlive 合理 | router/index.js 对照 |

### 3.2 功能与业务逻辑 (P0)

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **需求覆盖** | 验收标准全覆盖，边界条件处理 (空/异常/极值) | 对照需求文档、测试用例 |
| **CRUD 完整** | 增删改查、导入导出、批量操作、状态流转闭环 | 手工冒烟 + 自动化测试 |
| **表单校验** | 必填/格式/长度/业务规则/异步校验全覆盖 | rules 定义、提交前 validate |
| **异常处理** | 网络/业务/权限/超时错误均有用户感知反馈 | ElMessage/Notification/MessageBox |
| **Loading 态** | 列表/表单/按钮/页面级 Loading 无遗漏 | 交互全链路验证 |
| **权限控制** | 按钮级 `v-permission`、路由守卫、接口字段权限 | 权限矩阵对照 |

### 3.3 代码质量 (P1)

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **单一职责** | 组件/函数/模块职责单一，无"神类" | 圈复杂度、文件行数、函数行数 |
| **命名规范** | 符合 02-naming.md 全维度规范 | 文件/变量/函数/组件/路由/Store/API/CSS/TS/Git |
| **类型安全** | 0 `any` (公共 API)，泛型正确，Props/Emits 类型完整 | `tsc --noEmit` 0 errors |
| **注释完整** | 文件头/组件/函数/类型/关键逻辑 JSDoc | 04-development-principles.md §3 |
| **无死代码** | 无未使用 import/变量/函数/组件 | ESLint `no-unused-vars` |
| **错误边界** | 关键组件有 ErrorBoundary/错误兜底 | 组件树顶层捕获 |

### 3.4 Vue 规范 (P1)

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **Script Setup** | 使用 `<script setup lang="ts">`，组织顺序规范 | 05-code-style.md §5.1 |
| **Props/Emits** | `defineProps`/`defineEmits` + TS 类型 + withDefaults | 类型检查通过 |
| **响应式** | 正确用 `ref`/`reactive`/`computed`/`watch`，无响应式丢失 | 无 `xxx.value.value` 等低级错误 |
| **生命周期** | `onMounted`/`onUnmounted` 配对清理 (定时器/监听/订阅) | 无内存泄漏 |
| **模板** | 指令缩写、属性顺序、v-for 必有 key、无复杂表达式 | 05-code-style.md §5.2 |
| **插槽/暴露** | Slots 语义化、defineExpose 类型完整 | 组件复用场景验证 |

### 3.5 UI 与体验 (P1)

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **标准组件** | Table/Dialog/Pagination/ListLayout/Navs 复用率 100% | 无直接用 el-table/el-dialog |
| **Element Plus 约束** | 按钮/表格/表单/弹窗符合 03-ui-standards.md 规范 | 对照规范表核对 |
| **反馈完整** | 成功/错误/警告/信息/确认/Loading 全覆盖 | 交互全链路验证 |
| **响应式** | 断点适配、无横向溢出、表格横向滚动 | Chrome DevTools 设备模拟 |
| **无障碍基础** | 语义标签、键盘可达、焦点可见、表单关联、颜色对比度 | axe-core 扫描 + 人工 |

### 3.6 性能 (P1)

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **懒加载** | 非首页路由懒加载、大组件 `defineAsyncComponent` | 网络面板 Chunk 分析 |
| **缓存策略** | 列表页/高频页 `keep-alive`、静态资源缓存头 | 网络面板、Application 面板 |
| **大列表** | >100 行启用虚拟滚动/分片渲染 | Performance 面板帧率 |
| **防抖节流** | 搜索/Resize/Scroll 高频事件防抖节流 | 代码审查 `useDebounce`/`useThrottle` |
| **包体积** | 无重复依赖、按需引入、动态导入非首屏 | `rollup-plugin-visualizer` 分析 |

### 3.7 安全 (P0)

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **XSS 防护** | 用户输入内容渲染用 `{{}}`/`v-text`，禁 `v-html` (或 sanitize) | 代码审查、CSP 策略 |
| **敏感信息** | 无 Token/密钥/密码/身份证/手机号硬编码/日志输出 | 静态扫描、日志审计 |
| **权限校验** | 前端权限仅为体验，后端必须二次校验 | 接口文档、安全设计评审 |
| **依赖安全** | `npm audit` 0 high/critical、依赖版本锁定 | CI 集成 `npm audit` |
| **CSP 兼容** | 无 `eval`/`new Function`/内联脚本/内联样式 | CSP 报告模式监控 |

---

## 4. 审查流程标准化

### 4.1 PR 模板 (`.github/pull_request_template.md`)

```markdown
## 变更类型
- [ ] feat: 新功能
- [ ] fix: Bug 修复
- [ ] refactor: 重构
- [ ] style: 格式调整
- [ ] docs: 文档更新
- [ ] chore: 构建/依赖/工具
- [ ] perf: 性能优化
- [ ] test: 测试相关

## 变更描述
<!-- 简述做了什么、为什么做、怎么做的 -->

## 关联 Issue
Closes #XXX

## 变更范围
- [ ] 新增页面/组件: 列出文件
- [ ] 修改现有页面/组件: 列出文件
- [ ] 新增/修改 API: 列出接口
- [ ] 新增/修改类型: 列出类型文件
- [ ] 新增/修改 Store/Composable/Utils: 列出文件
- [ ] 修改路由/菜单/权限: 说明变更
- [ ] 修改配置/环境变量: 说明变更

## 自查清单 (提交前必须全勾选)
- [ ] `npm run lint` 通过 (0 errors)
- [ ] `npm run format --check` 通过
- [ ] `npx tsc --noEmit` 通过 (0 errors)
- [ ] `npm run build` 成功
- [ ] 单元测试通过 / 新增测试覆盖核心逻辑
- [ ] 文件头注释、组件/函数 JSDoc 完整
- [ ] 命名符合 02-naming.md
- [ ] 复用标准组件，无重复造轮子
- [ ] 无硬编码敏感信息、API 路径、魔法数字
- [ ] Loading/空/错/确认状态全覆盖
- [ ] 响应式断点适配
- [ ] 权限控制 (v-permission/路由守卫)
- [ ] 更新相关文档 (类型/API/组件/复用地图)

## 截图/录屏 (UI 变更必提供)
<!-- 列表页/表单/弹窗/交互流程 -->

## 部署验证步骤
1. 
2. 
3. 

## Reviewer 关注点
<!-- 指定希望重点 Review 的模块/逻辑 -->
```

### 4.2 Review 角色分工

| 角色 | 职责 | 关注维度 | 最低人数 |
|------|------|----------|----------|
| **业务 Reviewer** | 熟悉需求的开发者 | 功能完整性、业务逻辑、交互体验、验收标准 | 1 |
| **架构/资深 Reviewer** | 架构组/Tech Lead | 架构一致性、代码质量、性能、安全、规范遵循 | 1 |
| **安全 Reviewer** (高危变更) | 安全组/资深 | XSS/注入/敏感信息/权限/依赖安全 | 视情况 |

### 4.3 Review 时效 SLA

| 阶段 | 时限 | 超时处理 |
|------|------|----------|
| **首次 Review** | PR 提交 2 小时内 | @Reviewer 提醒，超 4 小时自动升级通知 TL |
| **修改响应** | 收到意见 4 小时内 | 作者及时回复/修改，避免 PR 僵死 |
| **最终通过** | PR 提交 24 小时内 | 超时自动标记"需关注"，每日站会同步 |

---

## 5. 常见问题速查表 (Review 高频注释)

| 高频问题 | 标准回复模板 | 修正示例 |
|----------|--------------|----------|
| **直接用 el-table** | "请使用 `src/components/table/index.vue` 封装组件，内置分页/固定高度/表头样式" | `<Table :data="list" :total="total" @page-change="onPage">` |
| **硬编码 API 路径** | "API 路径必须定义在 `src/api/{domain}/index.js` 常量对象中，页面只调用封装函数" | `import { getList } from '@/api/interface-manage'` |
| **命名不规范** | "请遵循 02-naming.md：文件 kebab-case、组件 PascalCase、变量 camelCase、常量 UPPER_SNAKE_CASE" | `interface-manage/index.vue`、`UserList`、`userList`、`API_LIST` |
| **缺少类型定义** | "请补充 TypeScript 类型：Props/Emits/Ref/Computed/返回值，禁用 `any`" | `const tableData = ref<InterfaceListItem[]>([])` |
| **无错误处理** | "异步调用必须 try-catch，用户需有感知反馈 (ElMessage/Notification)" | `try { await api() } catch { ElMessage.error('失败') }` |
| **缺少 Loading** | "列表加载/表单提交/按钮操作/页面跳转必须有 Loading 状态" | `loading.value = true; try {...} finally { loading.value = false }` |
| **权限缺失** | "操作按钮需加 `v-permission="'domain:action'"`，路由需配置 meta.roles" | `<el-button v-permission="'interface:delete'" @click="del">` |
| **组件通信混乱** | "父子用 Props/Emits，跨层级用 Store/EventBus，插槽用 Slots，请按 04-development-principles.md §1.3" | `emit('page-change', val)` 而非 `emitter.emit('page-change', val)` |
| **响应式丢失** | "解构 reactive 必须用 `toRefs`/`storeToRefs`，或保持 reactive 对象整体传递" | `const { list, total } = storeToRefs(useTableStore())` |
| **注释缺失** | "请补充文件头、组件/函数 JSDoc、关键业务逻辑行内注释，参考 04-development-principles.md §3" | `/** 获取列表 */ const fetchList = async () => {...}` |

---

## 6. 审查工具链集成

### 6.1 CI Pipeline (GitHub Actions 示例)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Lint (ESLint)
        run: pnpm run lint
        
      - name: Format Check (Prettier)
        run: pnpm run format --check
        
      - name: Type Check (TypeScript)
        run: npx tsc --noEmit
        
      - name: Build
        run: pnpm run build
        
      - name: Unit Test (Vitest)
        run: pnpm run test -- --coverage
        
      - name: Security Audit
        run: pnpm audit --prod --level=high
        
      - name: Bundle Analysis
        run: pnpm run build -- --mode=analyze
        if: github.event_name == 'pull_request'
```

### 6.2 代码质量门禁 (SonarQube / CodeClimate)

| 指标 | 阈值 | 门禁 |
|------|------|------|
| **代码覆盖率** | ≥ 80% (核心逻辑 100%) | 质量门禁 |
| **重复代码率** | < 3% | 质量门禁 |
| **圈复杂度** | 单函数 < 15、类 < 50 | 质量门禁 |
| **认知复杂度** | 单函数 < 20 | 质量门禁 |
| **代码异味** | 0 Blocker、0 Critical | 质量门禁 |
| **安全漏洞** | 0 高危 | 质量门禁 |

---

## 7. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：审查目标、红线规则、7维度检查清单、流程标准化、高频问题、CI集成 |

---

> **执行建议**：将本文档第 4.1 节 PR 模板配置到仓库 `.github/pull_request_template.md`，将第 5 节高频问题制作为 Review 评论片段 (GitHub Saved Replies)。新人入职第一周必须通过模拟 PR 审查考核。