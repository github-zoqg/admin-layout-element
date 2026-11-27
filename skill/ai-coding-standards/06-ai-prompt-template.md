# 06 AI 标准提示词模板

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 目的: 让 AI 生成的代码**开箱即用、风格统一、符合项目规范**

---

## 1. 核心提示词模板 (必读必用)

### 1.1 标准开发提示词 (复制即用)

```markdown
## 角色设定
你是资深 Vue 3 前端工程师，精通 TypeScript、Element Plus、Pinia、Vite 生态。
你必须严格遵循本项目的 **AI 编码规范 (skill/ai-coding-standards/)** 生成代码。

## 必读规范文档 (按顺序阅读，内化为约束)
1. skill/ai-coding-standards/index.md          # 总纲、11条红线、开发流程
2. skill/ai-coding-standards/01-project-scan.md # 项目架构、技术栈、目录、业务地图
3. skill/ai-coding-standards/02-naming.md       # 命名规范 (文件/代码/路由/Store/API/CSS/TS/Git)
4. skill/ai-coding-standards/03-ui-standards.md # UI组件复用、布局模式、Element Plus约束
5. skill/ai-coding-standards/04-development-principles.md # 组件拆分、注释、复用、实现原则
6. skill/ai-coding-standards/05-code-style.md   # ESLint/Prettier/TS/API/Vue SFC 编码规范
7. skill/ai-coding-standards/07-page-scaffold-examples.md # 页面脚手架模板 (直接参考复制)
8. skill/ai-coding-standards/08-module-reuse-map.md # 模块复用地图 (优先复用现有组件)

## 核心约束 (违者代码无效)
❌ 禁止：引入新 UI 库、状态管理、请求库、表格方案
❌ 禁止：直接使用 el-table/el-dialog/el-pagination (须用 Table/Dialog/Pagination 封装)
❌ 禁止：硬编码 API 路径、环境变量、魔法数字
❌ 禁止：输出通用模板代码，必须贴合项目现有写法
❌ 禁止：先写代码后补文档，必须 Skill → Code 顺序
✅ 必须：优先复用 src/components/、src/composables/、src/utils/ 现有能力
✅ 必须：沿用项目既有页面结构 (ListLayout + ListForm + Table)
✅ 必须：通过 ESLint/Prettier/TypeScript 严格模式校验
✅ 必须：组件/函数/类型 完整 JSDoc 注释
✅ 必须：命名符合 02-naming.md 规范
✅ 必须：提交前自查 04-development-principles.md 第7节清单

## 任务描述
[在此填写具体需求，建议包含以下结构化信息：]

### 页面类型
- [ ] 标准列表页 (查询+表格+分页) → 参考 07-page-scaffold-examples.md 列表页模板
- [ ] 标准详情页 (只读展示) → 参考 详情页模板
- [ ] 标准编辑/新增页 (表单校验) → 参考 编辑页模板
- [ ] 多步骤向导页 → 参考 task-create 模式
- [ ] 登录/特殊页 → 独立布局

### 业务域与路由
- 业务域名称: (如 interface-manage, data-source-manage)
- 路由路径: (如 /interface-manage, /data-source-manage/detail)
- 菜单标题: (如 接口管理, 数据源管理)
- 菜单图标: (Element Plus 图标名，如 Location, Database)

### 数据模型 (TypeScript Interface)
```typescript
// 请定义完整的数据结构，包含列表项、详情、表单、查询参数
interface XxxListItem {
  id: string
  name: string
  code: string
  status: '1' | '0'
  createTime: string
  // 更多字段...
}
interface XxxQueryParams extends PageParams {
  name?: string
  status?: '1' | '0'
}
interface XxxFormData {
  name: string
  code: string
  // 更多字段...
}
```

### API 接口约定
- 列表: GET /api/xxx/list (params: XxxQueryParams) → PageResult<XxxListItem>
- 详情: GET /api/xxx/detail/:id → XxxListItem
- 新增: POST /api/xxx (data: XxxFormData) → {success: boolean}
- 修改: PUT /api/xxx/:id (data: XxxFormData) → {success: boolean}
- 删除: DELETE /api/xxx/:id → {success: boolean}
- 批量删除: POST /api/xxx/batch (ids: string[]) → {success: boolean}
- 导出: GET /api/xxx/export (params: XxxQueryParams) → Blob

### 交互需求
- [ ] 查询/重置/展开收起
- [ ] 新增/编辑弹窗 (Dialog/Drawer)
- [ ] 删除确认 (单个/批量)
- [ ] 状态切换 (启用/禁用)
- [ ] 导入/导出
- [ ] 行内操作 (查看/编辑/删除/更多)
- [ ] 表格选择/批量操作
- [ ] 详情页只读展开
- [ ] 多步骤表单向导

### UI/布局特殊要求
- [ ] 标准 ListLayout + Table + Pagination
- [ ] 表格虚拟滚动 (大数据量)
- [ ] 表单分组/分步
- [ ] 自定义渲染器 (标签、进度条、图片、链接)
- [ ] 响应式断点适配
- [ ] 打印/预览模式

### 权限/状态管理
- 按钮级权限: v-permission="'xxx:add'"
- 数据权限: 仅可见部门/自己创建
- 全局状态: useUserStore(), useAppStore()
- 页面状态: URL query 同步筛选条件

## 输出要求
1. **完整的 Vue SFC 代码** (script setup lang="ts" + template + style scoped lang="less")
2. **API 封装文件** (src/api/{domain}/index.js，含类型导入、JSDoc、标准 CRUD 函数)
3. **类型定义文件** (src/types/{domain}.d.ts，完整 Interface)
4. **路由配置片段** (可直接合并到 router/index.js)
5. **如需新增通用组件/Composable**，同步输出组件代码、类型、文档、单测桩
6. **代码末尾附带自查清单勾选结果** (参考 04-development-principles.md 第7节)
```

