<template>
  <el-form
    v-bind="$attrs"
    :inline="true"
    label-width="auto"
    class="demo-form-inline"
  >
    <slot></slot>
  </el-form>
</template>

<script setup>
defineOptions({
  name: 'ListForm',
});
</script>

<style lang="scss" scoped>
.demo-form-inline {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  & > :last-child {
    // 最后一个元素放至最后一列和倒数第二列
    grid-column: -2 / -1;
  }
}
</style>
