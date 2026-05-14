<template>
  <div class="list-layout">
    <!-- <slot name="form"></slot>
    <div class="table-container">
      <slot name="table"></slot>
    </div> -->
    <slot></slot>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ListLayout',
});
</script>

<style lang="scss" scoped>
.list-layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .table-container {
    flex: 1;
    overflow: hidden;
  }
}
</style>
