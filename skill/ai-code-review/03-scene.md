# 03 场景及模板审查规范

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 适用: Code Review 时针对典型业务场景的专项核对标准

---

## 1. 标准列表页 (查询 + 表格 + 分页) — 占比 60%+

### 1.1 必须复用的组件组合

| 组件 | 路径 | 核对要点 |
|------|------|----------|
| **ListLayout** | `src/components/list-layout/index.vue` | flex:column、.table-container{flex:1,overflow:hidden} |
| **ListForm** | `src/components/list-form/index.vue` (待创建，现内联) | inline、size="small"、查询/重置按钮、折叠展开 |
| **Table** | `src/components/table/index.vue` | 固定高度、内置分页、表头样式、选择列标准化 |
| **Pagination** | `src/components/pagination/index.vue` (Table 内置) | 页码/页大小/跳转、@page-data-change |

### 1.2 页面结构标准模板核对

```vue
<ListLayout>
  <!-- 1. 页面标题 (可选) -->
  <div class="list_title">业务模块名称</div>
  
  <!-- 2. 查询表单区域 -->
  <el-form :model="queryForm" :inline="true" size="small" class="query-form">
    <el-form-item label="字段名" prop="fieldName">
      <el-input v-model="queryForm.fieldName" placeholder="请输入" clearable style="width: 220px" />
    </el-form-item>
    <!-- 更多查询字段... -->
    <el-form-item>
      <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
      <el-button @click="handleReset"><el-icon><Refresh /></el-icon> 重置</el-button>
    </el-form-item>
  </el-form>
  
  <!-- 3. 表格区域 -->
  <Table
    :data="tableData"
    :total="total"
    :loading="loading"
    @selection-change="handleSelectionChange"
    @page-change="handlePageChange"
  >
    <el-table-column type="selection" :selectable="selectable" width="55" />
    <el-table-column prop="name" label="名称" width="220" show-overflow-tooltip />
    <!-- 业务列... -->
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
</ListLayout>

<!-- 4. 编辑/新增弹窗 -->
<Dialog v-model="dialogVisible" :width="MediumDialog" :title="dialogTitle" @sure="handleDialogSure" @cancel="handleDialogCancel">
  <el-form :model="editForm" :rules="formRules" label-width="120px" ref="formRef">
    <!-- 表单字段... -->
  </el-form>
</Dialog>
```

### 1.3 列表页 Review 核对清单

| 类别 | 检查项 | 标准 |
|------|--------|------|
| **布局** | 使用 ListLayout + Table 组合 | 无手写 flex/grid 布局表格区域 |
| **查询表单** | inline + size="small"、明确 label/prop、clearable、宽度固定 | 无默认宽度、无缺失 prop |
| **表格列** | 选择列固定 55px、业务列 show-overflow-tooltip、状态列 el-tag、时间列格式化 | 无溢出隐藏、无硬编码状态文本 |
| **操作列** | fixed:right、宽度按按钮数计算、按钮 type="text" size="small"、el-divider 分隔 | 无 fixed 缺失、无 default 尺寸按钮 |
| **分页** | Table 内置 Pagination、@page-change 同步 pageData | 无外层手动放置 Pagination |
| **选择** | type="selection" + selectable 函数、multipleSelection 同步 | 无 selectable、无选择同步 |
| **弹窗** | Dialog 组件、width 从 const.js 导入、el-form + rules + ref | 无直接用 el-dialog、无表单校验 |
| **状态管理** | tableData/total/loading/queryForm/pageData/multipleSelection 全部定义 | 无遗漏响应式变量 |
| **方法完整** | fetchList/handleSearch/handleReset/handlePageChange/handleSelectionChange/handleAdd/handleEdit/handleDelete/handleBatchDelete/handleStatusChange/handleExport/handleDialogSure/handleDialogCancel | 无缺失核心方法 |
| **Loading 覆盖** | 列表加载/表单提交/删除/导出/状态切换全有 Loading | 无 Loading 缺失场景 |
| **错误处理** | 统一 handleApiCall 封装、用户有感知反馈 | 无裸 try-catch、无静默失败 |
| **权限控制** | 新增/编辑/删除/导出/状态切换按钮 v-permission | 无权限指令 |
| **响应式** | 查询表单折叠、表格横向滚动、断点适配 | 无横向溢出、移动端不可用 |

---

