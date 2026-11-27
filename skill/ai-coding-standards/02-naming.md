# 02 命名规范详细版

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 适用范围: 全项目代码、配置、文档、数据库字段映射

---

## 1. 通用原则

| 原则 | 说明 | 正例 | 反例 |
|------|------|------|------|
| **语义化** | 名称能表达业务含义、用途、类型 | `userList`, `getInterfaceInfo` | `list`, `data`, `fn1` |
| **一致性** | 同类事物统一命名模式 | 所有列表页用 `List` 后缀 | 有的 `List`、有的 `Table`、有的 `Grid` |
| **可搜索** | 避免单字母、缩写，便于全局搜索 | `currentPage`, `pageSize` | `cp`, `ps`, `pg` |
| **避免歧义** | 同名不同义必须加前缀/后缀区分 | `interfaceCode` vs `dataSourceCode` | 通用 `code` 字段 |
| **英语优先** | 业务术语用通用英语，特有名词拼音/注释 | `deptId` (部门), `prtCode` (特有业务码) | `bumenId`, `zhuanYeMa` |

---

## 2. 文件与目录命名

### 2.1 目录命名

| 类型 | 规范 | 示例 |
|------|------|------|
| **业务域目录** | kebab-case，名词复数或单数均可，统一项目内 | `interface-manage`, `data-source-manage`, `task-create` |
| **组件目录** | kebab-case，名词单数，表达组件类别 | `dialog`, `table`, `list-layout`, `pagination` |
| **通用目录** | kebab-case，标准英文词汇 | `components`, `views`, `api`, `utils`, `config`, `store`, `router`, `assets` |
| **私有子目录** | kebab-case，`components`/`hooks`/`mock` 固定约定 | `views/task-create/components`, `views/task-create/hooks` |

### 2.2 文件命名

| 文件类型 | 规范 | 示例 | 说明 |
|----------|------|------|------|
| **Vue 单文件组件** | PascalCase.vue | `ListLayout.vue`, `SubMenu.vue`, `InterfaceManage.vue` | 组件名 = 文件名 |
| **组合式函数** | camelCase + `use` 前缀 + `.js/.ts` | `useTable.js`, `useForm.ts`, `usePermission.js` | 必须以 `use` 开头 |
| **工具函数** | camelCase + `.js/.ts` | `date.js`, `request.js`, `format.js` | 动词或名词均可 |
| **API 接口文件** | camelCase + `.js` | `interface-manage/index.js` → 导出 `getInterfaceList` | 目录名 kebab-case，文件固定 `index.js` |
| **Store 模块** | camelCase + `Store` 后缀 + `.js/.ts` | `userStore.js`, `interfaceStore.ts` | Pinia `defineStore` 名称一致 |
| **路由配置** | `index.js` 固定 | `router/index.js` | 单入口 |
| **常量/配置** | camelCase + `.js/.ts` | `const.js`, `env.ts` | 纯常量导出 |
| **类型定义** | PascalCase + `.d.ts` 或 `types.ts` | `interface.d.ts`, `api-types.ts` | 类型优先放 `.d.ts` 或 `types/` 目录 |
| **测试文件** | 被测文件名 + `.spec/.test` + `.js/.ts` | `useTable.spec.ts`, `request.test.js` | 同目录或 `__tests__/` |
| **文档/说明** | kebab-case + `.md` | `naming.md`, `api-contract.md` | 全小写连字符 |
| **环境配置** | `.env.[mode]` | `.env.development`, `.env.production` | Vite 标准 |
| **忽略/配置文件** | 以 `.` 开头，标准命名 | `.gitignore`, `.prettierrc.js`, `eslint.config.js` | 工具约定俗成 |

---

## 3. 代码符号命名

### 3.1 变量与常量

