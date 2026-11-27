# 02 代码规范审查规范 (开发规范)

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 适用: Code Review 时的开发规范核对标准 (架构、组件、状态、API、性能、安全)

---

## 1. 架构分层与模块边界

### 1.1 分层架构核对

| 层级 | 目录 | 职责 | 允许依赖 | 禁止依赖 |
|------|------|------|----------|----------|
| **View** | `views/{domain}/` | 页面入口、路由对应、业务编排 | Component, Composable, Store, API, Utils, Config | 直接操作 DOM、硬编码 API |
| **Component (L1)** | `src/components/` | 通用 UI 组件、无业务逻辑 | Utils, Config, Composables (纯工具类) | Store、API、业务类型、其他业务组件 |
| **Component (L5)** | `views/{domain}/components/` | 业务共享组件 | 同域 Component、Composables、Utils、Config、同域 API | 跨域引用、全局 Store |
| **Composable (L2)** | `composables/` | 通用逻辑封装 (无副作用初始化) | Utils、Config、Vue 核心 API | Store、API、组件、DOM 操作 |
| **Composable (L6)** | `views/{domain}/hooks/` | 业务逻辑封装 | 同域 API、Utils、Config、L2 Composables | 跨域引用、UI 组件 |
| **Utils (L3)** | `utils/` | 纯工具函数 (无副作用) | 无 (仅语言标准库) | 任何项目内模块 |
| **Config (L4)** | `config/` | 运行时常量 | 无 | 任何项目内模块 |
| **API** | `api/{domain}/` | 接口封装、类型定义 | request.js、类型定义 | 组件、Store、Composable |
| **Store** | `store/modules/` | 全局/跨页面状态 | API、Utils、Config | 组件、Composable、View |

### 1.2 模块边界 Review 核对

- [ ] **View 层** 无直接 `axios`/`fetch` 调用，统一通过 `api/{domain}` 导出函数
- [ ] **L1 组件** 无 `import { useXxxStore }`、`import { getXxx } from '@/api/...'`、`import '@/views/...'`
- [ ] **L2 Composable** 无 `import { useXxxStore }` (除非纯读取且通过参数注入)、无 `import api`、无 DOM 操作
- [ ] **跨域引用** 仅通过 L1-L3 基础设施，业务域间零直接依赖
- [ ] **Store** 仅定义 State/Getter/Action，无 UI 逻辑、无组件引用、无路由跳转
- [ ] **API 模块** 仅导出标准 CRUD + 业务特有函数，无 Mock 数据、无组件逻辑

---

## 2. 组件设计与复用规范 (对标 04-development-principles.md)

### 2.1 组件拆分粒度核对

| 场景 | 标准做法 | ❌ 反模式 |
|------|----------|----------|
| 列表页 | ListLayout + ListForm + Table (复用 L1) | 手写 flex 布局、内联 el-table |
| 表单弹窗 | Dialog 组件 + el-form (内联或抽离 Form 组件) | 直接用 el-dialog、表单逻辑耦合在页面 |
| 复杂表单 | 抽离 Form 组件 + useForm Composable | 页面内联 200+ 行表单逻辑 |
| 表格列复用 | 列配置对象数组 + 循环渲染 | 硬编码重复 el-table-column |
| 操作列 | 动作数组 + 循环渲染 (HandTableNew 模式) | 硬编码按钮、v-if 控制显隐 |
| 多步骤向导 | Step 组件数组 + 通用步骤容器 | 每步单独写死组件 |

### 2.2 组件通信模式核对 (对标 04-development-principles.md §1.3)

