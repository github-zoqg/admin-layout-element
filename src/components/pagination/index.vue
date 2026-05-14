<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :size="size"
      :disabled="disabled"
      :background="background"
      :layout="props.layout"
      :total="props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineOptions({
  name: 'Pagination',
});

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
});

const emit = defineEmits(['pageDataChange']);

const currentPage = ref(1);
const pageSize = ref(10);
const size = ref('default');
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  currentPage.value = 1;
  emit('pageDataChange', {
    currentPage: currentPage.value,
    pageSize: val,
  });
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  emit('pageDataChange', {
    currentPage: val,
    pageSize: pageSize.value,
  });
};
</script>

<style lang="scss" scoped>
.pagination {
  padding-block: 1em;
  text-align: right;
  position: absolute;
  right: 20px;
}
</style>
