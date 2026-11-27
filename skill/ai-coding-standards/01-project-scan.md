# 01 项目扫描与业务地图

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组

---

## 1. 项目基础信息

| 维度 | 详情 |
|------|------|
| **项目名称** | admin-layout-element |
| **项目类型** | 企业级管理后台基础框架 (Vue 3 + Vite) |
| **核心定位** | 为业务系统提供开箱即用的布局、导航、表格、表单、弹窗等通用能力 |
| **Git 仓库** | 内部私有仓库 |
| **部署环境** | Docker + Nginx, 支持微前端子应用接入 |

---

## 2. 技术栈全景

### 2.1 核心运行时

```json
{
  "vue": "^3.5.21",              // Composition API + <script setup>
  "vite": "^7.1.6",              // 构建工具，支持 ESModule、HMR、插件生态
  "element-plus": "^2.11.3",     // UI 组件库，企业级、完善、中文友好
  "pinia": "^3.0.3",             // 状态管理，Vue 3 官方推荐
  "vue-router": "^4.5.1",        // 路由，History 模式、懒加载、守卫
  "axios": "^1.12.2",            // HTTP 客户端，拦截器、取消请求
  "mitt": "^3.0.1"               // 事件总线，200bytes、无依赖
}
```

### 2.2 工程化工具链

| 类别 | 工具 | 版本 | 关键配置 |
|------|------|------|----------|
| **代码规范** | ESLint | 9.x | Flat Config, Vue/TS/Prettier 集成 |
| **格式化** | Prettier | 3.x | 单引号、2空格、尾逗号、100列 |
| **Git Hooks** | Husky | 9.x | pre-commit + commit-msg |
| **暂存检查** | lint-staged | 16.x | 按文件类型分组并行校验 |
| **提交规范** | Commitlint | 20.x | Conventional Commits |
| **类型检查** | TypeScript | 5.x | 严格模式、Vue SFC 支持 |
| **CSS 预处理** | Less / Sass | 4.x / 1.x | 模块化、变量复用 |
| **打包分析** | rollup-plugin-visualizer | 6.x | 依赖体积、Chunk 分析 |
| **压缩/优化** | vite-plugin-compression / legacy / cdn-import | - | gzip/brotli、传统浏览器、CDN |

### 2.3 微前端就绪

- 预置 `@originjs/vite-plugin-federation` (Module Federation)
- 主应用可动态加载 `remote_app/HelloWorld` 等远程模块
- 共享依赖：Vue、Vue Router、Pinia、Element Plus

---

## 3. 目录结构深度解析

```
src/
├── api/                      # 接口层 - 按业务域划分
│   ├── request.js           # Axios 单例、拦截器、错误码映射
│   └── {domain}/            # 每个业务域一个目录
│       └── index.js         # 导出标准化 API 函数
├── assets/                   # 静态资源 (走构建管线)
├── components/               # 通用组件库 - 跨业务复用
│   ├── layout/              # 布局容器 (Layout.vue)
│   ├── navs/                # 导航菜单 (Navs.vue, SubMenu.vue)
│   ├── table/               # 表格封装 (Table.vue + Pagination)
│   ├── list-layout/         # 列表页布局容器
│   ├── list-form/           # 查询表单 (待创建)
│   ├── pagination/          # 分页组件
│   ├── dialog/              # 弹窗封装
│   ├── drawer/              # 抽屉组件
│   ├── header/              # 顶部导航栏
│   ├── json-viewer/         # JSON 树形查看
│   └── setting/             # 设置面板
├── config/                   # 运行时常量
│   └── const.js             # paginationHeight, minDialog, MediumDialog
├── composables/              # 组合式函数 (建议迁移 utils 部分)
├── router/                   # 路由配置
│   └── index.js             # 路由定义、格式化、守卫、菜单生成
├── store/                    # Pinia Store
│   └── index.js             # 入口、模块注册
├── utils/                    # 纯工具函数
│   ├── mitt.js              # 事件总线实例
│   ├── date.js              # 日期快捷方式
│   └── index.js             # 通用工具 (路由扁平化等)
├── views/                    # 页面视图 - 按业务域划分
│   ├── {domain}/            # 每个业务域一个目录
│   │   ├── index.vue        # 主页面 (列表/详情/编辑)
│   │   ├── components/      # 页面私有组件
│   │   ├── hooks/           # 页面私有逻辑复用
│   │   └── mock.js          # 假数据 (仅无真实接口时)
└── main.js                   # 应用入口
```

---

## 4. 业务域地图