| 场景 | ✅ 推荐 | ❌ 禁止 |
|------|---------|--------|
| 父 → 子数据 | Props (单向) | `this.$parent`、provide/inject 传数据 |
| 子 → 父事件 | Emits (defineEmits) | `this.$emit` (非 setup)、mitt 事件总线 |
| 兄弟组件 | 共同父组件中转 Props/Emits | mitt 事件总线 (除非极少量全局事件) |
| 跨层级配置 | provide/inject (仅读取配置/主题/权限上下文) | 传递业务数据、方法 |
| 全局状态 | Pinia Store (用户/权限/主题/字典) | 页面级状态放 Store |
| URL 状态 | Router Query/Params (可分享/刷新保持的筛选) | 所有状态塞 Store |
| 插槽分发 | Slots (具名/作用域) | Props 传渲染函数/JSX (除非动态编译) |

### 2.3 组件 Props/Emits/Slots 设计核对

| 检查项 | 标准 |
|--------|------|
| Props 仅为数据输入，无方法/回调函数 (回调用 Emits) | ✅ |
| Props 有完整 TS 类型、JSDoc、默认值、必填标记 | ✅ |
| Emits 使用函数签名语法，载荷类型明确 | ✅ |
| Slots 语义化命名 (`header`/`footer`/`action`/`empty`/`loading`) | ✅ |
| 作用域插槽参数单数名词 (`scope.row`/`scope.$index`) | ✅ |
| 组件 `defineOptions({name: 'PascalCase'})` 与文件名一致 | ✅ |
| 向后兼容：废弃 Props/Emits 标记 `@deprecated` 保留 ≥2 版本 | ✅ |

---

## 3. 状态管理规范 (Pinia)

### 3.1 Store 设计核对

| 检查项 | 标准 | ✅ 正例 | ❌ 反例 |
|--------|------|--------|--------|
| Store 划分 | 按业务域单文件 | `userStore.ts`, `interfaceStore.ts` | `globalStore.ts` (大杂烩) |
| State 定义 | `ref`/`reactive` 基础类型 | `const token = ref('')` | `const state = reactive({token:'', user:{}})` 过度嵌套 |
| Getters | `computed` 只读派生 | `const isLogin = computed(() => !!token.value)` | 在 State 里放计算属性 |
| Actions | 异步用 `async`、同步普通函数 | `const login = async (cred) => {...}` | `const login = (cred) => {...}.then()` |
| Action 命名 | 动词前缀：`fetch`/`create`/`update`/`delete`/`toggle`/`set`/`clear` | `fetchUserList()` | `getUserList()`, `doLogin()` |
| 类型导出 | 导出 `useXxxStore` 函数 + 类型推导 | `export const useUserStore = defineStore(...)` | 导出 state 对象 |
| 组件中使用 | `storeToRefs` 解构保持响应性 | `const {token, user} = storeToRefs(useUserStore())` | `const store = useUserStore(); store.token` (丢失响应性) |
| 持久化 | 仅必要字段 `localStorage`/`sessionStorage` + `pinia-plugin-persistedstate` | `persist: { key: 'user', paths: ['token'] }` | 全量 State 持久化 |

### 3.2 状态分层使用核对

| 状态类型 | 存放位置 | 典型场景 |
|----------|----------|----------|
| 用户身份/权限/Token | `useUserStore` (全局) | 登录态、角色、按钮权限 |
| 应用配置/主题/多语言 | `useAppStore` (全局) | 侧边栏折叠、语言、主题色 |
| 业务字典/枚举缓存 | `useDictStore` (全局, 待建设) | 状态选项、部门树、角色列表 |
| 列表查询条件/分页/数据 | 页面组件 `ref`/`reactive` | `queryForm`、`tableData`、`pageData` |
| 表单数据/校验/弹窗可见 | 页面组件 `ref`/`reactive` | `editForm`、`dialogVisible`、`formRules` |
| 跨页面临时数据 | Router Query / `sessionStorage` | 详情页回传参数、向导草稿 |
| 接口响应缓存 | `useDictStore` 或 Composable 内部 `Map` | 字典选项、下拉数据 |

---

## 4. API 封装与调用规范 (对标 05-code-style.md §4)

### 4.1 API 模块结构核对

