<template>
  <h3>基本信息</h3>
  <el-form
    label-width="auto"
    :model="formInline"
    :disabled="props.disabled"
    class="list-form"
  >
    <el-form-item label="流程名称">
      <el-input
        v-model="formInline.user"
        placeholder="请输入流程名称"
        clearable
      />
    </el-form-item>
    <el-form-item label="流程分类">
      <el-select
        v-model="formInline.region"
        placeholder="请选择流程分类"
        clearable
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="流程描述">
      <el-input
        v-model="formInline.address"
        type="textarea"
        placeholder="请输入流程描述"
        :rows="3"
      />
    </el-form-item>
  </el-form>
  <h3>
    执行步骤
    <el-button
      type="primary"
      :disabled="props.disabled"
      plain
      class="add-btn"
      @click="addStep"
    >
      添加执行步骤
    </el-button>
  </h3>
  <VueDraggableNext
    v-model="formInline.steps"
    class="list-group"
    handle=".drag-handle"
    @change="onListChange"
  >
    <div v-for="(item, index) in formInline.steps" :key="index">
      <div class="step">
        <span class="drag-handle">⋮⋮</span>
        <span class="step-index">{{ index + 1 }} </span>
        <div class="step-content">
          <div class="step-title">{{ item.stepName }}</div>
          <div class="step-text">{{ item.method }}</div>
        </div>
        <el-icon @click="handleEdit(item)"><Edit /></el-icon>
        <el-icon @click="removeAt(index)"><DeleteFilled /></el-icon>
      </div>
    </div>
  </VueDraggableNext>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next';
import useStepFrom from '@/views/task-create/hooks/index.js';

const { openDialog } = useStepFrom();

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
const formInline = defineModel({
  type: Object,
  default: () => ({}),
});

const addStep = () => {
  openDialog();
};

const handleEdit = (item) => {
  console.log(item);
  openDialog(item);
};

const removeAt = (index) => {
  formInline.value.steps.splice(index, 1);
};

const onListChange = (list) => {
  console.log(list);
};
</script>

<style lang="scss" scoped>
h3 {
  display: flex;
  align-items: center;
  margin: 0;
  padding-block: 0.5em;
  border-bottom: 1px solid #e4e7ed;
}
.list-form {
  margin-top: 1em;
}
.add-btn {
  margin-left: auto;
}
.list-group {
  margin-top: 1em;
  border-top: 1px solid #e4e7ed;
}
.step {
  display: flex;
  align-items: center;
  padding-block: 0.5em;
  border-bottom: 1px solid #e4e7ed;
  cursor: move;
  i {
    padding-inline: 0.5em;
    cursor: pointer;
  }
  .step-index {
    margin-right: 1em;
  }
  .drag-handle {
    cursor: grab;
    margin-right: 10px;
    color: #999;
    user-select: none;
  }

  .drag-handle:active {
    cursor: grabbing;
  }
  .step-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    .step-title {
      font-weight: bold;
      color: initial;
    }
  }
}
</style>