| 类型 | 规范 | 示例 | 说明 |
|------|------|------|------|
| **常量 (Const)** | UPPER_SNAKE_CASE | `PAGINATION_HEIGHT`, `DEFAULT_PAGE_SIZE`, `API_BASE_URL` | `const` 声明，模块级导出 |
| **运行时常量对象** | PascalCase | `INTERFACE_API`, `DATE_SHORTCUTS` | 对象冻结 `Object.freeze()` |
| **响应式引用** | camelCase + 语义后缀 | `tableData`, `formInline`, `dialogVisible`, `loading` | `ref`/`reactive` 返回值 |
| **计算属性** | camelCase，名词性 | `menus`, `filteredData`, `visibleColumns` | `computed(() => ...)` |
| **方法/函数** | camelCase，动词开头 | `getList()`, `handleEdit()`, `formatDate()`, `validateForm()` | 事件处理用 `handle` 前缀 |
| **布尔标志** | camelCase，`is/has/can/should` 前缀 | `isExpand`, `hasPermission`, `canEdit`, `shouldRefresh` | 语义化判断 |
| **枚举/字典映射** | PascalCase + `Enum/Map/Options` 后缀 | `StatusEnum`, `UserRoleMap`, `PageSizeOptions` | 导出供模板直接用 |
| **私有/内部变量** | 下划线前缀 `_` + camelCase | `_debounceTimer`, `_cacheMap` | 仅文件内部使用 |

### 3.2 Props 与 Emits

```vue
<!-- Props: camelCase 定义，模板中 kebab-case 使用 -->
defineProps({
  /** 表格数据源 */
  data: { type: Array, default: () => [] },
  /** 总记录数 */
  total: { type: Number, default: 0 },
  /** 是否显示页脚 */
  showFooter: { type: Boolean, default: true },
  /** 自定义类名 */
  customClass: String
})

<!-- Emits: camelCase，语义化动作 -->
defineEmits([
  'pageDataChange',    // 分页变化
  'selectionChange',   // 选择变化
  'rowClick',          // 行点击
  'sortChange',        // 排序变化
  'filterChange'       // 筛选变化
])
```

| 规则 | 说明 |
|------|------|
| Props 定义用 camelCase，父组件传递用 kebab-case (`:custom-class="..."`) | Vue 自动转换 |
| Emits 事件名用 camelCase，语义格式：`{名词}{动词}` (`pageDataChange`, `selectionChange`) | 统一过去式/名词动词序 |
| Boolean 类型 Props 不加 `is/has` 前缀，直接语义名 (`showFooter`, `disabled`) | 模板 `:show-footer` 可读性好 |
| 回调类 Props 命名 `on{Event}` (`onSubmit`, `onCancel`) | 类似原生 `onClick` 约定 |

### 3.3 组件注册名

```vue
<script setup>
defineOptions({
  name: 'ListLayout'  // PascalCase，与文件名一致
})
</script>
```

| 规范 | 示例 | 说明 |
|------|------|------|
| `defineOptions({ name: 'PascalCase' })` | `ListLayout`, `SubMenu`, `JsonViewer` | 必须与文件名一致，DevTools 显示、递归引用、keep-alive 依赖此名 |
| 禁止匿名组件 | ❌ 无 `name` | 便于调试、性能分析、缓存 |

### 3.4 Slots 插槽名

| 场景 | 命名 | 示例 |
|------|------|------|
| **默认插槽** | 无名 | `<slot />` |
| **具名插槽** | kebab-case，语义区域名 | `header`, `footer`, `content`, `action`, `empty`, `loading`, `toolbar` |
| **作用域插槽参数** | 单数名词，代表单行/单项 | `scope.row`, `scope.$index`, `scope.column` |

---

## 4. Vue Router 命名

### 4.1 路由路径 (`path`)

| 规则 | 正例 | 反例 |
|------|------|------|
| kebab-case，名词复数或单数 | `/interface-manage`, `/data-sources`, `/task-create` | `/interfaceManage`, `/InterfaceManage` |
| 层级用 `/` 分隔，无尾随斜杠 | `/interface-manage/detail` | `/interface-manage/detail/` |
| 动态参数用 `:paramName` (camelCase) | `/interface-manage/:interfaceId` | `/interface-manage/:id` (歧义) |
| 纯查询页不带参数，用 `query` 传参 | `/data-source-manage?id=xxx` | `/data-source-manage/xxx` (非 REST) |

### 4.2 路由名称 (`name`)

| 规则 | 正例 | 反例 |
|------|------|------|
| kebab-case，与路径一致或语义等价 | `interface-manage`, `data-source-manage`, `task-create` | `InterfaceManage`, `interfaceManage` |
| 父路由名 = 路径首段 | `home` (对应 `/`) | `layout`, `index` |
| 登录等特殊页用语义名 | `login`, `404`, `403` | `LoginPage`, `NotFound` |

### 4.3 路由元信息 (`meta`)