```javascript
// src/api/{domain}/index.js 标准结构
import request from '../request'
import type { XxxListItem, XxxQueryParams, PageResult } from '@/types/xxx'

// 1. 路径常量对象 (UPPER_SNAKE_CASE)
const API = {
  LIST: '/v1/xxx/list',
  DETAIL: '/v1/xxx/detail',
  CREATE: '/v1/xxx',
  UPDATE: '/v1/xxx',
  DELETE: '/v1/xxx',
  BATCH_DELETE: '/v1/xxx/batch',
  TOGGLE_STATUS: '/v1/xxx/status',
  EXPORT: '/v1/xxx/export'
}

// 2. 标准 CRUD + 业务特有函数 (全部导出)
export const getXxxList = (params: XxxQueryParams) => request.get<PageResult<XxxListItem>>(API.LIST, { params })
export const getXxxDetail = (id: string) => request.get<XxxListItem>(`${API.DETAIL}/${id}`)
export const createXxx = (data: Partial<XxxListItem>) => request.post(API.CREATE, data)
export const updateXxx = (id: string, data: Partial<XxxListItem>) => request.put(`${API.UPDATE}/${id}`, data)
export const deleteXxx = (id: string) => request.delete(`${API.DELETE}/${id}`)
export const batchDeleteXxx = (ids: string[]) => request.post(API.BATCH_DELETE, { ids })
export const toggleXxxStatus = (id: string, status: '0'|'1') => request.put(`${API.TOGGLE_STATUS}/${id}`, { status })
export const exportXxx = (params: XxxQueryParams) => request.get<Blob>(API.EXPORT, { params, responseType: 'blob' })

// 3. 无 Mock 数据、无业务逻辑、无组件引用
```

### 4.2 页面层 API 调用核对

| 检查项 | 标准 | ✅ 正例 | ❌ 反例 |
|--------|------|--------|--------|
| 统一封装 | 导入 `api/{domain}` 函数 | `import { getList } from '@/api/interface-manage'` | `request.get('/api/xxx')` |
| 错误处理 | 统一 `handleApiCall` 封装 | `const res = await handleApiCall(() => api(), '成功')` | 裸 `try-catch` 分散、无用户反馈 |
| Loading 状态 | 页面级/按钮级/表格级全覆盖 | `loading.value = true; try{} finally{loading.value=false}` | 无 Loading、用户重复点击 |
| 参数序列化 | GET params 自动序列化、数组格式正确 | `params: {ids: [1,2]}` → `ids=1&ids=2` | 手动拼接 URL |
| 类型安全 | 参数/返回 TS 类型完整 | `getList(params: QueryParams): Promise<PageResult<Item>>` | `any`、无返回类型 |
| 取消请求 | 组件卸载取消进行中请求 | `AbortController` / axios cancel token | 请求未完成切换页面导致状态错乱 |

---

## 5. 性能优化规范 Review 核对

### 5.1 加载性能

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **路由懒加载** | 非首页全部 `() => import('@/views/...')` | 网络面板 Chunk 分离 |
| **组件异步加载** | 大型图表/编辑器/非首屏弹窗 `defineAsyncComponent` | 首屏 JS 体积 < 300KB gzip |
| **Keep-Alive 缓存** | 列表页/高频切换页 `<keep-alive>` | 切换无白屏、状态保持 |
| **预加载关键路由** | `router.prefetch()` 或 `<link rel="prefetch">` | 后续导航无等待 |
| **CDN 引入** | Element Plus 等大体积库 `vite-plugin-cdn-import` | 网络面板外链加载 |

### 5.2 运行时性能

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **虚拟滚动** | 表格单页 > 100 行启用 | Performance 面板 60fps 滚动 |
| **防抖/节流** | 搜索输入 300ms 防抖、Resize/Scroll 节流 | 代码审查 `useDebounce`/`useThrottle` |
| **计算属性缓存** | 派生数据用 `computed` 而非 `methods` | 无重复计算、依赖追踪正确 |
| **v-memo / v-once** | 纯展示大列表行、静态内容 | PatchFlag 优化、Diff 跳过 |
| **事件清理** | `onUnmounted` 移除定时器/监听/订阅 | 无内存泄漏、Heap Snapshot 稳定 |
| **大对象浅层化** | 避免深层 `reactive`、大数组用 `shallowRef`/`shallowReactive` | 响应式开销可控 |

