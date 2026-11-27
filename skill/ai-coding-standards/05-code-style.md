# 05 代码风格规范：ESLint/Prettier/TypeScript/API/Vue SFC

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 核心原则: **工具强制统一，人工不再争论格式，专注业务逻辑**

---

## 1. ESLint 9 Flat Config 规范

### 1.1 当前配置概览 (`eslint.config.js`)

```javascript
// eslint.config.js - 核心规则集
export default [
  // Vue 3 推荐规则
  ...pluginVue.configs['flat/recommended'],
  
  // TypeScript 推荐规则
  ...typescriptEslint.configs.recommended,
  
  // Prettier 兼容 (关闭冲突规则)
  ...prettierConfig,
  
  // 自定义规则
  {
    rules: {
      // Vue 组件命名
      'vue/multi-word-component-names': 'off',        // 允许单词组件名 (如 Layout, Table)
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',                       // 下划线开头忽略
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/no-explicit-any': 'warn',   // 允许 any 但警告
      '@typescript-eslint/consistent-type-imports': 'error', // import type 语法
      
      // 通用最佳实践
      'prefer-const': 'error',                         // 能用 const 必用 const
      'no-var': 'error',                               // 禁用 var
      'object-shorthand': 'error',                     // 对象简写
      'prefer-arrow-callback': 'error',                // 箭头函数回调
      
      // Vue SFC
      'vue/block-order': ['error', {                   // block 顺序
        order: ['script', 'template', 'style']
      }],
      'vue/attribute-hyphenation': 'error',            // 模板属性 kebab-case
      'vue/html-self-closing': ['error', {             // 自闭合标签
        html: { void: 'always', normal: 'always', component: 'always' }
      }],
      'vue/max-attributes-per-line': ['error', {       // 单行属性数
        singleline: 1, multiline: 1
      }],
      
      // 导入排序
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' }
      }]
    }
  }
]
```

### 1.2 核心规则分类说明

| 规则类别 | 关键规则 | 级别 | 说明 |
|----------|----------|------|------|
| **Vue 必须** | `vue/component-name-in-template-casing` | error | 模板中组件名 PascalCase |
| | `vue/block-order` | error | script → template → style 顺序 |
| | `vue/attribute-hyphenation` | error | 模板属性 kebab-case |
| | `vue/html-self-closing` | error | 统一自闭合写法 |
| | `vue/max-attributes-per-line` | error | 单行 1 个属性，多行 1 个属性 |
| **TS 必须** | `@typescript-eslint/consistent-type-imports` | error | `import type` 语法 |
| | `@typescript-eslint/no-unused-vars` | warn | 下划线开头忽略 |
| **通用最佳实践** | `prefer-const` | error | 优先 const |
| | `no-var` | error | 禁用 var |
| | `object-shorthand` | error | 对象简写 |
| **导入规范** | `import/order` | error | 分组 + 字母序 + 空行分隔 |

### 1.3 禁用/调整规则记录

| 规则 | 状态 | 理由 |
|------|------|------|
| `vue/multi-word-component-names` | off | 允许 `Layout`、`Table`、`Dialog` 等单词通用组件名 |
| `@typescript-eslint/no-explicit-any` | warn | 兼容旧代码/第三方库，新代码避免使用 |
| `vue/require-default-prop` | off | Vue 3 有 `withDefaults`，不强制 |
| `vue/prop-name-casing` | off | Props 定义 camelCase，模板自动转 kebab-case |

---

## 2. Prettier 格式化规范

### 2.1 配置文件 (`.prettierrc.js`)