```javascript
meta: {
  title: '接口管理',        // 菜单/标签页标题，中文
  icon: 'Location',         // Element Plus 图标名 (PascalCase)
  isHide: false,            // 是否隐藏菜单 (布尔)
  isActive: 'parent-name',  // 手动指定高亮父菜单 (字符串，可选)
  roles: ['admin', 'editor'], // 权限角色 (数组，可选)
  keepAlive: true,          // 是否缓存 (布尔，可选)
  affix: false              // 是否固定标签 (布尔，可选)
}
```

---

## 5. Pinia Store 命名

### 5.1 Store 定义

```javascript
// store/modules/interface.js
export const useInterfaceStore = defineStore('interface', () => {
  // state
  const interfaceList = ref([])
  const currentInterface = ref(null)
  
  // getters (computed)
  const enabledInterfaces = computed(() => ...)
  
  // actions
  const fetchInterfaceList = async () => ...
  const setCurrentInterface = (data) => ...
  
  return { interfaceList, currentInterface, enabledInterfaces, fetchInterfaceList, setCurrentInterface }
})
```

| 规范 | 示例 | 说明 |
|------|------|------|
| 文件名: `{domain}Store.js` 或 `{domain}.js` | `interfaceStore.js`, `user.js` | 模块化目录下 |
| `defineStore` 第一个参数 (id): kebab-case 或 camelCase | `'interface'`, `'user'` | 全局唯一，DevTools 显示 |
| 导出函数名: `use{Domain}Store` (PascalCase) | `useInterfaceStore`, `useUserStore` | Composition API 约定 |
| State 变量: camelCase，名词复数/单数 | `interfaceList`, `currentInterface` | 响应式引用 |
| Getters: camelCase，名词性 | `enabledInterfaces`, `interfaceMap` | 计算属性 |
| Actions: camelCase，动词开头 | `fetchInterfaceList`, `createInterface` | 异步用 `fetch/create/update/delete` 前缀 |

### 5.2 Store 使用

```vue
<script setup>
import { useInterfaceStore } from '@/store/modules/interface'
import { storeToRefs } from 'pinia'

const interfaceStore = useInterfaceStore()
// 解构保持响应性
const { interfaceList, enabledInterfaces } = storeToRefs(interfaceStore)
// 直接调用 action
await interfaceStore.fetchInterfaceList()
</script>
```

---

## 6. API 接口命名

### 6.1 API 文件组织

```
src/api/
├── request.js                 # Axios 封装
└── interface-manage/          # 业务域目录 (kebab-case)
    └── index.js               # 统一导出
```

### 6.2 API 函数命名

```javascript
// src/api/interface-manage/index.js
import request from '../request'

const INTERFACE_API = {
  // 列表查询
  LIST: '/v1/prt/openapi/appInterfaceInfo',
  // 详情
  DETAIL: '/v1/prt/openapi/appInterfaceInfo/detail',
  // 新增
  CREATE: '/v1/prt/openapi/appInterfaceInfo',
  // 修改
  UPDATE: '/v1/prt/openapi/appInterfaceInfo',
  // 删除
  DELETE: '/v1/prt/openapi/appInterfaceInfo',
  // 批量删除
  BATCH_DELETE: '/v1/prt/openapi/appInterfaceInfo/batch',
  // 启用/禁用
  TOGGLE_STATUS: '/v1/prt/openapi/appInterfaceInfo/status',
  // 导入
  IMPORT: '/v1/prt/openapi/appInterfaceInfo/import',
  // 导出
  EXPORT: '/v1/prt/openapi/appInterfaceInfo/export'
}

/** 获取接口列表 */
export const getInterfaceList = (params) => {
  return request.get(INTERFACE_API.LIST, { params })
}

/** 获取接口详情 */
export const getInterfaceDetail = (id) => {
  return request.get(`${INTERFACE_API.DETAIL}/${id}`)
}

/** 新增接口 */
export const createInterface = (data) => {
  return request.post(INTERFACE_API.CREATE, data)
}

/** 更新接口 */
export const updateInterface = (id, data) => {
  return request.put(`${INTERFACE_API.UPDATE}/${id}`, data)
}

/** 删除接口 */
export const deleteInterface = (id) => {
  return request.delete(`${INTERFACE_API.DELETE}/${id}`)
}

/** 批量删除 */
export const batchDeleteInterfaces = (ids) => {
  return request.post(INTERFACE_API.BATCH_DELETE, { ids })
}

/** 切换启用状态 */
export const toggleInterfaceStatus = (id, status) => {
  return request.put(`${INTERFACE_API.TOGGLE_STATUS}/${id}`, { status })
}
```

