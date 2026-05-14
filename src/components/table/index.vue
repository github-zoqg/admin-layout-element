<template>
  <div class="table-container">
    <el-table
      v-bind="$attrs"
      :data="props.data"
      style="width: 100%"
      :height="`calc(100% - ${paginationHeight}px)`"
      header-cell-class-name="header-cell"
    >
      <slot></slot>
    </el-table>

    <Pagination :total="attrs.total" @pageDataChange="pageDataChange" />
  </div>
</template>

<script setup>
import Pagination from '@/components/pagination/index.vue';
import { useAttrs } from 'vue';
import { paginationHeight } from '@/config/const.js';

defineOptions({
  name: 'Table',
});

const emits = defineEmits(['pageDataChange']);
const attrs = useAttrs();
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const pageDataChange = (val) => {
  emits('pageDataChange', val);
};
</script>

<style lang="scss" scoped>
.table-container {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  :deep(.header-cell) {
    background-color: #f9fbfe !important;
  }
}
</style>
