import { onMounted, ref, useTemplateRef } from 'vue';

// 流程
const formState = ref({});
// 流程-步骤
const stepForm = ref({});
// 流程-步骤-对话框
const dialogVisible = ref(false);
let stepFormRef;
export default function useStepForm() {
  // 获取步骤表单实例
  stepFormRef = useTemplateRef('stepFormRef');

  // 打开对话框
  const openDialog = (data) => {
    stepForm.value = { ...data };
    dialogVisible.value = true;
    console.log('打开对话框', stepForm.value, formState.value);
  };

  // Dialog确认
  const handleSure = async () => {
    if (!stepFormRef) return;
    await stepFormRef.value.validate((valid, fields) => {
      if (valid) {
        console.log('submit!');
        // 检测是否已有该步骤 有则修改 无则新增
        const obj = (formState.value.steps || []).find((item) => {
          return item.stepName === stepForm.value.stepName;
        });
        if (obj) {
          // 修改
          Object.assign(obj, stepForm.value);
        } else {
          // 新增
          formState.value.steps ??= [];
          formState.value.steps.push({ ...stepForm.value });
        }

        handleCancelDialog();
      } else {
        console.log('error submit!', fields);
      }
    });
  };

  // Dialog取消
  const handleCancelDialog = () => {
    console.log('取消');
    stepFormRef.value.resetFields();
    dialogVisible.value = false;
    stepForm.value = {};
  };

  return {
    formState,
    stepForm,
    stepFormRef,
    dialogVisible,
    openDialog,
    handleSure,
    handleCancelDialog,
  };
}
