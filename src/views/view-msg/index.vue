<template>
  <ListLayout>
    <div class="list_title">查看接口报文</div>
    <ListForm :model="formInline">
      <el-form-item label="接口名">
        <el-input
          v-model="formInline.user"
          placeholder="请输入接口名"
          clearable
        />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="formInline.date"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="报文ID">
        <el-input
          v-model="formInline.user"
          placeholder="请输入报文ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="formInline.region"
          placeholder="请选择状态"
          clearable
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="from-btn" type="primary" @click="getList">
          查询
        </el-button>
      </el-form-item>
    </ListForm>
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