---

## 2. 场景化提示词变体

### 2.1 新增标准列表页

```markdown
基于标准提示词，新增【用户管理】列表页：

业务域: user-manage
路由: /user-manage
菜单: 用户管理 / UserFilled

数据模型:
```typescript
interface UserListItem {
  userId: string
  username: string
  realName: string
  email: string
  phone: string
  deptName: string
  roleNames: string[]
  status: '1' | '0'  // 启用/禁用
  lastLoginTime: string
  createTime: string
}
interface UserQueryParams extends PageParams {
  username?: string
  realName?: string
  status?: '1' | '0'
  deptId?: string
}
interface UserFormData {
  username: string
  realName: string
  email: string
  phone: string
  deptId: string
  roleIds: string[]
  status: '1' | '0'
}
```

特殊要求:
- 表格列: 选择、用户名、姓名、邮箱、手机、部门、角色标签组、状态、最后登录、创建时间、操作
- 角色用 el-tag type="info" 多标签展示，最多显示 3 个，超出 +N
- 状态切换需二次确认，禁用→启用需输入解锁码
- 新增/编辑用 Drawer (宽度 800px)，表单分两栏布局
- 批量导入用户 (Excel 模板下载 + 上传预览 + 确认导入)
- 导出当前筛选条件数据

请输出完整代码。
```

### 2.2 新增详情页

```markdown
基于标准提示词，新增【接口详情】页：

业务域: interface-manage (复用现有)
路由: /view-interface (已存在，完善功能)
入口: 接口管理列表 → "查看报文" 按钮跳转

数据模型 (扩展现有 InterfaceListItem):
```typescript
interface InterfaceDetail extends InterfaceListItem {
  // 基础信息
  protocol: 'HTTP' | 'HTTPS' | 'WEBSERVICE'
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  contentType: 'application/json' | 'application/xml' | 'text/plain'
  timeout: number
  retryCount: number
  // 请求参数
  requestParams: InterfaceParam[]
  requestHeader: InterfaceHeader[]
  requestBody: string  // JSON Schema 或示例报文
  // 响应定义
  responseParams: InterfaceParam[]
  responseExample: string
  // 关联数据
  testCases: TestCase[]
  callLogs: CallLog[]
}
interface InterfaceParam {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  example: string
  children?: InterfaceParam[]  // 对象/数组嵌套
}
```

UI 要求:
- 顶部: 标题 + 返回 + 编辑/复制/测试 按钮组
- 基础信息: el-descriptions 2列，含协议/方法/Content-Type/超时/重试
- Tab 页签: 请求参数 / 请求头 / 请求报文 / 响应定义 / 响应示例 / 测试用例 / 调用日志
- 请求/响应参数: 树形表格 (el-table + row-expand) 展示嵌套结构
- 报文区域: JsonViewer 组件 (只读、可折叠、可复制、行号)
- 测试用例/日志: 标准 Table + 分页

请输出完整代码。
```