| 业务域 | 路由前缀 | 核心页面 | 对应 API 模块 | 状态 |
|--------|----------|----------|---------------|------|
| **接口管理** | `/interface-manage` | 列表、详情、编辑 | `src/api/interface-manage` | ✅ 完成 |
| **数据源管理** | `/data-source-manage` | 列表、SQL编辑弹窗 | (待接入) | 🚧 模拟数据 |
| **任务创建** | `/task-create` | 多步骤向导表单 | (待接入) | 🚧 进行中 |
| **日志查询** | `/log-query` | 列表、详情 | (待接入) | 📋 规划中 |
| **接口查看** | `/view-interface` | 只读列表 | (待接入) | 📋 规划中 |
| **认证登录** | `/login` | 登录页 | (待接入) | 📋 规划中 |

> 💡 **新增业务域清单**：创建 `views/{domain}/` + `api/{domain}/` + 路由注册 + 菜单自动生成

---

## 5. 典型页面模式识别

### 5.1 标准列表页 (查询 + 表格 + 分页) — **占比 60%+**

```
ListLayout (flex: column)
  ├─ ListForm (查询区域，固定高度)
  │   ├─ el-form (inline/model)
  │   ├─ 字段组件: Input, Select, DatePicker, TreeSelect...
  │   └─ 操作按钮: 查询/重置/展开收起
  └─ Table (数据区域，flex: 1)
      ├─ el-table (v-bind="$attrs", 固定高度 calc(100% - 64px))
      ├─ 列定义: selection + 业务列 + 操作列(fixed:right)
      └─ Pagination (absolute bottom-right, emit pageDataChange)
```

**代表页面**：`interface-manage`、`data-source-manage`、`log-query`

### 5.2 标准详情页 (只读展示) — **占比 15%**

```
DetailContainer
  ├─ Header: 标题 + 返回按钮
  ├─ el-descriptions (2列, border, title)
  │   ├─ 基础字段映射
  │   └─ 状态字段用 el-tag 渲染
  └─ 关联数据 Tab (可选)
      └─ Table (复用标准表格)
```

### 5.3 标准编辑/新增页 (表单校验 + 保存) — **占比 20%**

```
FormPage (max-width 800px, center)
  ├─ el-steps (可选，多步骤场景)
  ├─ el-form (ref, model, rules, label-width)
  │   ├─ 分步渲染 (v-show activeStep)
  │   ├─ 字段: Input, Select, DatePicker, Upload, Editor...
  │   └─ 校验规则: required, pattern, validator, trigger
  └─ 操作栏: 上一步/下一步/提交/取消
```

**代表页面**：`task-create` (多步骤向导)

### 5.4 特殊页面模式

| 模式 | 场景 | 实现要点 |
|------|------|----------|
| **登录页** | `/login` | 居中、无 Layout、独立路由、表单校验 |
| **大屏/仪表盘** | 待扩展 | ECharts、响应式栅格、全屏、定时刷新 |
| **导入向导** | 批量导入 | 分步：上传→预览→映射→确认、进度条 |
| **配置中心** | 系统设置 | Tab 分类、表单分组、实时保存、版本回滚 |

---

## 6. 核心数据流向

```
用户交互 (View)
    │
    ▼
组件事件 (emit: pageDataChange, selectionChange, sure, cancel...)
    │
    ▼
页面逻辑 (setup: reactive/ref, onMounted, methods)
    │
    ▼
API 调用 (src/api/{domain}/index.js)
    │
    ▼
request.js (Axios 实例)
    ├─ Request Interceptor: 统一 headers、token、loading
    ├─ Response Interceptor: 
    │   ├─ code 200 → return data
    │   ├─ code 401 → emitter.emit('logout') → router.push('/login')
    │   └─ other → Promise.reject + ElMessage.error
    │
    ▼
后端服务 (RESTful API)
```

---

## 7. 状态管理分层

| 层级 | 适用场景 | 实现方式 | 示例 |
|------|----------|----------|------|
| **全局单例** | 用户信息、权限、主题、多语言 | Pinia Store (`useUserStore`, `useAppStore`) | `store/modules/user.js` |
| **页面级** | 列表查询条件、表格数据、分页、弹窗可见性 | 组件内 `reactive/ref` | `views/xxx/index.vue` |
| **跨组件通信** | 非父子组件、路由跳转携带数据 | mitt 事件总线 | `emitter.emit('logout')` |
| **URL 状态** | 筛选条件可分享、刷新保持 | Router Query Params | `router.push({ query: { id } })` |
| **缓存层** | 接口响应缓存、字典数据 | Pinia + localStorage/sessionStorage | 字典 Store (待建设) |

---

## 8. 路由与菜单自动化机制

### 8.1 路由定义规范 (`src/router/index.js`)

