# 03 UI 组件复用规则与布局模式

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 核心原则: **复用优于重造，规范优于自由，一致优于个性**

---

## 1. UI 技术栈锁定

| 层级 | 选型 | 版本 | 禁用/限制 |
|------|------|------|-----------|
| **基础组件库** | Element Plus | 2.11.x | ❌ 禁止引入 Ant Design Vue、Naive UI、Arco Design 等其他 UI 库 |
| **图标库** | @element-plus/icons-vue | 最新 | ✅ 仅允许使用 EP 官方图标，业务自定义图标放 `src/assets/icons/` |
| **CSS 框架** | 原生 CSS + Less/Scss | - | ❌ 禁止 Tailwind CSS、UnoCSS、Windi CSS 等原子化 CSS |
| **图表库** | ECharts (按需引入) | 5.x | 待接入时统一选型 |
| **富文本** | 待选型 (建议 wangEditor/vue-editor) | - | 统一选型前禁止自行引入 |
| **日期处理** | dayjs (轻量) | 1.x | ❌ 禁止 moment.js (体积大、停维) |

---

## 2. 布局系统规范

### 2.1 标准布局架构 (Layout 组件)

```vue
<!-- src/components/layout/index.vue -->
<template>
  <div class="layout_box" :class="{ 'nav-collapse': !isExpand }">
    <!-- 顶部 Header 固定高度 48px -->
    <div class="header">
      <Header />
    </div>
    <!-- 左侧导航 + 右侧内容区 Grid 布局 -->
    <div class="nav">
      <Navs />
      <!-- 折叠切换按钮 -->
      <div class="nav_toggle" @click="changeExpand">
        <el-icon v-if="isExpand"><Fold /></el-icon>
        <el-icon v-else><Expand /></el-icon>
      </div>
    </div>
    <!-- 内容区自适应 -->
    <div class="content">
      <div class="content_bg">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.layout_box {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 220px 1fr;     /* 展开: 220px 导航 + 1fr 内容 */
  grid-template-rows: 48px 1fr;         /* Header 48px + 内容 1fr */
  grid-template-areas:
    'header header'
    'nav content';
  transition: all 0.3s ease-in-out;
  
  .header { grid-area: header; }
  .nav { 
    grid-area: nav; 
    height: 100%; width: 100%; 
    overflow-y: auto; 
    display: flex; flex-direction: column; 
    background: white;
    > :first-child { flex-grow: 1; }    /* Navs 占满剩余高度 */
  }
  .nav_toggle { 
    border-top: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    height: 48px; display: flex; align-items: center; cursor: pointer; padding-left: 20px;
    &:hover { background-color: #f5f7fa; }
  }
  .content { 
    grid-area: content; 
    box-sizing: border-box; 
    height: 100%; width: 100%; 
    overflow-x: hidden; 
    padding: 0.5em 0 0.5em 0.5em;
    .content_bg { 
      background-color: #ffffff; 
      padding: 1em; 
      box-sizing: border-box; 
      height: 100%; 
      overflow-y: auto; 
    }
  }
}

/* 折叠状态: 导航宽度 64px */
.nav-collapse {
  grid-template-columns: 64px 1fr;
}
</style>
```

### 2.2 布局使用规则

| 场景 | 布局方式 | 关键点 |
|------|----------|--------|
| **标准业务页** | 直接使用 `<Layout>` 作为父路由组件 | 路由配置 `component: Layout`，children 为业务页 |
| **登录/注册/404** | 不使用 Layout，独立全屏页面 | 路由 `meta.isHide: true`，无父 Layout |
| **嵌入外部/微前端** | Layout 内嵌 iframe 或 远程组件 | 内容区高度 100%，滚动由内部控制 |
| **打印/预览页** | 独立路由，可选 Layout | 根据需求决定是否保留导航 |

### 2.3 列表页标准布局 (ListLayout)

```vue
<!-- src/components/list-layout/index.vue -->
<template>
  <div class="list-layout">
    <slot></slot>  <!-- 直接透传：ListForm + Table -->
  </div>
</template>

<script setup>
defineOptions({ name: 'ListLayout' })
</script>

<style lang="scss" scoped>
.list-layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .table-container {  /* Table 组件外层容器 */
    flex: 1;          /* 关键：占满剩余高度 */
    overflow: hidden; /* 防止双滚动条 */
  }
}
</style>
```

