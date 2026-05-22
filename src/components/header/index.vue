<template>
  <div class="header_container">
    <div class="left">logo</div>
    <div class="right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon><UserFilled /></el-icon>
          <span>用户</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              :icon="CirclePlusFilled"
              @click="dialogVisible = true"
            >
              设置
            </el-dropdown-item>
            <el-dropdown-item :icon="Plus" @click="clickLogout">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <Dialog
    ref="dialogRef"
    v-model="dialogVisible"
    title="设置"
    @sure="sureHandle"
    @cancel="cancelHandle"
  >
    <Setting ref="settingRef" />
  </Dialog>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Setting from '@/components/setting/index.vue';
import Dialog from '@/components/dialog/index.vue';
import { UserFilled, CirclePlusFilled, Plus } from '@element-plus/icons-vue';

const dialogVisible = ref(false);
const sureHandle = () => {
  cancelHandle();
};
const cancelHandle = () => {
  dialogVisible.value = false;
};

const router = useRouter();
const clickLogout = () => {
  router.push('/login');
};
</script>

<style lang="scss">
.header_container {
  height: 100%;
  padding-inline: 0 4em;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //   .left {
  //   }
  .right {
    display: flex;
  }
}
.el-popper {
  width: 160px;
}
</style>
