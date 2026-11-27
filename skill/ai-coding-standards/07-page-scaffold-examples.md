# 07 页面脚手架示例

> 版本: v1.0
> 最后更新: 2026-11-19
> 维护: 前端架构组
> 用途: **直接复制修改**，新建页面最快起步模板

---

## 1. 标准列表页 (查询 + 表格 + 分页) — **最常用模板**

### 适用场景
接口管理、数据源管理、用户管理、角色管理、字典管理、日志查询、任务列表等

### 完整代码模板

```vue
<!-- views/{domain}/index.vue -->
<!--
  @file {Domain}Manage.vue
  @description {业务名称}管理列表页 - 查询、新增、编辑、删除、导入导出、状态切换
  @author 前端架构组
  @created 2026-11-19
  @version 1.0
-->

<script setup lang="ts">
/* ========== 1. 导入与类型 ========== */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 组件 (优先复用现有)
import ListLayout from '@/components/list-layout/index.vue'
import ListForm from '@/components/list-form/index.vue'  // 待创建，暂用内联
import Table from '@/components/table/index.vue'
import Dialog from '@/components/dialog/index.vue'
import Pagination from '@/components/pagination/index.vue'

// 类型
import type { {Domain}ListItem, {Domain}QueryParams, {Domain}FormData } from '@/types/{domain}'
import type { PageResult } from '@/types/common'

// API
import { 
  get{Domain}List, 
  create{Domain}, 
  update{Domain}, 
  delete{Domain}, 
  batchDelete{Domain},
  toggle{Domain}Status,
  export{Domain}
} from '@/api/{domain}'

// 常量
import { MediumDialog } from '@/config/const'

// 工具
import { formatDateTime } from '@/utils/date'

/* ========== 2. Props/Emits (页面组件通常无) ========== */

/* ========== 3. 响应式状态 ========== */
// 路由
const router = useRouter()

// 表格数据
const tableData = ref<{Domain}ListItem[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

// 查询表单
const queryForm = reactive<{Domain}QueryParams>({
  pageNum: 1,
  pageSize: 10,
  // 业务查询字段...
  name: '',
  status: ''
})

// 分页 (Table 组件内部维护，页面同步用)
const pageData = ref({ pageNum: 1, pageSize: 10 })

// 选择
const multipleSelection = ref<{Domain}ListItem[]>([])
const selectable = (row: {Domain}ListItem) => !row.disabled  // 业务决定可选性

// 编辑/新增弹窗
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('新增')
const editForm = reactive<{Domain}FormData>({
  // 表单字段初始值...
  name: '',
  code: '',
  status: '1'
})
let editId: string | null = null

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
}

/* ========== 4. 计算属性 ========== */
const hasSelection = computed(() => multipleSelection.value.length > 0)
const statusOptions = computed(() => [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
])

/* ========== 5. 方法定义 ========== */
// ----- 数据获取 -----
const fetchList = async () => {
  loading.value = true
  try {
    const params = { ...pageData.value, ...queryForm }
    const res = await get{Domain}List(params)
    tableData.value = res.list || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取列表失败', error)
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// ----- 查询/重置 -----
const handleSearch = () => {
  pageData.value.pageNum = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(queryForm, { name: '', status: '' })
  pageData.value.pageNum = 1
  fetchList()
}

// ----- 分页 -----
const handlePageChange = (val: { pageNum: number; pageSize: number }) => {
  pageData.value = val
  fetchList()
}

// ----- 选择 -----
const handleSelectionChange = (val: {Domain}ListItem[]) => {
  multipleSelection.value = val
}

// ----- 新增 -----
const handleAdd = () => {
  editId = null
  dialogTitle.value = '新增'
  Object.assign(editForm, { name: '', code: '', status: '1' })
  dialogVisible.value = true
}

// ----- 编辑 -----
const handleEdit = (row: {Domain}ListItem) => {
  editId = row.id
  dialogTitle.value = '编辑'
  Object.assign(editForm, { ...row })
  dialogVisible.value = true
}

// ----- 详情 (可选) -----
const handleView = (row: {Domain}ListItem) => {
  router.push({ path: `/{domain}/detail`, query: { id: row.id } })
}

// ----- 删除 (单个) -----
const handleDelete = async (row: {Domain}ListItem) => {
  try {
    await ElMessageBox.confirm('确定删除该记录？', '提示', { type: 'warning', distinguishCancelAndClose: true })
    await delete{Domain}(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // 用户取消或失败
  }
}

// ----- 批量删除 -----
const handleBatchDelete = async () => {
  if (!hasSelection.value) return
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${multipleSelection.value.length} 条记录？`, '提示', { type: 'warning' })
    const ids = multipleSelection.value.map(item => item.id)
    await batchDelete{Domain}(ids)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    // 用户取消或失败
  }
}