## 2. 标准详情页 (只读展示) — 占比 15%

### 2.1 页面结构标准模板核对

```vue
<div class="{domain}-detail">
  <!-- 头部 -->
  <div class="detail-header">
    <h2>{{ detailData?.name || '详情' }}</h2>
    <el-button @click="goBack"><el-icon><ArrowLeft /></el-icon> 返回列表</el-button>
  </div>

  <el-tabs v-model="activeTab" v-if="detailData">
    <!-- 基础信息 -->
    <el-tab-pane label="基础信息" name="basic">
      <el-descriptions :column="2" border title="基础信息">
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status==='1'?'success':'danger'" effect="light">
            {{ detailData.status==='1'?'启用':'禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(detailData.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>

    <!-- 关联数据 Tab (可选) -->
    <el-tab-pane label="关联数据" name="relations">
      <Table :data="detailData.relations || []" :total="0">
        <el-table-column prop="name" label="名称" />
        <!-- 更多列... -->
      </Table>
    </el-tab-pane>
  </el-tabs>

  <div v-else class="empty-state">暂无详情数据</div>
</div>
```

### 2.2 详情页 Review 核对清单

| 检查项 | 标准 |
|--------|------|
| **路由参数** | `route.query.id` 获取、校验存在性、不存在跳回列表 |
| **数据获取** | onMounted 调用 getDetail API、loading 状态、错误兜底 |
| **基础信息** | el-descriptions 2列 border、所有字段覆盖、状态用 el-tag、时间格式化、空值显示 '-' |
| **关联数据** | 复用 Table 组件、无数据空状态友好提示 |
| **Tab 页签** | 语义化命名、懒加载或按需获取关联数据 |
| **返回导航** | 返回列表按钮、router.back() 或 router.push('/list') |
| **空状态** | v-else 空状态友好展示、图标+文字 |
| **权限控制** | 编辑/删除/操作按钮 v-permission |

---

## 3. 标准编辑/新增页 (表单校验 + 保存) — 占比 20%

### 3.1 页面结构标准模板核对

```vue
<div class="{domain}-form">
  <div class="form-header">
    <h2>{{ isEdit ? '编辑' : '新增' }}{业务名称}</h2>
    <el-button @click="handleCancel">返回</el-button>
  </div>

  <el-form ref="formRef" :model="formData" :rules="rules" :label-width="labelWidth" class="form-content">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入名称" :disabled="isEdit" />
    </el-form-item>
    <el-form-item label="编码" prop="code">
      <el-input v-model="formData.code" placeholder="请输入编码" :disabled="isEdit" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="formData.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 更多字段... -->
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</div>
```

### 3.2 编辑/新增页 Review 核对清单

| 检查项 | 标准 |
|--------|------|
| **新增/编辑判断** | `isEdit = computed(() => !!route.query.id)`、页面标题动态 |
| **数据回显** | 编辑模式 onMounted 调用 getDetail、Object.assign(formData, res) |
| **表单校验** | rules 完整覆盖必填/格式/长度/业务规则、trigger 区分 blur/change |
| **字段禁用** | 编辑模式主键字段 (id/code) disabled、其余可编辑 |
| **表单引用** | `ref="formRef"`、提交前 `await formRef.validate()` |
| **提交逻辑** | isEdit ? updateXxx(id, formData) : createXxx(formData)、成功提示、router.back() |
| **取消逻辑** | router.back()、新增页可选清空表单 |
| **Loading 状态** | 提交按钮 :loading="submitting"、防重复提交 |
| **错误处理** | 校验失败不提交、API 失败 catch 不跳转、保持表单数据 |
| **权限控制** | 页面级权限 (路由 meta.roles)、字段级权限 (v-if/v-show) |

---

## 4. 多步骤向导页 (参考 task-create)

### 4.1 核心结构核对

```vue
<div class="{domain}-wizard">
  <el-steps :active="activeStep" finish-status="success">
    <el-step v-for="step in steps" :key="step.key" :title="step.title" />
  </el-steps>

  <div class="wizard-content">
    <!-- 步骤 1 -->
    <div v-show="activeStep === 0">
      <el-form ref="formRefs.basic" :model="formData.basic" :rules="stepRules.basic" label-width="140px">
        <!-- 步骤字段... -->
      </el-form>
    </div>
    <!-- 步骤 2-N 类似... -->
    
    <div class="wizard-footer">
      <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
      <el-button v-if="activeStep < steps.length - 1" type="primary" @click="nextStep">下一步</el-button>
      <el-button v-if="activeStep === steps.length - 1" type="primary" @click="submitForm">提交创建</el-button>
      <el-button @click="saveDraft">保存草稿</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</div>
```

