<template>
  <el-form
    ref="stepFormRef"
    label-width="auto"
    :model="stepForm"
    :disabled="stepForm.disabled"
    :rules="rules"
  >
    <el-form-item label="步骤名称" prop="stepName">
      <el-input
        v-model="stepForm.stepName"
        placeholder="请输入步骤名称"
        clearable
      />
    </el-form-item>
    <el-form-item label="执行方法" prop="method">
      <el-input
        v-model="stepForm.method"
        placeholder="请输入执行方法"
        clearable
      />
    </el-form-item>
    <el-form-item label="说明">
      <el-input
        v-model="stepForm.address"
        type="textarea"
        placeholder="请输入说明"
        :rows="3"
      />
    </el-form-item>
    <el-form-item label="并发维度">
      <el-select
        v-model="stepForm.region"
        placeholder="请选择并发维度"
        clearable
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="失败后动作">
      <el-select
        v-model="stepForm.region"
        placeholder="请选择失败后动作"
        clearable
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="重试间隔">
      <el-input
        v-model="stepForm.method"
        placeholder="请输入执行方法"
        clearable
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import useStepForm from '@/views/task-create/hooks/index.js';
const { stepForm } = useStepForm();

const rules = {
  stepName: [{ required: true, message: '请输入步骤名称', trigger: 'blur' }],
  method: [{ required: true, message: '请输入执行方法', trigger: 'blur' }],
};
</script>

<style lang="scss" scoped></style>