### 5.3 构建产物性能

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| **代码分割** | `manualChunks` 分离 vendor、业务模块 | `rollup-plugin-visualizer` 分析 |
| **Tree Shaking** | 无副作用导入、ESM 纯净 | 无未使用代码打包 |
| **压缩优化** | `terser` 压缩、gzip/brotli 预压缩 | `vite-plugin-compression` |
| **资源内联阈值** | `< 4KB` 图片/字体 base64 内联 | 无大量小文件请求 |

---

## 6. 安全规范 Review 核对 (P0 红线)

### 6.1 XSS 防护

| 检查项 | 标准 | ❌ 违规示例 |
|--------|------|-------------|
| 用户输入渲染 | 仅用 `{{}}` / `v-text` / `v-html` 配合 `DOMPurify.sanitize()` | `<div v-html="userInput" />` |
| 富文本编辑器 | 仅允许白名单标签/属性、输出端再次 sanitize | 直接 `v-html="editorContent"` |
| URL 参数渲染 | 解码后 sanitize 再渲染 | `decodeURIComponent(route.query.html)` 直接渲染 |
| JSONP/动态脚本 | 禁止 | `eval(response)`, `new Function(data)` |

### 6.2 敏感信息防护

| 检查项 | 标准 | ❌ 违规示例 |
|--------|------|-------------|
| Token/密钥/密码 | 仅存 `memory`/`httpOnly Cookie`/`sessionStorage`，不入 `localStorage`/代码/日志 | `localStorage.setItem('token', ...)` |
| 个人隐私 (手机/身份证/银行卡) | 传输加密、日志脱敏 `maskPhone`/`maskIdCard`、页面展示脱敏 | `console.log(user.phone)`、列表明文显示 |
| 内网地址/接口路径 | 仅环境变量 `import.meta.env.VITE_API_BASE_URL`，不硬编码 | `const API = 'http://10.0.0.1:8080/api'` |
| 调试代码 | 生产构建自动移除 `console.log`/`debugger` | 生产环境打印敏感信息 |

### 6.3 权限控制

| 检查项 | 标准 | ❌ 违规示例 |
|--------|------|-------------|
| 按钮级权限 | `v-permission="'domain:action'"` 指令 (待实现) | `v-if="user.role==='admin'"` 硬编码 |
| 路由守卫 | `meta.roles` + 全局前置守卫校验 | 页面内 `if (!hasPermission) router.back()` |
| 接口字段权限 | 后端按权限过滤字段，前端仅渲染返回字段 | 前端根据角色决定显隐敏感字段 |
| 操作确认 | 危险操作 `ElMessageBox.confirm` 二次确认 | 直接执行删除/禁用/导出 |

### 6.4 依赖安全

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| `npm audit` | 0 high/critical 漏洞 | CI 集成 `npm audit --prod --level=high` |
| 依赖版本锁定 | `package-lock.json`/`pnpm-lock.yaml` 提交 | 无版本漂移 |
| 供应链安全 | 仅官方源/私有源、禁用 `npm:`/`github:` 协议依赖 | `pnpm install` 无警告 |
| 定期更新 | 依赖更新 PR 自动化 (Dependabot/Renovate) | 定期合并更新 PR |

---

## 7. 错误处理与监控规范

### 7.1 错误分类与处理

