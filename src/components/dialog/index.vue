<template>
  <el-dialog :before-close="handleClose" v-bind="$attrs">
    <template #header>
      <slot name="header" />
    </template>
    <div class="dialog-content">
      <slot></slot>
    </div>
    <template #footer>
      <div v-if="props.showFooter" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="sure"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useSlots } from 'vue';

defineOptions({
  name: 'Dialog',
});
const props = defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
});
const slots = useSlots();
console.log(slots, 'slots');
const emits = defineEmits(['sure', 'cancel']);

const handleClose = () => {
  emits('cancel');
};

const sure = () => {
  emits('sure');
};
</script>

<style scoped lang="scss">
.dialog-content {
  padding-inline: 20px;
  max-height: 50vh;
  overflow: auto;
}
</style>
