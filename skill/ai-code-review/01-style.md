# 01 代码风格审查规范

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 适用: Code Review 时的代码风格核对标准

---

## 1. 命名规范核对 (对标 02-naming.md)

### 1.1 文件与目录命名

| 检查点 | 标准 | ✅ 通过 | ❌ 不通过 |
|--------|------|--------|----------|
| Vue 组件文件 | PascalCase.vue | `UserList.vue` | `userList.vue`, `user-list.vue` |
| 组合式函数 | useXxx.ts | `useTable.ts` | `tableHook.ts`, `use_table.ts` |
| 工具函数/常量 | camelCase.ts | `request.ts`, `const.ts` | `Request.ts`, `CONST.ts` |
| API 模块目录 | kebab-case | `interface-manage/` | `interfaceManage/`, `InterfaceManage/` |
| API 导出文件 | index.js 固定 | `index.js` | `api.js`, `interface.js` |
| Store 模块 | xxxStore.ts / xxx.ts | `userStore.ts` | `UserStore.ts`, `store_user.ts` |
| 类型定义 | PascalCase.d.ts | `interface.d.ts` | `interfaceTypes.d.ts` |
| 测试文件 | xxx.spec.ts | `useTable.spec.ts` | `test_useTable.ts` |

### 1.2 代码符号命名

| 类型 | 规范 | ✅ 正例 | ❌ 反例 |
|------|------|--------|--------|
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` | `defaultPageSize`, `DefaultPageSize` |
| 运行时常量对象 | PascalCase | `INTERFACE_API` | `interfaceApi`, `InterfaceApi` |
| 响应式变量 | camelCase + 语义后缀 | `tableData`, `loading`, `dialogVisible` | `data`, `flag`, `show` |
| 计算属性 | camelCase 名词性 | `hasSelection`, `filteredList` | `getHasSelection`, `filterList` |
| 方法/函数 | camelCase 动词开头 | `fetchList()`, `handleDelete()` | `list()`, `del()`, `onClick()` |
| 布尔标志 | is/has/can/should 前缀 | `isLoading`, `hasPermission` | `loading`, `permission`, `flag` |
| Props 定义 | camelCase | `initialParams`, `showActions` | `initial_params`, `show-actions` |
| Emits 事件 | camelCase {名词}{动词} | `pageChange`, `selectionChange` | `onPageChange`, `page-change` |
| 组件注册名 | PascalCase | `defineOptions({name:'UserList'})` | 无 name、或 `user-list` |
| CSS 类名 | kebab-case (BEM) | `.user-list__item--active` | `.userListItem`, `.user_list_item` |
| CSS 变量 | kebab-case | `$primary-color`, `$dialog-width` | `$primaryColor`, `$dialog_width` |
| 路由 path/name | kebab-case | `/user-manage`, `user-manage` | `/userManage`, `UserManage` |
| Store id | kebab-case | `defineStore('user', ...)` | `defineStore('User', ...)` |
| Store 导出函数 | useXxxStore | `useUserStore` | `use_user_store`, `UserStore` |

### 1.3 命名红线 (Review 直接驳回)

- ❌ 单字母变量 (`a`, `b`, `i`, `x` 除循环索引)
- ❌ 拼音/中式英语 (`shuju`, `liebiao`, `guanli`)
- ❌ 过度缩写 (`usr`, `cfg`, `dtl`, `params` → `user`, `config`, `detail`, `parameters`)
- ❌ 通用名词无前缀 (`list`, `data`, `info` → `userList`, `formData`, `userInfo`)
- ❌ 匈牙利符号 (`strName`, `numAge`, `bFlag`, `arrList`)
- ❌ 连续编号 (`handleClick1`, `form1`, `dialog2`)
- ❌ 双重否定 (`isNotDisabled`, `notHidden` → `isEnabled`, `isVisible`)

---

## 2. Vue SFC 结构与格式 (对标 05-code-style.md)

### 2.1 文件结构顺序 (强制)

```vue
<!-- 1. 模板注释 (可选) -->
<!-- 2. <script setup lang="ts"> -->
    <!-- 导入: 外部库 → @内部绝对路径 → 相对路径 -->
    <!-- 类型导入: import type -->
    <!-- Props: defineProps + withDefaults -->
    <!-- Emits: defineEmits -->
    <!-- 响应式状态: ref/reactive/computed (分组注释) -->
    <!-- 方法: 数据获取 → 事件处理 → 业务逻辑 → 工具方法 -->
    <!-- 监听器 -->
    <!-- 生命周期 -->
    <!-- 依赖注入 -->
    <!-- defineExpose -->