| 操作类型 | 函数前缀 | HTTP Method | 示例 |
|----------|----------|-------------|------|
| **查询列表** | `get{Xxx}List` / `fetch{Xxx}List` | GET | `getInterfaceList`, `fetchUserList` |
| **查询详情** | `get{Xxx}Detail` / `fetch{Xxx}ById` | GET | `getInterfaceDetail`, `fetchUserById` |
| **分页查询** | `get{Xxx}Page` / `query{Xxx}Page` | GET/POST | `getInterfacePage`, `queryUserPage` |
| **新增** | `create{Xxx}` / `add{Xxx}` | POST | `createInterface`, `addUser` |
| **修改** | `update{Xxx}` / `edit{Xxx}` | PUT/PATCH | `updateInterface`, `editUser` |
| **删除** | `delete{Xxx}` / `remove{Xxx}` | DELETE | `deleteInterface`, `removeUser` |
| **批量删除** | `batchDelete{Xxx}` | POST/DELETE | `batchDeleteInterfaces` |
| **状态切换** | `toggle{Xxx}Status` / `change{Xxx}Status` | PUT/PATCH | `toggleInterfaceStatus` |
| **导入** | `import{Xxx}` | POST | `importInterfaces` |
| **导出** | `export{Xxx}` | GET/POST | `exportInterfaces` |
| **校验/检查** | `check{Xxx}` / `validate{Xxx}` | GET/POST | `checkInterfaceCodeUnique` |
| **下载/上传** | `download{Xxx}` / `upload{Xxx}` | GET/POST | `downloadTemplate`, `uploadFile` |

### 6.3 API 常量命名

```javascript
// 接口路径常量对象：UPPER_SNAKE_CASE 作为 key
const INTERFACE_API = {
  LIST: '/v1/xxx/list',
  DETAIL: '/v1/xxx/detail',
  CREATE: '/v1/xxx',
  UPDATE: '/v1/xxx',
  DELETE: '/v1/xxx'
}
// 导出时不直接暴露常量对象，只导出封装函数
```

---

## 7. CSS/Less/Scss 命名

### 7.1 类名规范 (BEM 变体)

```less
/* Block: 组件根类名，与组件名 kebab-case 对应 */
.list-layout {
  /* Element: 子元素，__ 分隔 */
  &__header { }
  &__content { }
  &__footer { }
  &__table-container { }
  
  /* Modifier: 状态/变体，-- 分隔 */
  &--compact { }
  &--loading { }
  &--empty { }
  
  /* 状态类 (全局通用) */
  & .is-loading { }
  & .is-disabled { }
  & .is-hidden { }
  & .is-active { }
  & .is-expanded { }
  & .is-collapsed { }
}

/* 全局工具类：g- 前缀 */
.g-flex { display: flex; }
.g-flex-1 { flex: 1; }
.g-text-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.g-mt-16 { margin-top: 16px; }

/* 组件库覆盖：deep 选择器 + 语义类名 */
.table-container {
  :deep(.el-table) { }
  :deep(.header-cell) { background-color: #f9fbfe !important; }
}
```

| 规范 | 示例 | 说明 |
|------|------|------|
| 组件根类 = 组件名 kebab-case | `.list-layout`, `.table-container`, `.dialog-content` | scoped 自动加 hash，但根类保持语义 |
| 子元素用 `__` (双下划线) | `.list-layout__header`, `.table-container__pagination` | BEM Element |
| 修饰符用 `--` (双连字符) | `.list-layout--compact`, `.dialog-content--fullscreen` | BEM Modifier |
| 状态类用 `is-` 前缀 | `.is-loading`, `.is-disabled`, `.is-active` | 与 Element Plus 保持一致 |
| 全局工具类用 `g-` 前缀 | `.g-flex`, `.g-text-center`, `.g-mt-16` | 避免污染组件作用域 |
| 变量用 `$` + kebab-case | `$pagination-height`, `$dialog-min-width`, `$primary-color` | Less/Scss 变量 |
| Mixin 用 `@mixin` + kebab-case | `@mixin flex-center`, `@mixin ellipsis` | 复用样式逻辑 |

### 7.2 CSS Modules (如启用)