**标准组合模式**：
```vue
<ListLayout>
  <!-- 1. 页面标题 (可选) -->
  <div class="list_title">业务模块名称</div>
  
  <!-- 2. 查询表单区域 (固定/自适应高度) -->
  <ListForm :model="formInline" @submit="getList" @reset="resetForm">
    <el-form-item label="字段名" prop="fieldName">
      <el-input v-model="formInline.fieldName" placeholder="请输入" clearable />
    </el-form-item>
    <!-- 更多查询字段... -->
  </ListForm>
  
  <!-- 3. 表格区域 (flex: 1 自适应高度) -->
  <Table
    :data="tableData"
    :total="total"
    @selection-change="handleSelectionChange"
    @pageDataChange="pageDataChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="名称" width="200" />
    <!-- 业务列... -->
    <el-table-column fixed="right" label="操作" width="180">
      <template #default="scope">
        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-divider direction="vertical" />
        <el-button type="text" danger @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </Table>
</ListLayout>
```

---

## 3. 组件复用规则 (红线)

### 3.1 必须复用的核心组件

| 组件 | 路径 | 使用场景 | 禁止自行封装同类组件 |
|------|------|----------|---------------------|
| **Layout** | `src/components/layout/index.vue` | 所有带左侧导航的页面 | ❌ 禁止重写布局容器 |
| **Navs/SubMenu** | `src/components/navs/` | 左侧菜单导航 | ❌ 禁止手写菜单逻辑 |
| **Table** | `src/components/table/index.vue` | 所有列表表格 | ❌ 禁止直接用 `el-table` (除非极简场景) |
| **Pagination** | `src/components/pagination/index.vue` | 所有分页场景 | ❌ 禁止直接用 `el-pagination` |
| **ListLayout** | `src/components/list-layout/index.vue` | 标准列表页容器 | ❌ 禁止手写 flex 布局 |
| **Dialog** | `src/components/dialog/index.vue` | 所有模态弹窗 | ❌ 禁止直接用 `el-dialog` |
| **Drawer** | `src/components/drawer/index.vue` | 侧边栏详情/编辑 | ❌ 禁止直接用 `el-drawer` |

### 3.2 组件扩展而非重写

| 需求 | 推荐做法 | 禁止做法 |
|------|----------|----------|
| 表格需要虚拟滚动 | 扩展 `Table` 组件添加 `virtual-scroll` prop | 新建 `VirtualTable.vue` |
| 弹窗需要拖拽/全屏 | 扩展 `Dialog` 组件添加 `draggable`/`fullscreen` prop | 新建 `EnhancedDialog.vue` |
| 表单需要自定义校验 | 使用 `useForm` composable + `el-form` rules | 重写表单组件 |
| 导航需要权限控制 | 扩展 `Navs` 集成 `v-permission` 指令 | 业务页手写菜单过滤 |

### 3.3 新组件创建检查清单

创建新通用组件前，**必须**满足：
- [ ] 现有组件无法通过 props/slots/扩展满足需求
- [ ] 至少 3 个以上业务页面复用
- [ ] 有完整的 Props/Emits/Slots 类型定义
- [ ] 有单元测试覆盖核心逻辑
- [ ] 有 Storybook/文档示例
- [ ] 通过代码审查，架构组确认纳入组件库

---

## 4. Element Plus 组件使用约束

### 4.1 按钮规范

```vue
<!-- 主要操作：primary -->
<el-button type="primary" @click="handleSubmit">确定</el-button>

<!-- 次要操作：default -->
<el-button @click="handleCancel">取消</el-button>

<!-- 危险操作：danger -->
<el-button type="danger" @click="handleDelete">删除</el-button>

<!-- 文字按钮：text (表格操作列、工具栏次要) -->
<el-button type="text" @click="handleEdit">编辑</el-button>

<!-- 链接按钮：link (外部跳转、次要文字) -->
<el-button type="link" @click="handleView">查看详情</el-button>

<!-- 尺寸：默认 default，紧凑 small，大型 large -->
<el-button size="small">紧凑</el-button>

<!-- 禁用状态 -->
<el-button :disabled="loading" :loading="loading">提交中...</el-button>

<!-- 图标按钮 -->
<el-button circle><el-icon><Plus /></el-icon></el-button>
```