```javascript
// .prettierrc.js
export default {
  // 基础格式
  semi: true,                    // 分号结尾
  singleQuote: true,             // 单引号
  tabWidth: 2,                   // 2 空格缩进
  trailingComma: 'es5',          // 尾随逗号 (es5: 对象/数组最后一项)
  printWidth: 100,               // 单行最大 100 字符
  bracketSpacing: true,          // 对象括号内空格 { foo: bar }
  arrowParens: 'avoid',          // 箭头函数单参数无括号 x => x
  endOfLine: 'lf',               // LF 换行符
  
  // Vue/HTML
  vueIndentScriptAndStyle: true, // script/style 缩进
  htmlWhitespaceSensitivity: 'css', // HTML 空白敏感度
  
  // 覆盖特定文件
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 120,
        proseWrap: 'always'
      }
    },
    {
      files: ['*.json', '.*.rc', '.*.rc.*'],
      options: {
        parser: 'json'
      }
    }
  ]
}
```

### 2.2 忽略文件 (`.prettierignore`)

```
# 依赖与构建产物
node_modules/
dist/
build/
*.min.js
*.min.css

# IDE/编辑器
.vscode/*
!.vscode/extensions.json
.idea/

# 环境与日志
.env*
*.log
npm-debug.log*

# 测试覆盖率
coverage/

# 类型声明生成文件
*.d.ts
vite-env.d.ts

# 特殊文件
package-lock.json
yarn.lock
pnpm-lock.yaml
```

### 2.3 格式化执行

```bash
# 检查格式 (CI 用)
npx prettier --check .

# 自动修复 (pre-commit / 手动)
npx prettier --write .

# 指定文件
npx prettier --write src/views/interface-manage/index.vue
```

---

## 3. TypeScript 严格模式规范

### 3.1 `tsconfig.json` 关键配置

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    
    // 严格模式核心
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    
    // 类型安全增强
    "noUncheckedIndexedAccess": true,     // 数组/对象访问可能为 undefined
    "exactOptionalPropertyTypes": true,   // 可选属性精确类型
    "noImplicitOverride": true,           // 重写需显式 override
    "noPropertyAccessFromIndexSignature": true, // 索引签名需用 bracket
    
    // 模块与解析
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    
    // JSX / Vue
    "jsx": "preserve",
    "jsxImportSource": "vue",
    
    // 路径别名
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    
    // 类型检查不生成文件
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.2 Vue SFC 类型最佳实践

```vue
<script setup lang="ts">
/* ========== 1. 类型导入 (import type) ========== */
import type { InterfaceListItem, InterfaceQueryParams, PageResult } from '@/types/interface'
import type { TableProps } from '@/components/table/types'

/* ========== 2. Props 类型定义 (interface + withDefaults) ========== */
interface Props {
  /** 初始查询参数 */
  initialParams?: Partial<InterfaceQueryParams>
  /** 是否显示操作列 */
  showActions?: boolean
  /** 自定义行类名 */
  rowClassName?: (row: InterfaceListItem) => string
}

const props = withDefaults(defineProps<Props>(), {
  initialParams: () => ({}),
  showActions: true,
  rowClassName: () => ''
})

/* ========== 3. Emits 类型定义 ========== */
interface Emits {
  (e: 'row-click', row: InterfaceListItem): void
  (e: 'selection-change', rows: InterfaceListItem[]): void
  (e: 'page-change', page: { pageNum: number; pageSize: number }): void
}

const emit = defineEmits<Emits>()

/* ========== 4. 响应式状态类型推导 ========== */
// 显式泛型确保类型准确
const tableData = ref<InterfaceListItem[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

// 复杂响应式对象用 interface
interface QueryState extends InterfaceQueryParams {
  keyword: string
}
const queryForm = reactive<QueryState>({
  pageNum: 1,
  pageSize: 10,
  keyword: ''
})

/* ========== 5. Computed 返回类型显式声明 ========== */
const hasSelection = computed<boolean>(() => multipleSelection.value.length > 0)

const statusOptions = computed<{ label: string; value: '1' | '0' }[]>(() => [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
])

/* ========== 6. 方法参数返回类型 ========== */
const fetchList = async (): Promise<void> => {
  loading.value = true
  try {
    const res = await getInterfaceList({ ...queryForm })
    tableData.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (rows: InterfaceListItem[]): void => {
  multipleSelection.value = rows
}

/* ========== 7. 模板引用类型 ========== */
const tableRef = ref<InstanceType<typeof Table> | null>(null)
const formRef = ref<FormInstance | undefined>()

/* ========== 8. 暴露类型 ========== */
defineExpose<{
  refresh: () => Promise<void>
  getSelectedRows: () => InterfaceListItem[]
}>({
  refresh: fetchList,
  getSelectedRows: () => multipleSelection.value
})
</script>
```