| 错误类型 | 处理策略 | 用户反馈 | 日志上报 |
|----------|----------|----------|----------|
| **网络错误** (断网/超时/DNS) | 重试机制 (GET 幂等 3 次指数退避) | `ElMessage.error('网络异常，请重试')` | Sentry: `network_error` |
| **HTTP 非 2xx** | 统一拦截器处理、跳转错误页 | 401→登录页、403→无权限页、5xx→错误页 | Sentry: `http_${status}` |
| **业务错误** (code !== 200) | 返回 `Promise.reject`、页面 `catch` 处理 | `ElMessage.error(res.message)` | Sentry: `biz_${code}` |
| **前端运行时错误** | `window.onerror` + Vue `app.config.errorHandler` | 友好降级页、不白屏 | Sentry: `runtime_error` |
| **Promise 未捕获** | `unhandledrejection` 监听 | 兜底提示 | Sentry: `unhandled_rejection` |

### 7.2 错误边界与降级

```vue
<!-- App.vue 或 Layout.vue 顶层错误边界 -->
<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((err, instance, info) => {
  // 上报 Sentry
  reportError(err, { component: instance?.type?.name, info })
  // 显示降级 UI
  showFallbackUI.value = true
  return false // 阻止向上冒泡
})
</script>

<template>
  <FallbackUI v-if="showFallbackUI" @retry="showFallbackUI=false" />
  <router-view v-else />
</template>
```

---

## 8. 测试规范 Review 核对

### 8.1 单元测试覆盖要求

| 模块类型 | 覆盖率要求 | 重点覆盖 |
|----------|------------|----------|
| **L1 通用组件** | ≥ 90% | Props/Emits/Slots/方法/边界条件 |
| **L2 通用 Composable** | ≥ 95% | 核心逻辑/异常分支/参数校验 |
| **L3 工具函数** | 100% | 纯函数输入输出/边界值/异常 |
| **L5 业务组件** | ≥ 70% | 业务交互/Props 变化/事件触发 |
| **L6 业务 Hooks** | ≥ 80% | 状态变更/API 调用/副作用 |
| **Store** | ≥ 85% | Actions/State 变更/Getter 派生 |
| **API 模块** | ≥ 80% | 请求参数/响应解析/错误映射 |

### 8.2 测试代码规范

| 检查项 | 标准 |
|--------|------|
| 测试文件命名 | `xxx.spec.ts` / `xxx.test.ts` |
| Describe/It 描述 | 中文业务语义 `it('应能分页查询接口列表', ...)` |
| AAA 模式 | Arrange (准备) → Act (执行) → Assert (断言) |
| Mock 策略 | `vi.mock('@/api/...')`、Composable 依赖注入 Mock |
| 快照测试 | 组件渲染快照、错误 UI 快照 |
| 交互测试 | `fireEvent`/`userEvent` 模拟点击/输入/键盘 |

---

## 9. 文档同步规范

每次 PR 必须同步更新 (缺一不可)：

| 文档 | 触发条件 | 更新内容 |
|------|----------|----------|
| **类型定义** (`src/types/`) | 新增/修改接口、组件 Props、Store State | Interface/Type 同步 |
| **API 文档** (Swagger/OpenAPI 注解或单独 md) | 新增/修改 API 函数、参数、返回 | 接口契约同步 |
| **组件文档** (Storybook/README.md) | 新增/修改 L1/L5 组件 | Props/Emits/Slots/示例/版本记录 |
| **复用地图** (`08-module-reuse-map.md`) | 新增/废弃/迁移 L1-L6 资产 | 资产索引、API 速查、决策流程 |
| **项目扫描** (`01-project-scan.md`) | 新增业务域、调整目录、技术栈变更 | 业务地图、目录结构、典型模式 |
| **CHANGELOG** | 所有功能/修复/重构/性能/安全变更 | 版本、类型、描述、关联 PR |

---

## 10. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：架构分层、组件设计、状态管理、API规范、性能、安全、测试、文档同步 |

---

> **执行建议**：将本文档作为 Review 深度检查清单，配合自动化工具 (ESLint/TypeScript/测试覆盖率/SonarQube/依赖审计)。Reviewer 重点人工核对"架构分层边界"、"组件通信模式"、"状态分层"、"安全红线"、"性能关键点"。