<!-- 3. </script> -->
<!-- 4. <template> -->
    <!-- 根容器 → 头部/工具栏 → 查询/表单 → 主内容 → 弹窗/抽屉 -->
<!-- 5. </template> -->
<!-- 6. <style scoped lang="less/scss"> -->
    <!-- 根容器布局 → 子区域 → 状态修饰符 → 响应式 → :deep() 覆盖 -->
<!-- 7. </style> -->
```

### 2.2 Script Setup 核对项

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| 语言声明 | `lang="ts"` 必填 | 无 `lang="js"` |
| 导入分组 | 外部库 → @内部 → 相对路径，组间空行 | ESLint `import/order` |
| 类型导入 | `import type { ... }` | 无运行时导入类型 |
| Props 定义 | `withDefaults(defineProps<Props>(), {...})` | 无 `defineProps({...})` 旧语法 |
| Props 必填/默认 | 必填无默认值，非必填有默认值 | `withDefaults` 覆盖所有非必填 |
| Props 类型 | Interface 定义，每个属性有 JSDoc | 无 `any`、无裸类型 |
| Emits 定义 | `defineEmits<Emits>()` 函数签名语法 | 无数组语法 `['event']` |
| 响应式声明 | 显式泛型 `ref<Type[]>([])`、`reactive<Type>({})` | 无隐式 `any` 推导 |
| Computed 返回类型 | 显式 `: ComputedRef<Type>` 或泛型 `computed<Type>(() => ...)` | 无隐式推导 |
| 方法类型 | 参数/返回显式类型 `const fn = async (arg: Type): Promise<Ret> =>` | 无隐式 `any` |
| 生命周期清理 | `onUnmounted` 清理定时器/监听/订阅 | 无内存泄漏风险 |
| defineExpose | 显式类型 `defineExpose<{refresh:()=>Promise<void>}>({...})` | 无暴露或类型缺失 |

### 2.3 Template 核对项

| 检查项 | 标准 | ✅ 正例 | ❌ 反例 |
|--------|------|--------|--------|
| 指令缩写 | `@click`、`:prop`、`#slot` | `@click="handleClick"` | `v-on:click="handleClick"` |
| 布尔属性 | 简写 `:disabled="loading"` | `:disabled="loading"` | `:disabled="loading === true"` |
| 事件参数 | 需要时传 `$event` | `@click="handleEdit(row)"` | `@click="handleEdit(row, $event)"` |
| 条件渲染 | 频繁切换 `v-show`，其余 `v-if` | `v-show="dialogVisible"` | `v-if="dialogVisible"` (频繁) |
| 列表 Key | 稳定唯一标识 | `:key="item.id"` | `:key="index"`、随机 key |
| 插槽写法 | `#default="scope"` | `<template #default="scope">` | `<slot name="default">` |
| 组件名大小写 | PascalCase 区分原生 | `<UserList />` | `<user-list />` |
| 属性顺序 | `v-if` → `v-for` → `:key` → `:prop` → `@event` → `ref` | 规范顺序 | 乱序 |
| 内联表达式 | 复杂逻辑移至 computed/methods | `:class="rowClass"` | `:class="item.status===1?'success':''"` |

### 2.4 Style 核对项