### 3.3 类型定义文件规范 (`src/types/`)

```
src/types/
├── global.d.ts              # 全局类型扩展 (Window, ImportMetaEnv 等)
├── api.d.ts                 # API 通用响应类型
├── interface.d.ts           # 接口管理业务类型
├── data-source.d.ts         # 数据源业务类型
├── task.d.ts                # 任务业务类型
└── common.d.ts              # 通用类型 (分页、字典、选项等)
```

**通用类型模板** (`src/types/common.d.ts`)：
```typescript
// src/types/common.d.ts

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

/** 选项类型 (Select、Radio、Checkbox 通用) */
export interface SelectOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
  [key: string]: any
}

/** 树形数据节点 */
export interface TreeNode<T = any> {
  id: string | number
  label: string
  children?: TreeNode<T>[]
  [key: string]: any
}

/** 字典/枚举映射 */
export type DictMap<T extends string = string> = Record<T, SelectOption>
```

---

## 4. API 封装规范

### 4.1 请求层 (`src/api/request.js`)

```javascript
// src/api/request.js
import axios from 'axios'
import emitter from '@/utils/mitt'

// 创建实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,                    // 调整为 15s
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 统一添加 Token
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    
    // GET 参数序列化优化 (数组格式: ids=1&ids=2)
    if (config.method === 'get' && config.params) {
      config.paramsSerializer = (params) => 
        Object.entries(params).flatMap(([key, val]) => 
          Array.isArray(val) ? val.map(v => `${key}=${v}`) : `${key}=${val}`
        ).join('&')
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, status } = response
    
    // HTTP 状态码非 2xx
    if (status < 200 || status >= 300) {
      return Promise.reject(new Error(`HTTP ${status}`))
    }
    
    // 业务状态码处理
    switch (data.code) {
      case 200:
        return data.data  // 直接返回业务数据
      case 401:
        emitter.emit('logout')
        return Promise.reject(new Error('登录已过期，请重新登录'))
      case 403:
        ElMessage.error('无权限访问')
        return Promise.reject(new Error('Forbidden'))
      default:
        // 统一错误提示
        ElMessage.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error) => {
    // 网络/超时/取消错误
    if (axios.isCancel(error)) {
      console.debug('Request cancelled:', error.message)
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络')
    } else if (!error.response) {
      ElMessage.error('网络异常，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default service
```

### 4.2 业务 API 模块规范 (`src/api/{domain}/index.js`)

