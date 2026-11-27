<template>
  <ListLayout>
    <div class="list_title">查看接口报文</div>
    <ListForm v-model:value="formInline" :fields="fields"> </ListForm>
    <Table
      :data="tableData"
      :total="100"
      @selection-change="handleSelectionChange"
      @pageDataChange="pageDataChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="name" label="SERVICE_NAME" />
      <el-table-column prop="state" label="INSTANCE_ID" />
      <el-table-column prop="address" label="报文">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="请求时间" />

      <el-table-column prop="address" label="状态" />
      <el-table-column prop="address" label="响应时间" />
    </Table>
  </ListLayout>
  <Dialog
    ref="dialogRef"
    v-model="dialogVisible"
    :width="minDialog"
    title="报文内容"
    @sure="handleSure"
    @cancel="handleCancel"
  >
    <template #default>
      <JsonViewer :value="currentRow.address" />
    </template>
  </Dialog>
</template>

<script setup>
import ListForm from '@/components/list-form/index.vue';
import Table from '@/components/table/index.vue';
import ListLayout from '@/components/list-layout/index.vue';
import { reactive, ref } from 'vue';
import Dialog from '@/components/dialog/index.vue';
import { minDialog } from '@/config/const';
import JsonViewer from '@/components/json-viewer/index.vue';

const fields = ref([
  {
    name: 'user',
    label: 'SERVICE_NAME',
    type: 'input',
    rules: [{ required: true, message: '请输入SERVICE_NAME', trigger: 'blur' }],
    placeholder: '请输入SERVICE_NAME',
    handleChange: (val) => {
      console.log(val);
      if (val) {
        fields.value[1].attrs.disabled = false;
      } else {
        fields.value[1].attrs.disabled = true;
      }
    },
  },
  {
    name: 'region',
    label: 'INSTANCE_ID',
    type: 'input',
    attrs: {
      disabled: true,
      placeholder: '请输入INSTANCE_ID',
    },
  },
  {
    name: 'date',
    label: '请求时间',
    hide: true,
    type: 'daterange',
    attrs: {
      ['start-placeholder']: '开始时间',
      ['end-placeholder']: '结束时间',
    },
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    attrs: {
      placeholder: '请选择状态',
    },
    handleChange: (val) => {
      console.log(val);
      if (val === 'success') {
        fields.value[2].hide = false;
      } else {
        fields.value[2].hide = true;
      }
    },
    options: [
      {
        value: 'success',
        label: '成功',
      },
      {
        value: 'error',
        label: '失败',
      },
    ],
  },
  {
    name: 'responseDate',
    label: '响应时间',
    type: 'date',
    attrs: {
      placeholder: '请选择响应时间',
    },
  },
]);

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
  console.log('submit!', formInline, pageData);
};

// 分页
const pageDataChange = (pageData) => {
  console.log(pageData);
  getList(pageData);
};

// 编辑
let currentRow = null;
const handleEdit = (row) => {
  console.log(row);
  currentRow = row;
  dialogVisible.value = true;
};

// 对话框是否可见
const dialogVisible = ref(false);

// 确认
const handleSure = () => {
  console.log('确认');
  handleCancel();
};

// 取消
const handleCancel = () => {
  console.log('取消');
  dialogVisible.value = false;
};

// 选择
const selectable = (row) => ![1, 2].includes(row.id);
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  console.log(val);
  multipleSelection.value = val;
};
</script>
