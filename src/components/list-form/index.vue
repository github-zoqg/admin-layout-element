<template>
  <el-form
    v-bind="$attrs"
    ref="formRef"
    :model="formInline"
    :inline="true"
    label-width="auto"
    class="demo-form-inline"
  >
    <el-form-item
      v-for="item in fields.filter((item) => !item.hide)"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
      :rules="item.rules ?? []"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="formInline[item.name]"
        :placeholder="item.placeholder"
        clearable
        v-bind="item.attrs"
        @change="item.handleChange"
      />

      <el-date-picker
        v-if="item.type === 'date'"
        v-model="formInline[item.name]"
        type="datetime"
        v-bind="item.attrs"
        clearable
        @change="item.handleChange"
      />

      <el-date-picker
        v-if="item.type === 'daterange'"
        v-model="formInline[item.name]"
        type="datetimerange"
        v-bind="item.attrs"
        @change="item.handleChange"
      />
      <el-select
        v-if="item.type === 'select'"
        v-model="formInline[item.name]"
        clearable
        v-bind="item.attrs"
        @change="item.handleChange"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <el-input
        v-if="item.type === 'textarea'"
        v-model="formInline[item.name]"
        type="textarea"
        clearable
        v-bind="item.attrs"
        @change="item.handleChange"
      />

      <el-input-number
        v-if="item.type === 'number'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      />

      <el-select
        v-if="item.type === 'cascader'"
        v-model="formInline[item.name]"
        clearable
        v-bind="item.attrs"
        @change="item.handleChange"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
          :children="option.children"
        />
      </el-select>

      <el-time-picker
        v-if="item.type === 'time'"
        v-model="formInline[item.name]"
        value-format="HH:mm:ss"
        v-bind="item.attrs"
        clearable
        @change="item.handleChange"
      />

      <el-time-select
        v-if="item.type === 'timeselect'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        clearable
        @change="item.handleChange"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-time-select>

      <el-switch
        v-if="item.type === 'switch'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      />

      <el-radio-group
        v-if="item.type === 'radio'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      >
        <el-radio
          v-for="option in item.options"
          :key="option.value"
          :label="option.value"
          >{{ option.label }}</el-radio
        >
      </el-radio-group>

      <el-checkbox-group
        v-if="item.type === 'checkbox'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      >
        <el-checkbox
          v-for="option in item.options"
          :key="option.value"
          :label="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>

      <el-slider
        v-if="item.type === 'slider'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      />

      <el-rate
        v-if="item.type === 'rate'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      />

      <el-color-picker
        v-if="item.type === 'color'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      />

      <el-upload
        v-if="item.type === 'upload'"
        v-bind="item.attrs"
        @change="item.handleChange"
      >
        <template #default>
          <el-button :type="item.buttonType ?? 'primary'">{{
            item.uploadText ?? '点击上传'
          }}</el-button>
        </template>
      </el-upload>

      <el-autocomplete
        v-if="item.type === 'autocomplete'"
        v-model="formInline[item.name]"
        v-bind="item.attrs"
        @change="item.handleChange"
      />
    </el-form-item>
    <!-- 自定义表单项 -->
    <slot></slot>
    <!-- 查询按钮 -->
    <el-form-item>
      <el-button class="from-btn" type="primary" @click="search">
        查询
      </el-button>
      <el-button class="from-btn" type="primary" @click="resetForm">
        重置
      </el-button>
      <!-- 自定义按钮 -->
      <slot name="custom-btn"></slot>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';

defineOptions({
  name: 'ListForm',
});

const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
});

const formInline = defineModel('value');
const emit = defineEmits(['submit']);

const formRef = ref(null);
const search = () => {
  // 校验表单
  console.log(formRef.value, formInline.value, '校验表单');
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', props.formInline);
    }
  });
};

const resetForm = () => {
  formRef.value.resetFields();
};

defineExpose({
  formRef,
});
</script>

<style lang="scss" scoped>
.demo-form-inline {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  & > :last-child {
    // 最后一个元素放至最后一列和倒数第二列
    grid-column: -2 / -1;
    margin-right: 32px;
  }
}
</style>