```javascript
// src/api/interface-manage/index.js
import request from '../request'
import type { InterfaceListItem, InterfaceQueryParams, PageResult } from '@/types/interface'

// ========== 1. 接口路径常量 (UPPER_SNAKE_CASE) ==========
const API = {
  LIST: '/v1/prt/openapi/appInterfaceInfo/list',
  DETAIL: '/v1/prt/openapi/appInterfaceInfo/detail',
  CREATE: '/v1/prt/openapi/appInterfaceInfo',
  UPDATE: '/v1/prt/openapi/appInterfaceInfo',
  DELETE: '/v1/prt/openapi/appInterfaceInfo',
  BATCH_DELETE: '/v1/prt/openapi/appInterfaceInfo/batch',
  TOGGLE_STATUS: '/v1/prt/openapi/appInterfaceInfo/status',
  EXPORT: '/v1/prt/openapi/appInterfaceInfo/export',
  IMPORT: '/v1/prt/openapi/appInterfaceInfo/import',
  VALIDATE_CODE: '/v1/prt/openapi/appInterfaceInfo/validate-code'
}

/**
 * 统一响应类型 (已由 request.js 解包，直接返回 data)
 */
type ListResponse = PageResult<InterfaceListItem>
type DetailResponse = InterfaceListItem
type BaseResponse = { success: boolean }

/**
 * 获取接口列表 (分页+查询)
 * @param {InterfaceQueryParams} params - 查询参数
 * @returns {Promise<ListResponse>}
 */
export const getInterfaceList = (params: InterfaceQueryParams) => {
  return request.get<PageResult<InterfaceListItem>>(API.LIST, { params })
}

/**
 * 获取接口详情
 * @param {string} interfaceCode - 接口编码
 * @returns {Promise<DetailResponse>}
 */
export const getInterfaceDetail = (interfaceCode: string) => {
  return request.get<InterfaceListItem>(`${API.DETAIL}/${interfaceCode}`)
}

/**
 * 新增接口
 * @param {Partial<InterfaceListItem>} data - 接口数据
 * @returns {Promise<BaseResponse>}
 */
export const createInterface = (data: Partial<InterfaceListItem>) => {
  return request.post<BaseResponse>(API.CREATE, data)
}

/**
 * 更新接口
 * @param {string} interfaceCode - 接口编码
 * @param {Partial<InterfaceListItem>} data - 接口数据
 * @returns {Promise<BaseResponse>}
 */
export const updateInterface = (interfaceCode: string, data: Partial<InterfaceListItem>) => {
  return request.put<BaseResponse>(`${API.UPDATE}/${interfaceCode}`, data)
}

/**
 * 删除接口
 * @param {string} interfaceCode - 接口编码
 * @returns {Promise<BaseResponse>}
 */
export const deleteInterface = (interfaceCode: string) => {
  return request.delete<BaseResponse>(`${API.DELETE}/${interfaceCode}`)
}

/**
 * 批量删除
 * @param {string[]} ids - 接口编码数组
 * @returns {Promise<BaseResponse>}
 */
export const batchDeleteInterfaces = (ids: string[]) => {
  return request.post<BaseResponse>(API.BATCH_DELETE, { ids })
}

/**
 * 切换启用状态
 * @param {string} interfaceCode - 接口编码
 * @param {'0'|'1'} status - 目标状态
 * @returns {Promise<BaseResponse>}
 */
export const toggleInterfaceStatus = (interfaceCode: string, status: '0' | '1') => {
  return request.put<BaseResponse>(`${API.TOGGLE_STATUS}/${interfaceCode}`, { status })
}

/**
 * 导出接口列表
 * @param {InterfaceQueryParams} params - 查询参数
 * @returns {Promise<Blob>}
 */
export const exportInterfaces = (params: InterfaceQueryParams) => {
  return request.get<Blob>(API.EXPORT, { params, responseType: 'blob' })
}

/**
 * 校验接口编码唯一性
 * @param {string} code - 接口编码
 * @param {string} [excludeId] - 编辑时排除自身
 * @returns {Promise<{valid: boolean}>}
 */
export const validateInterfaceCode = (code: string, excludeId?: string) => {
  return request.get<{valid: boolean}>(API.VALIDATE_CODE, { params: { code, excludeId } })
}
```

### 4.3 API 使用规范 (页面层)