### 2.3 新增多步骤向导页 (参考 task-create)

```markdown
基于标准提示词，新增【数据同步任务创建】向导页：

业务域: sync-task
路由: /sync-task/create
菜单: 任务创建 / Plus (隐藏菜单，从数据源管理跳转)

步骤设计:
Step 1: 基础配置 (任务名称、同步类型、调度周期、优先级)
Step 2: 数据源选择 (源数据源、目标数据源、表映射配置)
Step 3: 字段映射 (可视化拖拽映射、转换规则、过滤条件)
Step 4: 高级设置 (增量字段、水印字段、错误重试、告警通知)
Step 5: 预览确认 (生成 SQL/配置预览、测试连接、预估数据量)

技术要求:
- 使用 el-steps 步骤条，支持上一步/下一步/保存草稿
- 每步表单独立校验，校验通过才能进入下一步
- 步骤数据集中在 reactive 对象中，最终汇总提交
- 字段映射步骤复用/新建可视化映射组件 (参考 vue-draggable-next)
- 草稿自动保存到 localStorage，刷新恢复
- 提交前调用测试连接 API，失败阻止提交

请输出完整代码，含页面、子组件、hooks、类型、API。
```

### 2.4 重构/优化现有页面

```markdown
重构【接口管理】列表页，优化点:

1. 性能优化:
   - 引入 useTable composable 替代内联逻辑
   - 表格行虚拟滚动 (数据 > 100 时自动开启)
   - 防抖搜索 (300ms)
   - keep-alive 缓存列表页状态

2. 体验优化:
   - 查询表单折叠/展开 (默认显示 3 行，更多收起)
   - 表格列显示/隐藏/排序/固定 持久化到 localStorage
   - 批量操作工具栏 (选中行显示浮动栏: 批量启用/禁用/删除/导出)
   - 键盘快捷键: Enter 查询、Esc 关闭弹窗、Ctrl+N 新增

3. 代码质量:
   - 完整 TypeScript 类型、JSDoc 注释
   - 拆分私有组件: InterfaceTableColumns, InterfaceQueryForm, InterfaceEditDialog
   - 单元测试覆盖 useTable、工具函数、关键业务逻辑

请输出重构后的完整代码，保持原有功能不变。
```

### 2.5 新增通用组件/Composable

```markdown
新增通用组件【高级表格 TablePro】，扩展现有 Table：

需求来源: 多个业务页需要虚拟滚动、列设置、行展开、内联编辑

设计规范:
- 继承 Table 所有 Props/Emits/Slots，向后兼容
- 新增 Props:
  - virtual-scroll?: boolean (默认 false，数据量>100自动建议)
  - column-config?: boolean (显示列设置按钮，持久化)
  - row-expand?: boolean (启用行展开，配合 expand-slot)
  - inline-edit?: boolean (启用双击单元格编辑)
  - sticky-header?: boolean (表头吸顶，默认 true)
- 新增 Slots:
  - expand: 行展开内容 (scope: { row, expanded })
  - editor: 内联编辑渲染器 (scope: { row, column, value, onSave })
- 内部使用 useVirtualScroll、useColumnConfig、useInlineEdit composables

交付物:
1. src/components/table-pro/index.vue (组件代码)
2. src/components/table-pro/types.ts (Props/Emits/Slots 类型)
3. src/composables/useVirtualScroll.ts
4. src/composables/useColumnConfig.ts
5. src/composables/useInlineEdit.ts
6. 单元测试桩文件
7. Storybook stories / 使用示例文档
8. 更新 08-module-reuse-map.md 登记

请输出完整代码。
```

---

## 3. 提示词工程化最佳实践

### 3.1 上下文注入策略

