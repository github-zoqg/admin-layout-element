# 08 模块复用地图

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 目的: **帮助 AI 和开发者快速定位可复用资产，避免重复造轮子**

---

## 1. 复用资产分层索引

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        复用资产全景图 (L1-L6 分层)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  L1 通用组件库 (src/components/)          ← 全项目共享，架构组维护           │
│  ├── layout/           Layout.vue         ← 标准布局容器 (Header+Nav+Content)│
│  ├── navs/             Navs.vue, SubMenu.vue  ← 路由驱动菜单、折叠、权限过滤  │
│  ├── table/            Table.vue          ← 封装 el-table + 分页 + 固定高度   │
│  ├── list-layout/      ListLayout.vue     ← 列表页 Flex 容器 (Form+Table)    │
│  ├── list-form/        ListForm.vue       ← 标准查询表单 (待创建)            │
│  ├── pagination/       Pagination.vue     ← 统一分页 (页码/页大小/跳转)      │
│  ├── dialog/           Dialog.vue         ← 标准弹窗 (Header/Content/Footer) │
│  ├── drawer/           Drawer.vue         ← 抽屉组件 (侧边详情/编辑)         │
│  ├── header/           Header.vue         ← 顶部导航 (用户菜单/面包屑/全屏)   │
│  ├── json-viewer/      JsonViewer.vue     ← JSON 树形查看 (报文/配置)        │
│  └── setting/          Setting.vue        ← 设置面板 (待完善)                │
│                                                                             │
│  L2 通用逻辑 (composables/)               ← 全项目共享，架构组维护           │
│  ├── useTable.js       ← 表格通用逻辑 (分页/选择/加载/导出/排序)             │
│  ├── useForm.js        ← 表单通用逻辑 (校验/重置/提交/回显)                 │
│  ├── useDebounce.ts    ← 防抖 Hook                                        │
│  ├── useThrottle.ts    ← 节流 Hook                                        │
│  ├── usePermission.ts  ← 权限判断 Hook                                    │
│  ├── useClipboard.ts   ← 复制到剪贴板                                     │
│  ├── useDownload.ts    ← 文件下载 (Blob/URL)                              │
│  └── useLocalStorage.ts← 本地存储响应式封装                                │
│                                                                             │
│  L3 工具函数 (utils/)                     ← 全项目共享                     │
│  ├── request.js        ← Axios 封装 (拦截器/错误码/Token/取消)              │
│  ├── mitt.js           ← 事件总线 (logout/refresh/notify)                   │
│  ├── date.js           ← 日期快捷方式 (今天/昨天/一周前/本月/自定义)          │
│  ├── index.js          ← 通用工具 (路由扁平化/深拷贝/对象转FormData/生成UUID)  │
│  └── format.js         ← 格式化工具 (金额/数字/日期/文件大小/手机脱敏)        │
│                                                                             │
│  L4 配置常量 (config/)                    ← 全项目共享                     │
│  └── const.js          ← paginationHeight(64), minDialog(500), MediumDialog(800)│
│                                                                             │
│  L5 业务共享组件 (views/{domain}/components/)  ← 单业务域多页面共享         │
│  ├── task-create/      FormInfo.vue, StepForm.vue  ← 任务创建多步骤表单组件   │
│  └── (未来新增业务域同理)                                              │
│                                                                             │
│  L6 业务逻辑 Hooks (views/{domain}/hooks/)  ← 单业务域多页面共享             │
│  └── task-create/      index.js  ← 任务创建业务逻辑封装                       │
│                                                                             │
│  L7 页面私有 (views/{domain}/index.vue 等)  ← 单页面内联，不跨页面复用       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 核心组件 API 速查 (L1 通用组件库)

### 2.1 Layout 标准布局容器
```vue
<!-- src/components/layout/index.vue -->
<Layout>
  <!-- 默认 slot: 页面内容 (router-view) -->
</Layout>

<!-- Props -->
isExpand?: boolean          // 导航展开状态，默认 true
```
**使用场景**: 所有需左侧导航的页面 (路由父组件设置 `component: Layout`)