### 4.2 向导页 Review 核对清单

| 检查项 | 标准 |
|--------|------|
| **步骤配置** | steps 数组含 title/key、activeStep 受控、当前步骤 key 计算属性 |
| **数据集中** | formData 对象按步骤分组 (basic/datasource/mapping/...) |
| **分步校验** | 每步独立 rules、nextStep 前 validate 当前步骤 formRef |
| **上一步/下一步** | prevStep/nextStep 切换 activeStep、校验通过才能下一步 |
| **草稿保存** | localStorage 自动保存/恢复、saveDraft 手动保存、刷新恢复 |
| **最终提交** | 汇总所有步骤数据、调用创建 API、成功跳转列表 |
| **组件复用** | StepForm 通用步骤容器、FormInfo 等业务组件复用 |
| **Hooks 抽离** | useTaskCreate 等业务逻辑封装在 hooks/ 中 |

---

## 5. 登录页 (独立布局)

### 5.1 核心结构核对

```vue
<div class="login-container">
  <div class="login-box">
    <div class="login-header">
      <h1>系统名称</h1>
      <p>企业级管理后台</p>
    </div>
    <el-form ref="formRef" :model="loginForm" :rules="rules" class="login-form">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="密码" prefix-icon="Lock" show-password type="password" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" block @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
```

### 5.2 登录页 Review 核对清单

| 检查项 | 标准 |
|--------|------|
| **独立布局** | 无 Layout/Navs、全屏居中、背景渐变/品牌色 |
| **表单校验** | 用户名/密码必填、规则完整 |
| **密码可见** | show-password 切换、type="password" |
| **记住我** | checkbox 绑定、登录成功后处理 (localStorage/cookie) |
| **Loading 防重复** | 登录按钮 :loading、block 全宽 |
| **成功跳转** | 登录成功 router.push('/') 或重定向原页面 |
| **错误处理** | 账号/密码错误提示、网络错误提示、验证码 (如有) |
| **无权限访问** | 直接访问内页自动跳转登录 (路由守卫) |
| **退出登录** | emitter.on('logout') → router.push('/login') |

---

## 6. 大数据量列表页 (虚拟滚动/性能优化)

### 6.1 触发条件

- 单页数据 > 100 行
- 总数据量 > 1000 条
- 表格列数 > 15 列
- 用户反馈卡顿/滚动不流畅

### 6.2 优化方案核对

| 优化点 | 实现方式 | Review 核对 |
|--------|----------|-------------|
| **虚拟滚动** | Table 组件扩展 virtual-scroll prop 或引入 vue-virtual-scroller | 单页 500 行 60fps 滚动 |
| **分片渲染** | requestIdleCallback 分批渲染行 | 首屏渲染 < 200ms |
| **列按需渲染** | 仅渲染可视区列、隐藏列不创建 DOM | 内存占用 < 50MB |
| **防抖搜索** | 查询输入 300ms 防抖 | 无每次输入发请求 |
| **分页优化** | 服务端分页、禁止前端全量加载 | 单次请求 < 100 条 |
| **Keep-Alive** | 列表页缓存、切换保持状态 | 无重复请求、状态保持 |
| **Web Worker** | 大量数据排序/筛选/导出计算移至 Worker | 主线程不阻塞 |

---

## 7. 文件上传/下载/导入导出场景

### 7.1 文件上传核对

| 检查项 | 标准 |
|--------|------|
| **组件** | el-upload + list-type="picture-card"/"text"、action 指向上传 API |
| **校验** | before-upload 校验类型/大小/数量、超限 ElMessage 提示 |
| **进度** | on-progress 显示进度条、on-success/on-error 处理结果 |
| **文件预览** | 图片预览、文件名显示、下载/删除操作 |
| **批量上传** :multiple、文件列表管理、全量/单个上传控制 |
| **断点续传** | 大文件 (>100MB) 分片上传、Web Worker 计算 hash |

### 7.2 文件下载核对