| 场景 | 类型 | 尺寸 | 图标 |
|------|------|------|------|
| 表单提交/新建/保存 | `primary` | `default` | 可选 |
| 表单取消/关闭 | `default` | `default` | 无 |
| 批量删除/危险操作 | `danger` | `default` | 可选 |
| 表格行内操作 (编辑/查看/删除) | `text` | `small` | 可选 |
| 工具栏次要操作 (导出/刷新/配置) | `text` / `link` | `small` | 推荐 |
| 仅图标操作 (折叠/全屏/设置) | `default` + `circle` | `small` | 必须 |

### 4.2 表格规范

```vue
<!-- 标准 Table 组件用法 -->
<Table
  :data="tableData"
  :total="total"
  :loading="loading"
  @selection-change="handleSelectionChange"
  @pageDataChange="pageDataChange"
  @sort-change="handleSortChange"
>
  <!-- 选择列：固定宽度，可配置 selectable -->
  <el-table-column type="selection" :selectable="selectable" width="55" />
  
  <!-- 普通列：prop 对应数据字段，label 表头名，width 固定宽度 -->
  <el-table-column prop="name" label="名称" width="200" show-overflow-tooltip />
  <el-table-column prop="code" label="编码" width="150" />
  
  <!-- 状态列：使用 template 渲染 el-tag -->
  <el-table-column prop="status" label="状态" width="100">
    <template #default="scope">
      <el-tag :type="statusTypeMap[scope.row.status]" effect="light">
        {{ statusLabelMap[scope.row.status] }}
      </el-tag>
    </template>
  </el-table-column>
  
  <!-- 时间列：格式化显示 -->
  <el-table-column prop="createTime" label="创建时间" width="180">
    <template #default="scope">
      {{ formatDateTime(scope.row.createTime) }}
    </template>
  </el-table-column>
  
  <!-- 操作列：fixed:right，宽度根据按钮数量调整 -->
  <el-table-column fixed="right" label="操作" width="180">
    <template #default="scope">
      <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
      <el-divider direction="vertical" />
      <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
      <el-divider direction="vertical" />
      <el-button type="text" size="small" danger @click="handleDelete(scope.row)">删除</el-button>
    </template>
  </el-table-column>
</Table>
```

**表格列宽度建议**：
| 列类型 | 推荐宽度 | 说明 |
|--------|----------|------|
| 选择列 | `55` | 固定 |
| ID/编码类 | `120-180` | 根据内容长度 |
| 名称/标题类 | `200-300` | `show-overflow-tooltip` 防溢出 |
| 状态/类型/标签 | `100-120` | 配合 el-tag |
| 日期时间 | `160-180` | 格式 `YYYY-MM-DD HH:mm:ss` |
| 金额/数字 | `120-150` | 右对齐 `align="right"` |
| 操作列 | `120-240` | 按钮数 × 60px + 分隔符 |

### 4.3 表单规范

```vue
<!-- 标准查询表单 (ListForm 组件待创建，现内联写法) -->
<el-form :model="formInline" :inline="true" size="small" class="query-form">
  <el-form-item label="名称" prop="name">
    <el-input v-model="formInline.name" placeholder="请输入名称" clearable style="width: 200px" />
  </el-form-item>
  
  <el-form-item label="状态" prop="status">
    <el-select v-model="formInline.status" placeholder="请选择" clearable style="width: 180px">
      <el-option label="启用" value="1" />
      <el-option label="禁用" value="0" />
    </el-select>
  </el-form-item>
  
  <el-form-item label="创建时间" prop="createTime">
    <el-date-picker
      v-model="formInline.createTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="YYYY-MM-DD"
      style="width: 300px"
      :shortcuts="dateShortcuts"
    />
  </el-form-item>
  
  <!-- 操作按钮区 -->
  <el-form-item>
    <el-button type="primary" @click="getList">
      <el-icon><Search /></el-icon> 查询
    </el-button>
    <el-button @click="resetForm">
      <el-icon><Refresh /></el-icon> 重置
    </el-button>
  </el-form-item>
</el-form>
```

