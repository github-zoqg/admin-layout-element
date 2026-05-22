<template>
  <el-drawer direction="rtl" v-bind="$attrs" :before-close="cancelClick">
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick"> 取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
defineOptions({
  name: 'Drawer',
});
const emits = defineEmits(['cancel', 'confirm']);
const cancelClick = () => {
  emits('cancel');
};
const confirmClick = () => {
  emits('confirm');
};
</script>

<style lang="scss" scoped></style>