// ----- 状态切换 -----
const handleStatusChange = async (row: {Domain}ListItem, newStatus: '1' | '0') => {
  try {
    const action = newStatus === '1' ? '启用' : '禁用'
    await ElMessageBox.confirm(`确定${action}该记录？`, '提示', { type: 'warning' })
    await toggle{Domain}Status(row.id, newStatus)
    ElMessage.success(`${action}成功`)
    fetchList()
  } catch {
    // 失败时行内 switch 会自动回滚，或手动刷新
    fetchList()
  }
}

// ----- 导出 -----
const handleExport = async () => {
  try {
    loading.value = true
    const blob = await export{Domain}({ ...queryForm })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `{业务名称}_${Date.now()}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}

// ----- 弹窗确认 -----
const handleDialogSure = async () => {
  try {
    // 表单校验 (需 ref)
    // await formRef.value.validate()
    
    if (editId) {
      await update{Domain}(editId, { ...editForm })
      ElMessage.success('更新成功')
    } else {
      await create{Domain}({ ...editForm })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (error) {
    console.error('保存失败', error)
  }
}

const handleDialogCancel = () => {
  dialogVisible.value = false
}

/* ========== 6. 监听与生命周期 ========== */
onMounted(() => {
  fetchList()
})

/* ========== 7. 暴露 (可选) ========== */
defineExpose({
  refresh: fetchList,
  getSelectedRows: () => multipleSelection.value
})
</script>

<template>
  <div class="{domain}-manage">
    <!-- 页面标题与工具栏 -->
    <div class="page-header">
      <h2 class="page-title">{业务名称}管理</h2>
      <div class="page-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新增
        </el-button>
        <el-button v-if="hasSelection" type="danger" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon> 批量删除
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon> 导出
        </el-button>
      </div>
    </div>

    <!-- 查询表单区域 -->
    <el-form :model="queryForm" :inline="true" size="small" class="query-form">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入名称" clearable style="width: 220px" />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryForm.status" placeholder="请选择" clearable style="width: 180px">
          <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
      
      <!-- 更多查询字段... -->
      
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
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      
      <el-table-column prop="name" label="名称" width="220" show-overflow-tooltip />
      <el-table-column prop="code" label="编码" width="180" />
      
      <!-- 状态列：el-tag 渲染 -->
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.status === '1' ? 'success' : 'danger'" 
            effect="light"
            @click.stop="handleStatusChange(scope.row, scope.row.status === '1' ? '0' : '1')"
          >
            {{ scope.row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      
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
      <el-form :model="editForm" :rules="formRules" label-width="120px" ref="formRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入名称" :disabled="!!editId" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="editForm.code" placeholder="请输入编码" :disabled="!!editId" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 更多表单字段... -->
      </el-form>
    </Dialog>
  </div>
</template>

<style scoped lang="less">
.{domain}-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  
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
  
  .table-container {
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }
  
  @media (max-width: 992px) {
    .query-form { .el-form-item { margin-bottom: 12px; } }
    .table-container { overflow-x: auto; }
  }
}
</style>
```

---

## 2. 标准详情页 (只读展示)

### 适用场景
查看接口详情、用户详情、订单详情、日志详情、配置详情等

### 完整代码模板

```vue
<!-- views/{domain}/detail.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Table from '@/components/table/index.vue'
import { formatDateTime } from '@/utils/date'
import { get{Domain}Detail } from '@/api/{domain}'
import type { {Domain}Detail } from '@/types/{domain}'

const route = useRoute()
const router = useRouter()

const detailData = ref<{Domain}Detail | null>(null)
const loading = ref(false)
const activeTab = ref('basic')

const tabs = [
  { name: 'basic', label: '基础信息' },
  { name: 'config', label: '配置详情' },
  { name: 'logs', label: '操作日志' }
]

const fetchDetail = async () => {
  const id = route.query.id as string
  if (!id) return
  loading.value = true
  try {
    const res = await get{Domain}Detail(id)
    detailData.value = res
  } catch (error) {
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()

onMounted(() => fetchDetail())
</script>

<template>
  <div class="{domain}-detail">
    <!-- 头部 -->
    <div class="detail-header">
      <h2>{{ detailData?.name || '详情' }}</h2>
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon> 返回列表
      </el-button>
    </div>

    <el-tabs v-model="activeTab" v-if="detailData">
      <!-- 基础信息 -->
      <el-tab-pane :label="tabs[0].label" :name="tabs[0].name">
        <el-descriptions :column="2" border title="基础信息">
          <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
          <el-descriptions-item label="名称">{{ detailData.name }}</el-descriptions-item>
          <el-descriptions-item label="编码">{{ detailData.code }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detailData.status === '1' ? 'success' : 'danger'" effect="light">
              {{ detailData.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDateTime(detailData.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDateTime(detailData.updateTime) }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <!-- 配置详情 (示例) -->
      <el-tab-pane :label="tabs[1].label" :name="tabs[1].name">
        <el-descriptions :column="2" border title="配置详情">
          <!-- 业务配置字段... -->
        </el-descriptions>
      </el-tab-pane>

      <!-- 操作日志 -->
      <el-tab-pane :label="tabs[2].label" :name="tabs[2].name">
        <Table
          :data="detailData.logs || []"
          :total="0"
        >
          <el-table-column prop="operator" label="操作人" width="120" />
          <el-table-column prop="action" label="操作" width="120" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="createTime" label="操作时间" width="180">
            <template #default="scope">
              {{ formatDateTime(scope.row.createTime) }}
            </template>
          </el-table-column>
        </Table>
      </el-tab-pane>
    </el-tabs>

    <div v-else class="empty-state">
      <el-icon class="empty-icon"><Document /></el-icon>
      <p class="empty-text">暂无详情数据</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.{domain}-detail {
  padding: 24px;
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e7ed;
    
    h2 { font-size: 20px; font-weight: 600; color: #303133; margin: 0; }
  }
  
  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 300px; color: #909399;
    .empty-icon { font-size: 48px; margin-bottom: 12px; }
  }
}
</style>
```

---

## 3. 标准编辑/新增页 (表单校验 + 保存)

### 适用场景
复杂表单、多步骤向导、独立编辑页、详情页内嵌编辑等

### 完整代码模板

```vue
<!-- views/{domain}/form.vue -->
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { get{Domain}Detail, create{Domain}, update{Domain} } from '@/api/{domain}'
import type { {Domain}FormData } from '@/types/{domain}'

const route = useRoute()
const router = useRouter()
const formRef = ref()

// 路由参数判断新增/编辑
const isEdit = computed(() => !!route.query.id)
const pageTitle = computed(() => isEdit.value ? '编辑' : '新增')

// 表单数据
const formData = reactive<{Domain}FormData>({
  name: '',
  code: '',
  status: '1'
  // 更多字段...
})

// 校验规则
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 表单标签宽度
const labelWidth = '120px'

const fetchDetail = async () => {
  if (!isEdit.value) return
  try {
    const res = await get{Domain}Detail(route.query.id as string)
    Object.assign(formData, res)
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      await update{Domain}(route.query.id as string, { ...formData })
      ElMessage.success('更新成功')
    } else {
      await create{Domain}({ ...formData })
      ElMessage.success('创建成功')
    }
    router.back()
  } catch (error) {
    // 校验失败或 API 失败
  }
}

const handleCancel = () => {
  if (isEdit.value) {
    router.back()
  } else {
    // 新增页取消可清空表单或返回
    router.back()
  }
}

onMounted(() => fetchDetail())
</script>

<template>
  <div class="{domain}-form">
    <div class="form-header">
      <h2>{{ pageTitle }}{业务名称}</h2>
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
</template>

<style scoped lang="less">
.{domain}-form {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  
  .form-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e4e7ed;
    h2 { font-size: 20px; font-weight: 600; color: #303133; margin: 0; }
  }
  
  .form-content { margin-top: 24px; }
}
</style>
```

---

## 4. 多步骤向导页 (参考 task-create)

### 适用场景
任务创建向导、配置向导、数据导入向导、权限申请流程等

### 核心结构

```vue
<!-- views/{domain}/wizard.vue -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 步骤配置
const steps = [
  { title: '基础配置', key: 'basic' },
  { title: '数据源选择', key: 'datasource' },
  { title: '字段映射', key: 'mapping' },
  { title: '高级设置', key: 'advanced' },
  { title: '预览确认', key: 'preview' }
]

const activeStep = ref(0)
const currentStepKey = computed(() => steps[activeStep.value].key)

// 各步骤表单数据 (集中管理)
const formData = reactive({
  basic: { name: '', type: '', cron: '', priority: 'normal' },
  datasource: { sourceId: '', targetId: '', tableMap: [] },
  mapping: { fields: [], transforms: [] },
  advanced: { incrementalField: '', watermarkField: '', retry: 3, alert: [] },
  preview: { sql: '', estimatedRows: 0, testPassed: false }
})

// 各步骤校验规则
const stepRules = {
  basic: { name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }] },
  datasource: { sourceId: [{ required: true, message: '请选择源数据源', trigger: 'change' }] },
  // ...
}

const nextStep = () => {
  const form = formRefs.value[activeStep.value]
  form.validate().then(() => activeStep.value++).catch(() => {})
}

const prevStep = () => { activeStep.value-- }

const submitForm = async () => {
  // 汇总所有步骤数据
  const payload = { ...formData.basic, ...formData.datasource, ...formData.mapping, ...formData.advanced }
  // 提交创建
  await createTask(payload)
  ElMessage.success('创建成功')
  router.push('/task-list')
}

const saveDraft = () => {
  localStorage.setItem('taskDraft', JSON.stringify(formData))
  ElMessage.success('草稿已保存')
}

// 恢复草稿
onMounted(() => {
  const draft = localStorage.getItem('taskDraft')
  if (draft) Object.assign(formData, JSON.parse(draft))
})
</script>

<template>
  <div class="{domain}-wizard">
    <el-steps :active="activeStep" finish-status="success" :space="20">
      <el-step v-for="step in steps" :key="step.key" :title="step.title" />
    </el-steps>

    <div class="wizard-content">
      <!-- 步骤 1: 基础配置 -->
      <div v-show="currentStepKey === 'basic'">
        <el-form ref="formRefs.basic" :model="formData.basic" :rules="stepRules.basic" label-width="140px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="formData.basic.name" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="同步类型" prop="type">
            <el-select v-model="formData.basic.type" placeholder="请选择">
              <el-option label="全量同步" value="full" />
              <el-option label="增量同步" value="incremental" />
            </el-select>
          </el-form-item>
          <!-- 更多字段... -->
        </el-form>
      </div>

      <!-- 步骤 2-5 类似... -->
      
      <!-- 底部操作栏 -->
      <div class="wizard-footer">
        <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
        <el-button v-if="activeStep < steps.length - 1" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="activeStep === steps.length - 1" type="primary" @click="submitForm">提交创建</el-button>
        <el-button @click="saveDraft">保存草稿</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.{domain}-wizard {
  padding: 24px; max-width: 1000px; margin: 0 auto;
  .wizard-content { margin-top: 32px; }
  .wizard-footer {
    display: flex; justify-content: flex-end; gap: 12px;
    margin-top: 32px; padding-top: 24px; border-top: 1px solid #e4e7ed;
  }
}
</style>
```

---

## 5. 登录页 (独立布局)

```vue
<!-- views/login/index.vue -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'

const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loading = ref(false)

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    await login(loginForm)
    ElMessage.success('登录成功')
    router.push('/')
  } catch {
    // 校验失败或登录失败
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>系统名称</h1>
        <p>企业级管理后台</p>
      </div>
      
      <el-form ref="formRef" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名" 
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            placeholder="密码" 
            prefix-icon="Lock"
            show-password
            type="password"
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            block 
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .login-box {
    width: 400px;
    padding: 48px 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    
    .login-header {
      text-align: center; margin-bottom: 32px;
      h1 { font-size: 28px; font-weight: 700; color: #303133; margin: 0 0 8px; }
      p { color: #909399; margin: 0; }
    }
    
    .login-form { margin-top: 8px; }
  }
}
</style>
```

---

## 6. 组件创建检查清单 (使用模板前核对)

| 检查项 | 列表页 | 详情页 | 编辑页 | 向导页 | 登录页 |
|--------|--------|--------|--------|--------|--------|
| 复用 ListLayout + Table + Pagination | ✅ | - | - | - | - |
| 复用 Dialog/Drawer 封装 | ✅ | - | - | - | - |
| API 按 CRUD 标准命名 | ✅ | ✅ | ✅ | ✅ | ✅ |
| TypeScript 类型完整 (Props/Emits/Refs) | ✅ | ✅ | ✅ | ✅ | ✅ |
| JSDoc 注释 (文件头/组件/方法) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 命名符合 02-naming.md | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loading/空/错状态全覆盖 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 响应式断点适配 | ✅ | ✅ | ✅ | ✅ | - |
| 表单校验规则完整 | ✅ | - | ✅ | ✅ | ✅ |
| 权限控制 (v-permission) | ✅ | ✅ | ✅ | ✅ | - |
| 路由 meta 配置完整 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 7. 变更记录

| 版本 | 日期 | 变更人 | 变更内容 |
|------|------|--------|----------|
| v1.0 | 2026-11-19 | 前端架构组 | 初版：列表页/详情页/编辑页/向导页/登录页 5大标准模板 |

---

> **使用方式**：新建页面时，直接复制对应模板到 `views/{domain}/index.vue`，按注释替换 `{domain}`、`{Domain}`、`{业务名称}` 等占位符，补全业务字段、API 调用、校验规则即可。模板已内嵌所有规范要求（组件复用、命名、类型、注释、UI约束）。