### 2.2 Navs/SubMenu 左侧导航菜单
```vue
<!-- src/components/navs/index.vue -->
<Navs />  <!-- 无 Props，自动读取路由生成菜单 -->

<!-- 路由 meta 控制菜单行为 -->
meta: {
  title: '菜单名',        // 必填
  icon: 'Location',       // Element Plus 图标名
  isHide: false,          // true=隐藏菜单但保留路由
  isActive: 'parent-name' // 手动指定高亮父菜单
}
```
**使用场景**: 所有标准业务页面，自动同步路由变更

### 2.3 Table 表格封装组件
```vue
<!-- src/components/table/index.vue -->
<Table
  :data="tableData"           // Array, 表格数据
  :total="total"              // Number, 总记录数
  :loading="loading"          // Boolean, 加载态
  :row-class-name="rowClass"  // Function, 行类名
  @selection-change="onSel"   // 选择变化
  @page-change="onPage"       // 分页变化 {pageNum, pageSize}
  @sort-change="onSort"       // 排序变化
>
  <el-table-column ... />     // 列定义 (slot)
</Table>

<!-- 内部已集成 Pagination，无需外层手动放置 -->
```
**关键特性**: 固定高度 `calc(100% - 64px)`、表头背景色、分页内置、选择列标准化

### 2.4 ListLayout 列表页布局容器
```vue
<!-- src/components/list-layout/index.vue -->
<ListLayout>
  <!-- 直接透传 children: ListForm + Table -->
  <ListForm ... />
  <Table ... />
</ListLayout>

<!-- 样式: flex:column, .table-container{flex:1,overflow:hidden} -->
```
**使用场景**: 所有标准列表页 (查询+表格+分页)

### 2.5 Pagination 分页组件
```vue
<!-- src/components/pagination/index.vue -->
<Pagination
  :total="total"              // Number, 总记录数
  :layout="layout"            // String, 默认 'total, sizes, prev, pager, next, jumper'
  @page-data-change="onPage"  // {currentPage, pageSize}
/>
```

### 2.6 Dialog 标准弹窗
```vue
<!-- src/components/dialog/index.vue -->
<Dialog
  v-model="visible"           // Boolean, 显隐
  :width="800"                // Number/String, 宽度
  :title="title"              // String, 标题 (或用 #header slot)
  :show-footer="true"         // Boolean, 显示底部按钮
  :before-close="onClose"     // Function, 关闭前钩子
  @sure="onSure"              // 确认回调
  @cancel="onCancel"          // 取消回调
>
  <template #header>自定义标题</template>
  <div class="content">内容区</div>
  <template #footer>自定义底部</template>
</Dialog>
```

### 2.7 Drawer 抽屉组件
```vue
<!-- src/components/drawer/index.vue -->
<Drawer
  v-model="visible"
  :width="800"
  :title="title"
  direction="rtl"             // ltr/rtl/ttb/btt
  @sure="onSure"
  @cancel="onCancel"
>
  内容区
</Drawer>
```

### 2.8 JsonViewer JSON 树形查看
```vue
<!-- src/components/json-viewer/index.vue -->
<JsonViewer
  :value="jsonData"           // Object/Array/String
  :expanded="false"           // 默认展开层级
  :copyable="true"            // 显示复制按钮
  :collapsible="true"         // 可折叠
/>
```

---

## 3. 通用 Composable API 速查 (L2)

### 3.1 useTable - 表格通用逻辑
```typescript
// composables/useTable.ts
interface UseTableOptions<T> {
  apiFn: (params: any) => Promise<PageResult<T>>
  defaultParams?: Record<string, any>
  immediate?: boolean
}

interface UseTableReturn<T> {
  // State
  tableData: Ref<T[]>
  total: Ref<number>
  loading: Ref<boolean>
  pageData: Ref<{pageNum: number; pageSize: number}>
  queryParams: Ref<Record<string, any>>
  multipleSelection: Ref<T[]>
  // Computed
  hasSelection: ComputedRef<boolean>
  // Methods
  loadData: () => Promise<void>
  handlePageChange: (val: {pageNum: number; pageSize: number}) => void
  handleSelectionChange: (val: T[]) => void
  handleSearch: (params: Record<string, any>) => void
  handleReset: () => void
  refresh: () => Promise<void>
}

export function useTable<T>(options: UseTableOptions<T>): UseTableReturn<T>
```