```vue
<script setup lang="ts">
import { 
  getInterfaceList, 
  createInterface, 
  updateInterface, 
  deleteInterface,
  batchDeleteInterfaces,
  toggleInterfaceStatus,
  exportInterfaces 
} from '@/api/interface-manage'

// 统一错误处理封装
const handleApiCall = async <T,>(
  apiFn: () => Promise<T>,
  successMsg: string,
  errorMsg = '操作失败'
): Promise<T | null> => {
  try {
    loading.value = true
    const res = await apiFn()
    ElMessage.success(successMsg)
    return res
  } catch (error) {
    // request.js 已处理通用错误提示，此处可补充业务特定处理
    console.error(errorMsg, error)
    return null
  } finally {
    loading.value = false
  }
}

// 使用示例
const handleDelete = async (row: InterfaceListItem) => {
  try {
    await ElMessageBox.confirm('确定删除该接口？', '提示', { type: 'warning' })
    const success = await handleApiCall(
      () => deleteInterface(row.interfaceCode),
      '删除成功'
    )
    if (success) fetchList()
  } catch {
    // 用户取消
  }
}

const handleExport = async () => {
  const blob = await handleApiCall(
    () => exportInterfaces({ ...queryForm }),
    '导出成功',
    '导出失败'
  )
  if (blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `接口列表_${Date.now()}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }
}
</script>
```

---

## 5. Vue SFC 编码规范

### 5.1 文件结构顺序 (强制)

```vue
<!-- 
1. 模板注释 (可选，文件头)
2. <script setup lang="ts">
   - 导入 (外部库 → @内部绝对路径 → 相对路径)
   - 类型导入 (import type)
   - Props 定义 (defineProps + withDefaults)
   - Emits 定义 (defineEmits)
   - 响应式状态 (ref/reactive/computed, 分组注释)
   - 方法定义 (数据获取 → 事件处理 → 业务逻辑 → 工具方法)
   - 监听器
   - 生命周期钩子
   - 依赖注入
   - defineExpose
3. </script>

4. <template>
   - 根容器
   - 头部/工具栏
   - 查询/表单区域
   - 主内容 (表格/详情/图表)
   - 弹窗/抽屉 (放最后)
5. </template>

5. <style scoped lang="less/scss">
   - 根容器布局
   - 子区域样式
   - 状态修饰符 (--variant, .is-state)
   - 响应式断点 (@media)
   - :deep() 组件库覆盖