| 策略 | 适用场景 | 实现方式 |
|------|----------|----------|
| **全量注入** | 新项目/新人/复杂重构 | 一次性喂给 AI 所有 8 个规范文档 + 项目核心文件 |
| **增量注入** | 日常开发/小需求 | 仅喂给 标准提示词 + 相关模板 + 目标业务域现有文件 |
| **检索增强 (RAG)** | 大型代码库/长期维护 | 建立向量索引，查询时检索相关规范片段 + 相似代码 |

### 3.2 提示词版本管理

```markdown
# 提示词版本记录

## v1.0 (2026-11-19) - 初版
- 建立标准提示词模板
- 定义 4 类场景化变体
- 明确输出要求清单

## v1.1 (计划)
- 增加 TypeScript 严格模式约束细则
- 增加单测生成要求
- 增加 Storybook 生成要求
- 集成到 CI: AI 生成代码必须通过 lint/typecheck/test
```

### 3.3 常见失败模式与对策

| 失败现象 | 根因 | 对策 |
|----------|------|------|
| 生成代码用 `el-table` 而非 `Table` | 未读 03-ui-standards.md 复用规则 | 提示词前置强制阅读清单，输出前自查 |
| 命名不规范 (拼音、缩写、单字母) | 未内化 02-naming.md | 提供命名反模式清单，要求输出前自查 |
| 类型定义缺失/使用 `any` | 未执行 05-code-style.md TS 规范 | 强制 `import type`、显式泛型、noImplicitAny |
| 组件通信混乱 ( Props/Emits/EventBus 滥用) | 未遵循 04-development-principles.md 通信模式 | 明确通信模式决策树，Code Review 核对 |
| 硬编码 API/常量/样式 | 未建立常量/配置/主题体系意识 | 提示词要求：常量进 const.js、API 进 api/、样式进变量 |
| 无注释/注释过时 | 未执行 04-development-principles.md 注释规范 | 强制 JSDoc 模板，CI 检查注释覆盖率 |

---

## 4. AI 代码生成验收标准 (Definition of Done)

生成的代码**必须**通过以下检查才可合并：

### 4.1 自动化检查 (CI 强制)

```bash
# 1. 代码风格
npm run lint          # ESLint 0 errors
npm run format --check # Prettier 0 changes

# 2. 类型检查
npx tsc --noEmit      # TypeScript 0 errors

# 3. 构建验证
npm run build         # Vite build 成功

# 4. 单元测试 (待引入 Vitest)
npm run test          # 覆盖率 ≥ 80% (核心逻辑 100%)
```

### 4.2 人工审查核对表

| 维度 | 核对项 | 权重 |
|------|--------|------|
| **规范遵循** | 复用标准组件、命名规范、注释完整、无硬编码 | P0 |
| **架构一致性** | 目录结构、分层架构、状态管理、路由菜单机制 | P0 |
| **功能完整性** | 需求覆盖、边界处理、异常流程、权限控制 | P0 |
| **代码质量** | 单一职责、低耦合、可测试、性能考量、安全防护 | P1 |
| **类型安全** | 无 any、泛型正确、Props/Emits 类型完整、API 类型对齐 | P1 |
| **UI/UX** | 符合设计规范、响应式、Loading/空/错状态、a11y 基础 | P1 |
| **文档同步** | 类型定义、API 文档、组件文档、复用地图更新 | P2 |

### 4.3 验收流程

```
AI 生成代码
    │
    ▼
开发者本地跑通 lint/typecheck/build
    │
    ▼
提交 PR → CI 自动化检查通过
    │
    ▼
Code Review (2人以上 Approve)
    │
    ├─ 规范核对 (架构组/资深)
    ├─ 业务核对 (产品/业务方)
    └─ 安全核对 (安全组/资深)
    │
    ▼
合并主干 → 部署预览环境 → 验收通过 → 发布
```

---

## 5. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：标准提示词、4类场景变体、工程化最佳实践、验收标准 |

---

> **使用建议**：将本文档第 1 节"标准提示词模板"固定为团队 AI 助手的 System Prompt 或每次对话的首条消息。场景化变体作为参考，根据实际需求组合调整。