**使用示例**:
```vue
<script setup lang="ts">
import { useTable } from '@/composables/useTable'
import { getInterfaceList } from '@/api/interface-manage'
import type { InterfaceListItem } from '@/types/interface'

const { 
  tableData, total, loading, pageData, queryParams, multipleSelection,
  hasSelection, loadData, handlePageChange, handleSelectionChange,
  handleSearch, handleReset, refresh
} = useTable<InterfaceListItem>({
  apiFn: getInterfaceList,
  defaultParams: { status: '1' }
})
</script>
```

### 3.2 useForm - 表单通用逻辑
```typescript
// composables/useForm.ts
interface UseFormOptions<T> {
  initialValues: T
  rules?: Record<string, any>
  onSubmit: (values: T) => Promise<void>
  validateOnChange?: boolean
}

interface UseFormReturn<T> {
  formData: Ref<T>
  formRef: Ref<FormInstance | undefined>
  errors: Ref<Record<string, string[]>>
  isSubmitting: Ref<boolean>
  isValid: ComputedRef<boolean>
  validate: (name?: string) => Promise<void>
  resetFields: (name?: string) => void
  setFieldsValue: (values: Partial<T>) => void
  handleSubmit: () => Promise<void>
}

export function useForm<T>(options: UseFormOptions<T>): UseFormReturn<T>
```

### 3.3 其他常用 Composables
```typescript
// useDebounce - 防抖
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T, delay: number
): (...args: Parameters<T>) => void

// useThrottle - 节流
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T, delay: number
): (...args: Parameters<T>) => void

// usePermission - 权限判断
export function usePermission(): {
  hasPermission: (perm: string) => boolean
  hasAnyPermission: (perms: string[]) => boolean
  hasAllPermissions: (perms: string[]) => boolean
}

// useClipboard - 复制
export function useClipboard(): {
  copy: (text: string) => Promise<boolean>
  copied: Ref<boolean>
}

// useDownload - 下载
export function useDownload(): {
  download: (blob: Blob, filename: string) => void
  downloadByUrl: (url: string, filename: string) => void
}

// useLocalStorage - 响应式本地存储
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T>
```

---

## 4. 工具函数速查 (L3)

### 4.1 request.js - HTTP 请求
```javascript
// utils/request.js
import request from '@/utils/request'

// GET
request.get<PageResult<InterfaceListItem>>('/api/list', { params: { pageNum: 1 } })

// POST
request.post<{success: boolean}>('/api/create', { name: 'xxx' })

// PUT
request.put<{success: boolean}>('/api/update/123', { name: 'xxx' })

// DELETE
request.delete<{success: boolean}>('/api/delete/123')

// 文件上传
request.post<{url: string}>('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// 文件下载
request.get<Blob>('/api/export', { params, responseType: 'blob' })
```

### 4.2 mitt.js - 事件总线
```javascript
// utils/mitt.js
import emitter from '@/utils/mitt'

// 发射
emitter.emit('logout')
emitter.emit('refresh:menu')
emitter.emit('notify', { type: 'success', message: '操作成功' })

// 监听 (onMounted/onUnmounted 配对)
onMounted(() => {
  emitter.on('logout', handleLogout)
})
onUnmounted(() => {
  emitter.off('logout', handleLogout)
})
```

