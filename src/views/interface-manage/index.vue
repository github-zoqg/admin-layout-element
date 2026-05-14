<template>
  <ListLayout>
    <div class="list_title">接口服务信息</div>
    <ListForm :model="formInline">
      <el-form-item label="接口名">
        <el-input
          v-model="formInline.user"
          placeholder="请输入接口名"
          clearable
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="formInline.region"
          placeholder="请选择类型"
          clearable
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="formInline.region"
          placeholder="请选择类型"
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
      <el-table-column prop="name" label="线条" width="120" />
      <el-table-column prop="state" label="接口名" width="120" />
      <el-table-column prop="city" label="API地址" width="320" />
      <el-table-column prop="address" label="类型" width="600" />
      <el-table-column prop="address" label="方法" width="600" />
      <el-table-column prop="address" label="数据源">
        <template #default="scope">
          <span @click="handleClick(scope.row)">接口表</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="启用">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-value="1"
            inactive-value="0"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="120">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </Table>
  </ListLayout>
</template>

<script setup>
import ListForm from '@/components/list-form/index.vue';
import Table from '@/components/table/index.vue';
import ListLayout from '@/components/list-layout/index.vue';
import { reactive, ref } from 'vue';

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

// 点击数据源
const handleClick = (row) => {
  console.log(row);
};

// 编辑
const handleEdit = (row) => {
  console.log(row);
};

// 选择
const selectable = (row) => ![1, 2].includes(row.id);
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  console.log(val);
  multipleSelection.value = val;
};
</script>