**表单控件选择指南**：
| 数据类型 | 推荐控件 | 关键属性 |
|----------|----------|----------|
| 短文本 (≤50字) | `el-input` | `clearable`, `maxlength`, `show-word-limit` |
| 长文本/备注 | `el-input` `type="textarea"` | `:rows="4"`, `autosize`, `show-word-limit` |
| 单选枚举 (≤8项) | `el-select` | `clearable`, `filterable` (多项时) |
| 单选枚举 (>8项) | `el-select` + `filterable` | `remote` (超大量配合远程搜索) |
| 多选枚举 | `el-select` `multiple` | `collapse-tags`, `max` 限制数量 |
| 日期/时间 | `el-date-picker` | `type="date/datetime/daterange"`, `value-format` |
| 布尔开关 | `el-switch` | `active-value="1"`, `inactive-value="0"` |
| 数字/金额 | `el-input-number` | `precision`, `min/max`, `step` |
| 文件上传 | `el-upload` | `action`, `list-type="picture-card"`, `auto-upload` |
| 树形选择 | `el-tree-select` | `props`, `check-strictly` |
| 级联选择 | `el-cascader` | `options`, `props`, `filterable` |

### 4.4 弹窗/抽屉规范

```vue
<!-- Dialog 标准用法 -->
<Dialog
  v-model="dialogVisible"
  :width="MediumDialog"  /* 从 const.js 导入: 500/800/1000 */
  :title="dialogTitle"
  :show-footer="true"
  :before-close="handleBeforeClose"
  @sure="handleSure"
  @cancel="handleCancel"
>
  <el-form :model="editForm" :rules="rules" label-width="120px" ref="formRef">
    <el-form-item label="名称" prop="name">
      <el-input v-model="editForm.name" placeholder="请输入" />
    </el-form-item>
    <!-- 更多字段... -->
  </el-form>
</Dialog>

<!-- Drawer 标准用法 (适合详情、多字段编辑) -->
<Drawer
  v-model="drawerVisible"
  :width="MediumDialog"
  :title="drawerTitle"
  direction="rtl"
  @sure="handleSure"
  @cancel="handleCancel"
>
  <el-form :model="editForm" :rules="rules" label-width="120px">
    <!-- 字段... -->
  </el-form>
</Drawer>
```

| 场景 | 推荐组件 | 宽度预设 (const.js) |
|------|----------|---------------------|
| 简单确认/少字段编辑 (≤5字段) | `Dialog` | `minDialog: 500` |
| 标准编辑/新增 (5-15字段) | `Dialog` | `MediumDialog: 800` |
| 复杂表单/详情展示/多Tab | `Drawer` | `MediumDialog: 800` / `LargeDialog: 1000` (待定义) |
| 移动端/侧边栏 | `Drawer` | `direction="rtl"`, 宽度 320-480px |

---

## 5. 反馈与提示规范

### 5.1 消息提示 (ElMessage / ElNotification)

```javascript
import { ElMessage, ElNotification } from 'element-plus'

// 成功 - 默认使用 ElMessage
ElMessage.success('操作成功')

// 错误 - ElMessage
ElMessage.error('操作失败：网络异常')

// 警告 - ElMessage
ElMessage.warning('请先选择数据')

// 信息 - ElMessage
ElMessage.info('数据已同步')

// 重要/持久通知 - ElNotification (右上角，不自动消失或长停留)
ElNotification({
  title: '导入完成',
  message: '成功导入 100 条，失败 2 条',
  type: 'success',
  duration: 5000,
  position: 'top-right'
})

// 确认框 - ElMessageBox
import { ElMessageBox } from 'element-plus'
ElMessageBox.confirm('确定删除选中数据？', '警告', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning',
  distinguishCancelAndClose: true
}).then(() => {
  // 确认逻辑
}).catch(() => {})
```

### 5.2 Loading 状态

```vue
<!-- 表格加载 -->
<Table :loading="loading" :data="tableData" :total="total" />

<!-- 按钮加载 -->
<el-button :loading="submitLoading" type="primary" @click="handleSubmit">提交</el-button>

<!-- 页面级加载 (路由切换、大数据) -->
<el-skeleton v-if="loading" animated :rows="5" />
<!-- 或 -->
<div v-if="loading" class="page-loading">
  <el-icon class="is-loading"><Loading /></el-icon>
  <span>加载中...</span>
</div>
```

---

## 6. 图标使用规范