### 4.3 date.js - 日期快捷方式
```javascript
// utils/date.js
import { shortcuts } from '@/utils/date'

// 用于 el-date-picker :shortcuts
// [
//   { text: '今天', value: new Date() },
//   { text: '昨天', value: () => { const d=new Date(); d.setDate(d.getDate()-1); return d } },
//   { text: '一周前', value: () => { const d=new Date(); d.setDate(d.getDate()-7); return d } }
// ]
```

### 4.4 index.js - 通用工具
```javascript
// utils/index.js
import { 
  flattenRoutes,    // 路由扁平化 (用于菜单生成)
  deepClone,        // 深拷贝
  objectToFormData, // 对象转 FormData
  generateUUID,     // 生成 UUID
  debounce,         // 防抖函数
  throttle,         // 节流函数
  formatNumber,     // 数字格式化 (千分位/精度)
  formatFileSize,   // 文件大小格式化
  maskPhone,        // 手机号脱敏
  maskIdCard        // 身份证脱敏
} from '@/utils'
```

---

## 5. 业务域组件复用清单 (L5)

### 5.1 task-create 任务创建 (views/task-create/)
```
components/
├── FormInfo.vue      ← 步骤1: 基础信息表单 (任务名/类型/周期/优先级)
└── StepForm.vue      ← 步骤2-N: 通用步骤表单容器 (Props: schema, model, rules)

hooks/
└── index.js          ← useTaskCreate: 任务创建全流程逻辑
                        // 状态管理、步骤校验、草稿保存、提交、测试连接
```

**复用指引**: 新增多步骤向导页时，参考 `FormInfo`/`StepForm` 组件模式，复用 `useTaskCreate` 逻辑结构

---

## 6. API 模块复用清单

| 业务域 | API 文件 | 导出函数标准集 |
|--------|----------|----------------|
| interface-manage | `src/api/interface-manage/index.js` | `getInterfaceList`, `getInterfaceDetail`, `createInterface`, `updateInterface`, `deleteInterface`, `batchDeleteInterfaces`, `toggleInterfaceStatus`, `exportInterfaces`, `validateInterfaceCode` |
| data-source-manage | `src/api/data-source-manage/index.js` (待创建) | `getDataSourceList`, `getDataSourceDetail`, `createDataSource`, `updateDataSource`, `deleteDataSource`, `testConnection`, `syncDataSource` |
| task-create | `src/api/task-create/index.js` (待创建) | `getTaskList`, `getTaskDetail`, `createTask`, `updateTask`, `deleteTask`, `runTask`, `stopTask`, `getTaskLogs` |
| log-query | `src/api/log-query/index.js` (待创建) | `getLogList`, `getLogDetail`, `exportLogs`, `clearLogs` |
| auth | `src/api/auth/index.js` (待创建) | `login`, `logout`, `getUserInfo`, `refreshToken`, `changePassword` |

**新增 API 模块标准步骤**:
1. 创建 `src/api/{domain}/index.js`
2. 定义路径常量对象 (UPPER_SNAKE_CASE)
3. 导出标准 CRUD 函数 + 业务特有函数
4. 使用 `request.js` 实例，添加 TypeScript 类型
5. 添加 JSDoc 注释 (参数、返回、错误码)

---

## 7. 类型定义复用清单

```
src/types/
├── global.d.ts           # 全局扩展 (Window, ImportMetaEnv, ElementPlus 组件扩展)
├── api.d.ts              # API 通用类型 (ApiResponse, PageParams, PageResult)
├── common.d.ts           # 通用类型 (SelectOption, TreeNode, DictMap, FormInstance)
├── interface.d.ts        # 接口管理类型
├── data-source.d.ts      # 数据源类型 (待创建)
├── task.d.ts             # 任务类型 (待创建)
├── log.d.ts              # 日志类型 (待创建)
└── user.d.ts             # 用户/权限类型 (待创建)
```