```vue
<!-- 文件名: Table.module.less -->
<style module lang="less">
.tableContainer { }
.headerCell { }
.pagination { }
</style>

<script setup>
import styles from './Table.module.less'
// 使用: :class="styles.tableContainer"
</script>
```

| 规范 | 示例 |
|------|------|
| 文件名: `{ComponentName}.module.less/scss` | `Table.module.less` |
| 类名: camelCase | `.tableContainer`, `.headerCell` |
| 导入对象名: `styles` (约定) | `import styles from './Table.module.less'` |

---

## 8. TypeScript 类型命名

```typescript
// 类型文件: types/interface.d.ts 或 api/interface-manage/types.ts

/** 接口列表项 */
export interface InterfaceListItem {
  interfaceCode: string
  interfaceName: string
  interfaceDescription: string
  address: string
  enabled: '0' | '1'
  createTime: string
}

/** 接口详情 */
export interface InterfaceDetail extends InterfaceListItem {
  sqlScript: string
  params: InterfaceParam[]
  returns: InterfaceReturn[]
}

/** 分页请求参数 */
export interface PageParams {
  pageNum: number
  pageSize: number
  [key: string]: any
}

/** 分页响应数据 */
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

/** API 统一响应 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/** 字典/枚举类型 */
export type StatusType = '0' | '1'
export type InterfaceType = 'webservice' | 'rest' | 'graphql'

/** 组件 Props 类型 */
export interface TableProps<T = any> {
  data: T[]
  total: number
  loading?: boolean
  rowKey?: string
}
```

| 类型分类 | 命名规范 | 示例 |
|----------|----------|------|
| **Interface (对象结构)** | PascalCase，名词单数 | `InterfaceListItem`, `UserInfo`, `PageResult` |
| **Type (联合/交叉/工具类型)** | PascalCase，描述性 | `StatusType`, `InterfaceType`, `Nullable` |
| **Enum (枚举对象)** | PascalCase + `Enum` 后缀 | `StatusEnum`, `RoleEnum` |
| **Generic 泛型参数** | 大写单字母或描述性 PascalCase | `<T>`, `<TData>`, `<TResponse>` |
| **类型别名导出** | 同接口命名 | `export type InterfaceListItem = ...` |

---

## 9. 数据库/后端字段映射命名

> 前端接收后端字段时，保持后端原样 (通常 snake_case)，**不在前端强行转 camelCase**，避免序列化成本和字段对不上。

```typescript
// 后端返回 (snake_case)
interface BackendInterface {
  interface_code: string
  interface_name: string
  create_time: string
  is_enabled: number
}

// 前端类型定义 (保持 snake_case，或用类型别名映射)
interface InterfaceItem {
  interface_code: string
  interface_name: string
  create_time: string
  is_enabled: 0 | 1
}

// 仅在模板显示时转换，不污染数据层
const formattedCreateTime = computed(() => 
  formatDate(row.create_time)  // 直接用原字段名
)
```

| 场景 | 策略 |
|------|------|
| **后端标准 snake_case** | 前端类型定义保持 snake_case，模板直接使用 |
| **后端非标准/混合** | 定义映射层 `transformers/interface.ts`，仅在 API 返回时一次性转换 |
| **前端发送请求** | 参数对象用 camelCase (JS 习惯)，由 `request.js` 或 API 函数统一转 snake_case (如需) |
| **表单 v-model 绑定** | 表单模型用 camelCase，提交前统一转换 |

---

## 10. 测试文件命名

| 文件类型 | 命名规范 | 示例 |
|----------|----------|------|
| **单元测试** | `{被测文件名}.spec.ts` 或 `.test.ts` | `useTable.spec.ts`, `request.test.ts` |
| **组件测试** | `{组件名}.spec.vue` 或 `.test.vue` | `Table.spec.vue`, `Dialog.test.vue` |
| **E2E 测试** | `{业务流程}.e2e.spec.ts` | `login-flow.e2e.spec.ts`, `interface-crud.e2e.spec.ts` |
| **测试工具/固定装置** | `test-utils.ts`, `fixtures/{domain}.ts` | `fixtures/interface.ts` |
| **测试描述 (describe/it)** | 中文描述业务行为 | `describe('接口管理列表页', () => { it('应能分页查询接口列表', () => {...}) })` |

---

## 11. Git 分支与提交命名

### 11.1 分支命名