| 检查项 | 标准 |
|--------|------|
| **API 返回** | responseType: 'blob'、后端 Content-Disposition 带文件名 |
| **下载触发** | URL.createObjectURL(blob) + a.click() + URL.revokeObjectURL() |
| **文件名** | 优先响应头 filename、次备用默认命名 `{业务}_${Date.now()}.xlsx` |
| **大文件** | 流式下载、进度提示、断点续传 (如需要) |

### 7.3 Excel 导入导出核对

| 场景 | 标准 |
|------|------|
| **导出** | 导出当前筛选条件数据、异步导出大数据量、进度提示、文件名含时间戳 |
| **导入** | 模板下载、上传预览 (前 10 行)、数据校验报错标红、确认导入、结果反馈 |
| **库选型** | xlsx (导出) + exceljs (复杂样式/导入校验) |
| **内存控制** | 流式写入、分批处理、避免全量数据驻留内存 |

---

## 8. 权限控制场景

### 8.1 按钮级权限

```vue
<!-- 标准用法 -->
<el-button v-permission="'interface:add'" @click="handleAdd">新增</el-button>
<el-button v-permission="'interface:edit'" @click="handleEdit(row)">编辑</el-button>
<el-button v-permission="'interface:delete'" @click="handleDelete(row)">删除</el-button>
<el-button v-permission="'interface:export'" @click="handleExport">导出</el-button>
```

### 8.2 页面/路由级权限

```javascript
// router/index.js
{
  path: 'interface-manage',
  name: 'interface-manage',
  meta: { 
    title: '接口管理', 
    icon: 'Location',
    roles: ['admin', 'interface_admin']  // 允许访问的角色
  },
  component: () => import('@/views/interface-manage/index.vue')
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
    next({ path: '/403' })
  } else {
    next()
  }
})
```

### 8.3 字段/数据级权限

| 场景 | 处理方式 |
|------|----------|
| **敏感字段** | 后端按权限过滤返回、前端仅渲染返回字段、不硬编码 v-if 判断角色 |
| **数据范围** | 后端按部门/归属过滤、前端无感知、仅展示返回数据 |
| **操作确认** | 危险操作 (删除/禁用/导出) 必须 ElMessageBox.confirm 二次确认 |

---

## 9. 国际化 (i18n) 场景 (预留)

### 9.1 规范预留

| 检查项 | 标准 (待实施) |
|--------|--------------|
| **硬编码中文** | 禁止模板/JS 硬编码中文、统一 `$t('key')` |
| **键名规范** | `module.page.section.field` 如 `interface.list.table.name` |
| **语言包结构** | `locales/zh-CN.ts`, `locales/en-US.ts` 模块化拆分 |
| **日期/数字** | 使用 `$d`/`$n` 格式化、无硬编码格式 |
| **复数形式** | 使用 `$tc` 处理复数、`$te` 判断键存在 |

---

## 10. 场景化 Review 快速核对表

| 场景 | 核心复用组件 | 关键 Review 点 | 红线 |
|------|-------------|---------------|------|
| **标准列表页** | ListLayout + Table + Dialog | 查询/表格/分页/弹窗/权限/Loading | 无 Table、无 Dialog、无 v-permission |
| **详情页** | el-descriptions + Table | 基础信息/Tab/关联数据/返回 | 硬编码字段、无空状态 |
| **编辑/新增页** | el-form + Dialog/Drawer | 校验/回显/提交/取消/Loading | 无校验、无 Loading、静默失败 |
| **多步骤向导** | el-steps + StepForm | 分步校验/草稿/汇总提交 | 无分步校验、无草稿恢复 |
| **登录页** | 独立布局 + el-form | 校验/密码可见/记住我/跳转 | 硬编码跳转、无错误处理 |
| **大数据列表** | Table + 虚拟滚动 | 性能指标/分片/防抖 | 单页 >100行无优化 |
| **文件上传下载** | el-upload + Blob 下载 | 校验/进度/预览/大文件 | 无类型大小校验、无进度 |
| **导入导出** | xlsx/exceljs | 模板/预览/校验/结果 | 无模板、无校验、全量内存 |
| **权限控制** | v-permission + 路由守卫 | 按钮/页面/字段/数据 | 硬编码角色、无二次确认 |

---

## 11. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：9大典型场景审查标准、核对清单、红线规则 |

---

> **执行建议**：Review 时对照本文档对应场景核对。新增场景类型需补充到本文档并同步更新 07-page-scaffold-examples.md 脚手架模板。