**新增业务类型标准结构**:
```typescript
// types/{domain}.d.ts
import type { PageParams, PageResult, SelectOption } from './common'

/** 列表项 */
export interface {Domain}ListItem {
  id: string
  name: string
  code: string
  status: '1' | '0'
  createTime: string
  updateTime: string
  // 业务特有字段...
}

/** 详情 (继承列表项 + 扩展) */
export interface {Domain}Detail extends {Domain}ListItem {
  // 详情特有字段...
}

/** 查询参数 */
export interface {Domain}QueryParams extends PageParams {
  name?: string
  status?: '1' | '0'
  // 业务筛选字段...
}

/** 表单数据 */
export interface {Domain}FormData {
  name: string
  code: string
  status: '1' | '0'
  // 业务表单字段...
}

/** 状态选项常量 */
export const {Domain}StatusOptions: SelectOption<'1' | '0'>[] = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]
```

---

## 8. 复用决策流程图 (AI/开发者参考)

```mermaid
flowchart TD
    A[需要实现功能] --> B{是否为通用基础能力?}
    B -- 是 --> C[查找 L1 组件库 / L2 Composables / L3 Utils]
    C --> D{找到合适?}
    D -- 是 --> E[直接复用]
    D -- 否 --> F{需扩展现有?}
    F -- 是 --> G[扩展 L1/L2/L3 (PR 评审)]
    F -- 否 --> H[创建新 L1 资产 (架构组评审)]
    
    B -- 否 --> I{是否为业务域共享?}
    I -- 是 --> J[查找 L5 业务共享组件 / L6 业务 Hooks]
    J --> K{找到合适?}
    K -- 是 --> L[直接复用]
    K -- 否 --> M[创建 L5/L6 资产 (业务组评审)]
    
    I -- 否 --> N[页面私有实现 L7]
    
    style E fill:#e8f5e9
    style L fill:#e8f5e9
    style G fill:#fff3e0
    style H fill:#ffebee
    style M fill:#fff3e0
```

---

## 9. 资产健康度监控指标

| 指标 | 目标 | 检查频率 | 责任人 |
|------|------|----------|--------|
| **L1 组件复用率** | ≥ 80% 页面使用标准组件 | 每季度 | 架构组 |
| **L2 Composable 覆盖率** | 核心逻辑 100% 封装 | 每月 | 架构组 |
| **重复代码率** | < 5% (SonarQube) | 每次 PR | CI/架构组 |
| **组件文档完整度** | 100% 有 README/Storybook | 每版本发布 | 组件作者 |
| **单测覆盖率** | L1/L2 ≥ 90%, L5 ≥ 70% | 每季度 | 测试组 |
| **类型定义完整度** | 0 `any` 在公共 API | 每次 PR | TypeScript 严格模式 |

---

## 10. 常见复用陷阱与避坑指南

| 陷阱 | 症状 | 避坑方案 |
|------|------|----------|
| **过度抽象** | 组件 Props > 20、插槽嵌套 > 3 层、无人敢改 | 设定复用门槛：≥3 处使用才提取，保留适度重复 |
| **跨域强耦合** | 业务组件引用其他业务域 Store/API | 严格分层：L5 仅限单业务域，跨域仅通过 L1-L3 |
| **版本地狱** | 组件升级导致多业务页同时报错 | 语义化版本、废弃周期 ≥ 2 版本、发布变更日志 |
| **文档失真** | 组件实际 API 与文档不符 | 文档即代码：用 TypeScript 类型 + JSDoc 自动生成文档 |
| **测试缺失** | 重构后功能回归无感知 | 强制 L1/L2 新增/修改必须补单测，CI 门禁 |
| **样式污染** | scoped 穿透过多、全局样式冲突 | 规范 BEM + CSS 变量，严控 `:deep()` 使用 |

---

## 11. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：L1-L7 分层索引、核心组件/Composable/工具函数/API/类型速查、复用决策流程、健康度指标、避坑指南 |

---

> **维护提醒**：每新增一个通用组件、Composable、工具函数、API 模块、类型定义，**必须**同步更新本文档对应章节。参考 Skill 自动进化机制 (`skill/index.md`)，先更新文档再落地代码。本文档是 AI 查找可复用资产的"地图"，准确性直接影响生成代码质量。