| 分支类型 | 格式 | 示例 |
|----------|------|------|
| **功能开发** | `feat/{issue-id}-{short-desc}` | `feat/123-add-interface-import` |
| **Bug 修复** | `fix/{issue-id}-{short-desc}` | `fix/456-table-pagination-error` |
| **重构** | `refactor/{scope}-{short-desc}` | `refactor/table-virtual-scroll` |
| **热修复** | `hotfix/{version}-{short-desc}` | `hotfix/1.0.1-login-redirect` |
| **发布准备** | `release/{version}` | `release/1.2.0` |
| **技术债/升级** | `chore/{scope}-{short-desc}` | `chore/upgrade-element-plus-2.11` |

### 11.2 Commit Message (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

| type | 说明 | subject 示例 |
|------|------|--------------|
| `feat` | 新功能 | `feat(interface): 新增接口导入Excel功能` |
| `fix` | Bug 修复 | `fix(table): 修复分页总数计算错误导致末页空白` |
| `refactor` | 重构 (非功能/非修复) | `refactor(layout): 简化布局组件响应式逻辑` |
| `style` | 代码格式 (不影响逻辑) | `style: prettier 格式化全量代码` |
| `docs` | 文档变更 | `docs: 更新 API 接口文档 v1.2` |
| `chore` | 构建/工具/依赖更新 | `chore: 升级 element-plus 到 2.11.3` |
| `perf` | 性能优化 | `perf(table): 引入虚拟滚动优化大数据渲染` |
| `test` | 测试相关 | `test: 增加接口管理列表页单元测试` |
| `revert` | 回滚 | `revert: 撤销 "feat: 新增批量删除" (引入性能问题)` |

**Scope 规范**：`interface`, `data-source`, `task`, `log`, `layout`, `table`, `dialog`, `router`, `store`, `api`, `build`, `ci`, `deps` 等模块名。

---

## 12. 禁用/避免的命名模式

| 反模式 | 问题 | 替代方案 |
|--------|------|----------|
| 单字母变量 (`a`, `b`, `x`, `i`) | 不可搜索、无语义 | `index`, `item`, `user`, `interface` |
| 拼音/中式英语 (`shuju`, `liebiao`, `guanli`) | 团队协作障碍、不专业 | `data`, `list`, `manage` |
| 过度缩写 (`usr`, `cfg`, `info`, `dtl`, `params`) | 歧义、新人不懂 | `user`, `config`, `information`, `detail`, `parameters` |
| 通用名词无前缀 (`list`, `data`, `info`, `config`, `item`) | 同名冲突、搜索污染 | `interfaceList`, `userData`, `tableConfig`, `formItem` |
| 匈牙利符号 (`strName`, `numAge`, `bFlag`, `arrList`) | 类型随维护变化、冗余 | `name`, `age`, `isActive`, `list` |
| 连续编号 (`handleClick1`, `handleClick2`, `form1`, `form2`) | 无语义、难维护 | `handleEditClick`, `handleDeleteClick`, `basicForm`, `configForm` |
| 双重否定/反义 (`isNotDisabled`, `notHidden`, `disableEnable`) | 认知负担高 | `isEnabled`, `isVisible`, `isEditable` |

---

## 13. 命名检查清单 (Code Review 时核对)

- [ ] 文件/目录名符合 kebab-case / PascalCase 规范
- [ ] 组件 `defineOptions({ name })` 与文件名一致
- [ ] Props/Emits 使用 camelCase，语义清晰
- [ ] 路由 path/name 统一 kebab-case，meta 字段完整
- [ ] Store 导出 `use{Xxx}Store`，id 唯一，actions 动词前缀
- [ ] API 函数按 CRUD 标准前缀命名，常量对象 UPPER_SNAKE_CASE
- [ ] CSS 类名 BEM 变体，状态类 `is-`，工具类 `g-`
- [ ] TypeScript 类型 PascalCase，泛型单字母或描述性
- [ ] 无单字母、拼音、过度缩写、匈牙利、编号命名
- [ ] Commit message 符合 Conventional Commits，scope 准确

---

## 14. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：全维度命名规范，覆盖文件、代码、路由、Store、API、CSS、TS、Git |

---

> **执行建议**：配合 ESLint 插件 (`eslint-plugin-naming-convention`、`eslint-plugin-vue/naming-convention`) 自动化检查。新增规范需同步更新规则配置。