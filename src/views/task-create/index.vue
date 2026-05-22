<template>
  <ListLayout>
    <div class="list_title">接口服务信息</div>
    <ListForm :model="formInline">
      <el-form-item label="流程名称">
        <el-input
          v-model="formInline.user"
          placeholder="请输入流程名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button class="from-btn" type="primary" @click="getList">
          查询
        </el-button>
      </el-form-item>
    </ListForm>
    <div class="btn-box">
      <el-button :icon="Plus" type="primary" @click="openDrawer">
        新建流程
      </el-button>
    </div>
    <Table
      :data="tableData"
      :total="100"
      @selection-change="handleSelectionChange"
      @pageDataChange="pageDataChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="name" label="流程名称" width="120" />
      <el-table-column prop="state" label="流程分类" width="120" />
      <el-table-column prop="city" label="步骤数" width="320" />
      <el-table-column prop="address" label="状态" width="600" />
      <el-table-column prop="address" label="最后执行" width="600" />
      <el-table-column prop="address" label="创建时间"> </el-table-column>
      <el-table-column fixed="right" prop="address" label="操作">
        <template #default="scope">
          <el-button type="text" @click="viewDetail(scope.row)">
            详情
          </el-button>
          <el-button type="text" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="text" @click="executeTask(scope.row)">
            执行
          </el-button>
          <el-button type="text" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </Table>
  </ListLayout>
  <Drawer
    ref="dialogRef"
    v-model="drawerVisible"
    title="报文内容"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #default>
      <FormInfo v-model="formState" :disabled="formState.disabled" />
    </template>
  </Drawer>
  <Dialog
    ref="dialogRef"
    v-model="dialogVisible"
    title="执行步骤"
    :width="MediumDialog"
    @sure="handleSure"
    @cancel="handleCancelDialog"
  >
    <template #default>
      <StepForm />
    </template>
  </Dialog>
</template>

<script setup>
import ListForm from '@/components/list-form/index.vue';
import Table from '@/components/table/index.vue';
import ListLayout from '@/components/list-layout/index.vue';
import { reactive, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import Dialog from '@/components/dialog/index.vue';
import Drawer from '@/components/drawer/index.vue';
import { MediumDialog } from '@/config/const';
import FormInfo from '@/views/task-create/components/FormInfo.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import StepForm from '@/views/task-create/components/StepForm.vue';
import useStepForm from '@/views/task-create/hooks/index.js';

const { dialogVisible, handleSure, handleCancelDialog, formState } =
  useStepForm();
// 表格数据
const tableData = new Array(100).fill(null).map(() => ({
  date: '2016-05-02',
  name: '王小虎',
  state: '上海市普陀区',
  city: '金沙江路',
  address: '上海市普陀区金沙江路1518 弄',
  zip: '100000',
}));

// 查询表单
const formInline = reactive({
  user: '',
  region: '',
  date: '',
});

// 查询
const getList = (pageData) => {
  console.log('submit!', pageData);
};

// 分页
const pageDataChange = (pageData) => {
  console.log(pageData);
  getList(pageData);
};

const openDrawer = () => {
  drawerVisible.value = true;
};

// 查看详情
const viewDetail = (row) => {
  formState.value = { ...row };
  formState.value.disabled = true;
  openDrawer();
  console.log(row);
};

// 编辑
const handleEdit = (row) => {
  formState.value = row;
  openDrawer();
  console.log(row);
};

// 执行
const executeTask = (row) => {
  console.log(row);
};

// 删除
const handleDelete = (row) => {
  console.log(row);
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};

// 选择
const selectable = (row) => ![1, 2].includes(row.id);
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  console.log(val);
  multipleSelection.value = val;
};

// 抽屉是否可见
const drawerVisible = ref(false);

// 抽屉确认
const handleConfirm = () => {
  console.log('确认', { ...formState.value });

  handleCancel();
};

// 抽屉取消
const handleCancel = () => {
  console.log('取消');
  drawerVisible.value = false;
  formState.value = {};
};
</script>

<style scoped>
.btn-box {
  margin-bottom: 0.5em;
}
</style>