| 检查项 | 标准 | 验收方式 |
|--------|------|----------|
| Scoped | `scoped` 必加 | 无全局污染风险 |
| 预处理器 | `lang="less"` 或 `scss` 统一项目 | 无混用 |
| BEM 命名 | 根类=组件名 kebab-case，`__`子元素，`--`修饰符 | `.user-list__header--compact` |
| 状态类 | `is-*` 前缀 | `.is-loading`, `.is-disabled` |
| 工具类 | `g-` 前缀 (全局) / 组件内避免 | `.g-flex`, `.g-mt-16` |
| 响应式断点 | `@media (max-width: 992px)` 等标准断点 | 覆盖移动/平板/桌面 |
| :deep() 覆盖 | 最小化，仅覆盖组件库样式 | `:deep(.el-table__header) { background: #f9fbfe }` |
| 硬编码颜色 | 禁用，用 CSS 变量/主题 Token | 无 `#165DFF` 等直接色值 |
| 单位规范 | 长度 `px`/`rem`，时间 `ms`/`s`，无 `pt`/`cm` | 统一单位 |

---

## 3. TypeScript 类型规范 (对标 05-code-style.md §3)

### 3.1 类型定义核对

| 检查项 | 标准 | ✅ 正例 | ❌ 反例 |
|--------|------|--------|--------|
| Interface 命名 | PascalCase 单数名词 | `InterfaceListItem` | `InterfaceListItems`, `interface_list_item` |
| Type 命名 | PascalCase 描述性 | `StatusType`, `Nullable` | `status_type`, `T` (非泛型) |
| Enum 对象 | PascalCase + Enum 后缀 | `StatusEnum` | `STATUS_ENUM`, `Status` |
| 泛型参数 | 单大写字母或描述性 | `<T>`, `<TData>`, `<TResponse>` | `<type>`, `<Data>` |
| 可选属性 | `?` 标记，严格模式下精确类型 | `name?: string` | `name: string \| undefined` |
| 索引签名 | 避免，改用 `Record<K, V>` | `Record<string, SelectOption>` | `[key: string]: any` |
| 函数类型 | 箭头函数语法 | `(id: string) => Promise<User>` | `function(id: string): Promise<User>` |
| 联合类型 | 字面量类型优先 | `'1' \| '0'` | `string` |
| 类型导出 | `export type/interface` | `export interface User` | 无导出或默认导出类型 |

### 3.2 Vue SFC 中类型使用

| 场景 | 标准写法 |
|------|----------|
| Props 类型 | `defineProps<{ initialParams?: Partial<QueryParams> }>()` |
| Props 默认值 | `withDefaults(defineProps<Props>(), { initialParams: () => ({}) })` |
| Emits 类型 | `defineEmits<{ (e:'change', val: string): void }>()` |
| Ref 类型 | `const list = ref<User[]>([])` |
| Reactive 类型 | `const form = reactive<FormData>({ name: '' })` |
| Computed 类型 | `const filtered = computed<User[]>(() => ...)` |
| 方法参数/返回 | `const fetch = async (params: QueryParams): Promise<PageResult<User>> =>` |
| 模板引用 | `const tableRef = ref<InstanceType<typeof Table> \| null>(null)` |
| 组件暴露 | `defineExpose<{ refresh: () => Promise<void> }>({ refresh })` |
| 类型导入 | `import type { User, QueryParams } from '@/types/user'` |

### 3.3 类型红线

- ❌ 使用 `any` (公共 API、Props、Emits、返回值) — 仅允许内部实现细节且有 `// TODO: fix type` 备注
- ❌ 隐式 `any` 推导 — 必须显式泛型或类型注解
- ❌ `as` 断言绕过类型检查 — 除非极其确定且有注释说明
- ❌ `// @ts-ignore` / `// @ts-expect-error` 滥用 — 仅针对第三方库缺陷
- ❌ 循环依赖类型 — 拆分类型文件或用 `import type`

---

## 4. ESLint/Prettier 规范核对 (对标 05-code-style.md §1-2)

### 4.1 必须通过的自动化检查

```bash
# 提交前必须全通过
npm run lint          # ESLint 0 errors
npm run format --check # Prettier 0 changes
npx tsc --noEmit      # TypeScript 0 errors
```

### 4.2 ESLint 核心规则 (违规直接驳回)