| 场景 | 图标来源 | 使用方式 |
|------|----------|----------|
| **菜单/导航/标题** | `@element-plus/icons-vue` | `<el-icon><Location /></el-icon>` |
| **按钮/工具栏/操作列** | `@element-plus/icons-vue` | `<el-button><el-icon><Edit /></el-icon></el-button>` |
| **表单前缀/后缀** | `@element-plus/icons-vue` | `<el-input prefix-icon="Search" />` |
| **状态/标签装饰** | `@element-plus/icons-vue` | `<el-tag><el-icon><Check /></el-icon> 通过</el-tag>` |
| **业务自定义图标** | `src/assets/icons/` (SVG) | `<svg-icon name="custom-icon" />` (需封装 SvgIcon 组件) |

**常用图标映射表** (语义化选用)：
| 语义 | 图标名 | 备选 |
|------|--------|------|
| 查看/详情 | `View`, `ZoomIn` | `MagnifyingGlass` |
| 编辑/修改 | `Edit`, `EditPen` | `Pencil` |
| 删除/移除 | `Delete`, `Trash` | `Remove` |
| 新增/创建 | `Plus`, `Add` | `CirclePlus` |
| 搜索/查询 | `Search` | `MagnifyingGlass` |
| 重置/刷新 | `Refresh`, `RefreshLeft` | `Reload` |
| 导出/下载 | `Download`, `ArrowDown` | `Export` |
| 导入/上传 | `Upload`, `ArrowUp` | `Import` |
| 设置/配置 | `Setting`, `Tools` | `Cpu` |
| 权限/角色 | `User`, `Avatar`, `Key` | `Lock` |
| 日志/记录 | `Document`, `List`, `Clock` | `History` |
| 折叠/展开 | `Fold`, `Expand` | `ArrowLeft/Right` |
| 全屏/退出全屏 | `FullScreen`, `ExitFullScreen` | `Maximize/Minimize` |
| 复制 | `CopyDocument`, `Clipboard` | `DocumentCopy` |
| 打印 | `Printer` | `Print` |
| 分享 | `Share`, `Connection` | `Link` |
| 收藏/星标 | `StarFilled`, `Collect` | `Heart` |
| 通知/消息 | `BellFilled`, `Message` | `Notification` |
| 帮助/文档 | `QuestionFilled`, `InfoFilled` | `Help` |

---

## 7. 响应式断点与容器适配

```less
// 统一断点变量 (Less/Scss 通用)
@screen-xs: 480px;
@screen-sm: 768px;
@screen-md: 992px;
@screen-lg: 1200px;
@screen-xl: 1920px;

// 容器最大宽度
@container-max: 1440px;

// 组件内响应式示例
.list-layout {
  @media (max-width: @screen-md) {
    padding: 0.5em;
    .content_bg { padding: 0.5em; }
    
    /* 表格横向滚动 */
    .table-container { overflow-x: auto; }
    
    /* 表单堆叠 */
    .query-form { display: block; }
    .query-form .el-form-item { margin-bottom: 12px; }
  }
}
```

| 设备类别 | 断点范围 | 适配策略 |
|----------|----------|----------|
| 手机 | `< 768px` | 侧边栏抽屉化、表格横向滚动、表单堆叠、弹窗全屏 |
| 平板 | `768px - 992px` | 导航可折叠、表格精简列、弹窗宽度 90vw |
| 桌面标准 | `992px - 1440px` | 标准布局、容器居中 max-width 1440px |
| 大屏/宽屏 | `> 1440px` | 容器居中、表格列自适应拉伸、多栏布局 |

---

## 8. 主题与样式定制

### 8.1 Element Plus 主题变量覆盖

```less
// src/style.css 或单独 theme.less 引入
@import 'element-plus/theme-chalk/src/index.scss'; // 或 less 版本

// 覆盖核心变量 (按需，避免全量覆盖)
:root {
  // 主色调 (品牌色)
  --el-color-primary: #165DFF;
  --el-color-primary-light-3: #4C84FF;
  --el-color-primary-light-5: #7F9FFF;
  --el-color-primary-light-7: #B3C8FF;
  --el-color-primary-light-9: #E6EEFF;
  --el-color-primary-dark-2: #124CD9;
  
  // 成功/警告/危险/信息
  --el-color-success: #28A745;
  --el-color-warning: #FF8C00;
  --el-color-danger: #DC3545;
  --el-color-info: #165DFF;
  
  // 字体
  --el-font-size-base: 14px;
  --el-font-size-small: 12px;
  --el-font-size-large: 16px;
  
  // 圆角
  --el-border-radius-base: 4px;
  --el-border-radius-small: 2px;
  --el-border-radius-round: 20px;
  
  // 阴影
  --el-box-shadow-light: 0 1px 4px rgba(0,0,0,0.08);
  --el-box-shadow-base: 0 2px 8px rgba(0,0,0,0.1);
  --el-box-shadow-heavy: 0 4px 16px rgba(0,0,0,0.12);
}
```