```javascript
export let routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: '首页', icon: 'HomeFilled' },
    redirect: 'interface-manage',      // 默认子路由
    component: Layout,                  // 布局容器
    children: [
      {
        path: 'interface-manage',
        name: 'interface-manage',
        meta: { title: '接口管理', icon: 'Location', isHide: false },
        component: () => import('@/views/interface-manage/index.vue')
      }
      // 更多子路由...
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录', icon: 'Login', isHide: true },  // 不显示在菜单
    component: () => import('@/views/login/index.vue')
  }
]
```

### 8.2 菜单自动生成 (`src/components/navs/index.vue`)

```javascript
// 核心逻辑：扁平化路由 → 过滤 → 渲染 el-menu
const menus = computed(() => {
  return useRouter()
    .getRoutes()
    .filter(item => !item.meta.isHide && item.children.length === 0)
})
```

**关键字段**：
- `meta.title` — 菜单显示名称
- `meta.icon` — Element Plus 图标名
- `meta.isHide` — `true` 隐藏菜单但保留路由 (如详情页、编辑页)
- `meta.isActive` — 手动指定高亮父菜单 (用于隐藏子页面)

---

## 9. 现有组件资产清单 (复用优先级: 高 → 低)

| 组件 | 复用成熟度 | 适用场景 | 扩展建议 |
|------|------------|----------|----------|
| `Layout` | ⭐⭐⭐⭐⭐ | 所有需左侧导航的页面 | 支持顶部 Tab 页签模式 |
| `Navs/SubMenu` | ⭐⭐⭐⭐⭐ | 所有受权限控制的菜单 | 权限指令集成 |
| `Table` | ⭐⭐⭐⭐ | 所有列表页 | 虚拟滚动、列拖拽、导出 |
| `Pagination` | ⭐⭐⭐⭐ | 所有分页场景 | 页码输入跳转、总条数展示 |
| `ListLayout` | ⭐⭐⭐⭐ | 标准列表页 | 顶部工具栏插槽 |
| `Dialog` | ⭐⭐⭐⭐ | 确认/编辑/详情弹窗 | 拖拽、全屏、多层级 |
| `Drawer` | ⭐⭐⭐ | 侧边详情/编辑 | 宽度预设、嵌套抽屉 |
| `JsonViewer` | ⭐⭐⭐ | 接口报文、配置查看 | 搜索、复制路径、折叠 |
| `Pagination` | ⭐⭐⭐⭐ | 所有分页 | 已完善 |

---

## 10. 待补齐的基础设施 (优先级排序)

| 优先级 | 项目 | 说明 | 预估工时 |
|--------|------|------|----------|
| **P0** | `src/components/list-form/index.vue` | 标准化查询表单组件，消除各页面内联重复 | 0.5d |
| **P0** | `src/composables/useTable.js` | 表格通用逻辑抽取 (分页、选择、加载、导出) | 1d |
| **P0** | `src/composables/useForm.js` | 表单通用逻辑 (校验、重置、提交、回显) | 1d |
| **P1** | 字典/枚举管理体系 | 后端字典接口 + 前端缓存 + `useDict` composable | 1.5d |
| **P1** | 权限指令 (`v-permission`) | 按钮级权限控制，集成路由守卫 | 1d |
| **P1** | 国际化 (i18n) | vue-i18n 接入，预留中英切换 | 1d |
| **P2** | 单元测试体系 | Vitest + Vue Test Utils + 覆盖率门槛 | 2d |
| **P2** | E2E 测试 | Playwright 关键路径覆盖 | 2d |
| **P2** | Storybook 组件文档 | 组件交互演示、Props 文档自动生成 | 1.5d |
| **P3** | 设计系统 Token | 颜色、间距、字体、阴影 Design Tokens | 1d |

---

## 11. 性能基线与优化方向

| 指标 | 当前基线 | 目标 | 优化手段 |
|------|----------|------|----------|
| **首屏加载 (LCP)** | ~1.8s | < 1.2s | 路由懒加载、CDN、gzip、预加载关键路由 |
| **包体积 (gzipped)** | ~450KB | < 300KB | Element Plus 按需导入、动态导入、移除未用依赖 |
| **路由切换** | ~200ms | < 100ms | keep-alive 缓存、预渲染 |
| **大列表渲染 (1000行)** | ~800ms | < 200ms | 虚拟滚动、分片渲染 |
| **TypeScript 类型检查** | ~15s | < 5s | 增量检查、跳过 node_modules |

---

## 12. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：全量扫描现有项目，建立业务地图与技术档案 |

---

> **维护提醒**：当新增业务域、引入新技术、调整目录结构时，必须同步更新本文档。参考 Skill 自动进化机制 (`skill/index.md`)，先更新文档再落地代码。