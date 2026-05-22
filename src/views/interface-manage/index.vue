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
    <RemoteComp></RemoteComp>
    <Table
      :data="tableData"
      :total="total"
      @selection-change="handleSelectionChange"
      @pageDataChange="pageDataChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="appBiz" label="线条" />
      <el-table-column prop="interfaceDescription" label="接口名" />
      <el-table-column prop="interfaceName" label="API地址" />
      <el-table-column prop="address" label="类型">
        <template #default=""> webService </template>
      </el-table-column>
      <el-table-column prop="address" label="方法">
        <template #default=""> POST </template>
      </el-table-column>
      <el-table-column prop="address" label="数据源">
        <template #default="scope">
          <el-button type="text" @click="handleClick(scope.row)">
            接口表
          </el-button>
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
import { reactive, ref, onMounted } from 'vue';
import { appInterfaceInfo } from '@/api/inerface-manage';
import { useRouter } from 'vue-router';

const router = useRouter();
// 表格数据
const tableData = ref([]);
const total = ref(0);

// 查询表单
const formInline = reactive({
  user: '',
  region: '',
  date: '',
});
const pageData = ref({
  pageNum: 1,
  pageSize: 10,
});

// 初始化查询
onMounted(() => {
  getList();
});

// 查询
const getList = () => {
  console.log('submit!', pageData.value);
  const params = {
    ...pageData.value,
    ...formInline,
  };
  appInterfaceInfo()
    .then((res) => {
      console.log(res, 'res');
      tableData.value = res.data || [];
      total.value = res.data.length || 0;
    })
    .catch((err) => {
      console.log(err);
    });
};

// 分页
const pageDataChange = (pageData) => {
  console.log(pageData);
  pageData.value = pageData;
  getList();
};

// 点击数据源
const handleClick = (row) => {
  console.log(row);
  router.push({
    path: '/data-source-manage',
    query: {
      id: row.interfaceCode,
    },
  });
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
