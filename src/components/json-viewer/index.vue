<template>
  <JsonViewer copyable :expand-depth="expandDepth" theme="hand-json-theme" />
</template>

<script setup>
// 引入组件
import JsonViewer from 'vue-json-viewer';

// 引入样式
import 'vue-json-viewer/style.css';

defineOptions({
  name: 'JsonViewer',
});

// 代码编辑器可能会觉得props没什么用，不要删除他，在css里面用到了
const props = defineProps({
  // 默认展开的深度
  expandDepth: {
    type: Number,
    default: 5,
  },
  // 最大高度
  maxHeight: {
    type: [Number, String],
    default: '500px',
  },
});
</script>

<style scoped lang="less">
.hand-json-theme {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  .jv-key {
    color: #1d4ed8;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #dc2626;
    }
    &.jv-number-float {
      color: #dc2626;
    }
    &.jv-number-integer {
      color: #dc2626;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #059669;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-node {
      overflow: auto;
      max-height: v-bind('props.maxHeight');
    }
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