6. </style>
-->
```

### 5.2 模板规范

```vue
<template>
  <!-- 根容器单一元素或片段 -->
  <div class="interface-manage">
    
    <!-- 语义化区块注释 -->
    <!-- 页面标题与工具栏 -->
    <div class="page-header">
      <h2 class="page-title">接口管理</h2>
      <div class="page-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新增
        </el-button>
      </div>
    </div>
    
    <!-- 查询表单区域 -->
    <el-form :model="queryForm" :inline="true" size="small" class="query-form">
      <el-form-item label="接口名称" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入" clearable style="width: 220px" />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryForm.status" placeholder="请选择" clearable style="width: 180px">
          <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon> 查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </el-form-item>
    </el-form>
    
    <!-- 表格主内容区 -->
    <Table
      :data="tableData"
      :total="total"
      :loading="loading"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="interfaceName" label="接口名称" width="220" show-overflow-tooltip />
      <el-table-column prop="interfaceCode" label="接口编码" width="180" />
      <el-table-column prop="address" label="API地址" width="280" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'" effect="light">
            {{ scope.row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      
      <!-- 操作列固定右侧 -->
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
          <el-divider direction="vertical" />
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button type="text" size="small" danger @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </Table>
    
    <!-- 编辑/新增弹窗 -->
    <Dialog
      v-model="dialogVisible"
      :width="MediumDialog"
      :title="dialogTitle"
      @sure="handleDialogSure"
      @cancel="handleDialogCancel"
    >
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-form-item label="接口名称" prop="interfaceName">
          <el-input v-model="editForm.interfaceName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="接口编码" prop="interfaceCode">
          <el-input v-model="editForm.interfaceCode" placeholder="请输入" :disabled="!!editForm.id" />
        </el-form-item>
        <!-- 更多字段... -->
      </el-form>
    </Dialog>
    
  </div>
</template>
```

### 5.3 模板最佳实践

| 规范 | 正例 | 反例 |
|------|------|------|
| **指令缩写** | `@click`, `:prop`, `#slot` | `v-on:click`, `v-bind:prop`, `v-slot:slot` |
| **布尔属性** | `<el-button :disabled="loading">` | `<el-button :disabled="loading === true">` |
| **事件参数** | `@click="handleEdit(row)"` | `@click="handleEdit(row, $event)"` (除非需要 event) |
| **条件渲染** | `v-if="hasPermission"` | `v-show="hasPermission"` (频繁切换用 show) |
| **列表渲染** | `<el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />` | 无 key 或 index 为 key |
| **插槽写法** | `<template #default="scope">` | `<slot name="default" :scope="scope">` |
| **组件名** | `<Table>`, `<Dialog>` | `<table>`, `<dialog>` (PascalCase 区分原生标签) |
| **属性顺序** | `v-if` → `v-for` → `:key` → `:prop` → `@event` → `ref` | 乱序 |

### 5.4 Style 规范

```vue
<style scoped lang="less">
/* 1. 根容器布局 */
.interface-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  /* 2. 子区域样式 */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #e4e7ed;
    
    .page-title { font-size: 18px; font-weight: 600; color: #303133; }
    .page-actions { display: flex; gap: 12px; }
  }
  
  .query-form {
    padding: 16px 0;
    background: #fafafa;
    border-bottom: 1px solid #e4e7ed;
  }
  
  /* 3. 表格容器 - 关键：flex:1 占满剩余高度 */
  .table-container {
    flex: 1;
    overflow: hidden;
    min-height: 0;  /* 修复 flex 子项溢出问题 */
  }
  
  /* 4. 状态修饰符 */
  &--compact .page-header { padding: 8px 0; }
  &--loading .table-container { position: relative; }
  
  /* 5. 响应式断点 */
  @media (max-width: 992px) {
    .query-form { 
      .el-form-item { margin-bottom: 12px; }
    }
    .table-container { overflow-x: auto; }
  }
  
  /* 6. :deep() 覆盖组件库样式 */
  :deep(.el-table) { font-size: 13px; }
  :deep(.el-table__header-wrapper) { 
    :deep(.el-table__header) { background-color: #f9fbfe; }
  }
  :deep(.el-tag) { font-size: 12px; }
}
</style>
```

---

## 6. 代码风格检查清单 (提交前自查)

### 6.1 ESLint/Prettier
- [ ] `npm run lint` 通过 (0 errors)
- [ ] `npm run format` 无变更 (或已执行修复)
- [ ] 无 `eslint-disable` 注释 (除非有明确理由并备注)

### 6.2 TypeScript
- [ ] `npx tsc --noEmit` 通过 (0 errors)
- [ ] 无 `any` 类型 (或有 `// TODO: fix type` 备注)
- [ ] 所有导入类型用 `import type`
- [ ] Props/Emits/Refs/Computed 类型完整

### 6.3 Vue SFC
- [ ] 文件结构顺序规范 (script → template → style)
- [ ] `<script setup lang="ts">` 使用 TS
- [ ] Props 定义 `withDefaults(defineProps<Props>(), {...})`
- [ ] Emits 定义 `defineEmits<Emits>()`
- [ ] 模板指令缩写、属性顺序规范
- [ ] Style scoped + less/scss、BEM 命名、响应式断点

### 6.4 API 封装
- [ ] 请求统一用 `request.js` 实例
- [ ] API 函数按 CRUD 标准命名
- [ ] 参数/返回类型定义完整
- [ ] 错误处理统一封装 `handleApiCall`
- [ ] 无硬编码 URL、无直接 `axios` 使用

---

## 7. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：ESLint 9 Flat Config、Prettier、TS 严格模式、API 封装、Vue SFC 编码规范 |

---

> **执行建议**：将 ESLint + Prettier + TypeScript 检查集成到 CI 流水线 (GitHub Actions / GitLab CI)，禁止未通过检查的代码合并。新增规则需经架构组评审，统一发布配置包。