### 8.2 项目级通用样式类

```less
// src/style.css 末尾追加

/* 页面容器通用间距 */
.page-container { padding: 24px; }
.page-section { margin-bottom: 24px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #303133; }

/* 表单标签对齐 */
.form-label { text-align: right; padding-right: 12px; }

/* 表格工具栏 */
.table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.toolbar-left { display: flex; gap: 12px; }
.toolbar-right { display: flex; gap: 8px; }

/* 空状态 */
.empty-state { 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  height: 200px; color: #909399; 
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }
}

/* 文本溢出省略 */
.text-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-ellipsis-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* 间距工具类 */
.mt-8 { margin-top: 8px; } .mt-16 { margin-top: 16px; } .mt-24 { margin-top: 24px; }
.mb-8 { margin-bottom: 8px; } .mb-16 { margin-bottom: 16px; } .mb-24 { margin-bottom: 24px; }
.ml-8 { margin-left: 8px; } .mr-8 { margin-right: 8px; }

/* Flex 工具类 */
.flex { display: flex; }
.flex-1 { flex: 1; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-wrap { flex-wrap: wrap; }
.gap-8 { gap: 8px; } .gap-12 { gap: 12px; } .gap-16 { gap: 16px; }

/* 隐藏滚动条 */
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
```

---

## 9. 无障碍 (a11y) 基础要求

| 要求 | 实现方式 |
|------|----------|
| **语义化 HTML** | 正确使用 `header/main/aside/nav/section/article/footer`，`button` 而非 `div` 承载点击 |
| **键盘可达** | 所有交互元素可 Tab 聚焦，`Enter/Space` 触发，Esc 关闭弹窗 |
| **焦点可见** | 不移除 `outline`，自定义 `:focus-visible` 样式 |
| **ARIA 属性** | `el-dialog`/`el-drawer` 已内置，自定义组件补充 `aria-label`/`aria-describedby` |
| **颜色对比度** | 文字与背景对比度 ≥ 4.5:1 (正常文本)，≥ 3:1 (大号文本) |
| **表单标签** | `el-form-item label` 关联 `prop`，或显式 `<label for="input-id">` |
| **图片替代文本** | 所有 `img` 必须有 `alt`，装饰性图标 `alt=""` 或 `role="img" aria-hidden="true"` |

---

## 10. UI 规范检查清单 (Code Review 核对)

- [ ] 页面使用标准 `Layout` + `ListLayout` + `Table` 组合
- [ ] 无直接使用 `el-table`/`el-pagination`/`el-dialog`/`el-drawer` (除非经确认)
- [ ] 按钮类型/尺寸/图标符合规范表
- [ ] 表格列宽度合理，操作列 `fixed:right`，状态列用 `el-tag`
- [ ] 表单控件选择符合指南，`label-width` 统一，必填项有红星
- [ ] 消息提示用 `ElMessage`，重要通知用 `ElNotification`，确认用 `ElMessageBox`
- [ ] 图标均来自 `@element-plus/icons-vue`，语义化选用
- [ ] 响应式断点适配，无横向滚动条 (除表格区域)
- [ ] 主题变量覆盖最小化，无硬编码颜色值
- [ ] 通用工具类复用，无重复自定义样式
- [ ] 基础 a11y: 语义标签、键盘可达、焦点可见、表单关联

---

## 11. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：UI组件复用规则、布局模式、Element Plus约束、反馈规范、图标映射、响应式、主题、a11y |

---

> **执行建议**：新增业务页面开发时，优先复制 `ENTERPRISE_DEVELOPMENT_GUIDE.md` 第 9 章脚手架模板，再按本文档规范微调。组件库扩展需走架构组评审流程。