| 规则 | 级别 | 说明 |
|------|------|------|
| `vue/component-name-in-template-casing` | error | 模板组件名 PascalCase |
| `vue/block-order` | error | script → template → style |
| `vue/attribute-hyphenation` | error | 模板属性 kebab-case |
| `vue/html-self-closing` | error | 统一自闭合标签 |
| `vue/max-attributes-per-line` | error | 单行 1 属性，多行 1 属性 |
| `@typescript-eslint/consistent-type-imports` | error | `import type` 语法 |
| `@typescript-eslint/no-unused-vars` | warn | 下划线开头忽略 |
| `prefer-const` | error | 能用 const 必用 const |
| `no-var` | error | 禁用 var |
| `import/order` | error | 分组+字母序+空行分隔 |

### 4.3 Prettier 核心格式 (违规自动修复)

| 规则 | 配置 | 示例 |
|------|------|------|
| 分号 | `semi: true` | `const a = 1;` |
| 引号 | `singleQuote: true` | `'string'` |
| 缩进 | `tabWidth: 2` | 2 空格 |
| 尾逗号 | `trailingComma: 'es5'` | `{a: 1,}` |
| 行宽 | `printWidth: 100` | 超过换行 |
| 括号空格 | `bracketSpacing: true` | `{ a: 1 }` |
| 箭头函数参数 | `arrowParens: 'avoid'` | `x => x` |
| 换行符 | `endOfLine: 'lf'` | LF |

### 4.4 格式化红线

- ❌ `eslint-disable` 注释无正当理由 (仅允许第三方库兼容且有备注)
- ❌ `prettier-ignore` 注释滥用
- ❌ 手动格式化与 Prettier 冲突 (必须统一工具)

---

## 5. Import/Export 规范

### 5.1 导入顺序分组 (ESLint `import/order` 强制)

```typescript
// 1. Node.js 内置模块
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. 外部依赖 (npm packages)
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 3. 内部绝对路径 (@/ 别名)
import { useTable } from '@/composables/useTable'
import { getUserList } from '@/api/user'

// 4. 父级相对路径
import { formatDate } from '../utils/date'

// 5. 同级相对路径
import { FormInfo } from './components/FormInfo'

// 6. 索引文件
import type { User } from './types'
```

### 5.2 导出规范

| 场景 | 标准 | 示例 |
|------|------|------|
| 单一默认导出 | 组件/Composable/Store 入口 | `export default defineStore(...)` |
| 命名导出 | 工具函数/类型/常量/多导出 | `export const formatDate = ...` |
| 类型导出 | `export type/interface` | `export interface User` |
| 重新导出 | 桶文件聚合 | `export * from './user'` |
| 禁止 | 默认导出 + 命名导出混用 | ❌ `export default fn; export const x = 1` |

---

## 6. 代码风格 Review 快速核对表

提交者自查 / Reviewer 抽查：

- [ ] 文件/目录/符号命名全符合 02-naming.md
- [ ] Vue SFC 结构顺序规范 (script → template → style)
- [ ] `<script setup lang="ts">` 语言声明正确
- [ ] Props/Emits 类型完整、withDefaults 覆盖非必填
- [ ] 响应式变量显式泛型、Computed 返回类型显式
- [ ] 方法参数/返回类型完整、异步函数 Promise 返回类型
- [ ] 模板指令缩写、属性顺序、v-for key、组件名 PascalCase
- [ ] Style scoped + 预处理器统一、BEM 命名、响应式断点
- [ ] TypeScript 0 `any`、0 隐式推导、0 `@ts-ignore` 滥用
- [ ] `npm run lint` / `format --check` / `tsc --noEmit` 全通过
- [ ] Import 顺序分组规范、导出方式正确
- [ ] 无硬编码魔法数字/字符串/路径 (进 const.js / api / config)
- [ ] 注释完整：文件头、组件/函数 JSDoc、关键逻辑行内

---

## 7. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：命名、Vue SFC、TypeScript、ESLint/Prettier、Import/Export 审查标准 |

---

> **执行建议**：将本文档作为 Review 检查清单，配合 ESLint/Prettier/TypeScript 自动化门禁。Reviewer 重点人工核对"自动化覆盖不到"的项：命名语义、架构分层、业务逻辑、注释质量、复用决策。