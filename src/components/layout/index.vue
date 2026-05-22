<template>
  <div class="layout_box" :class="{ 'nav-collapse': !isExpand }">
    <div class="header">
      <Header />
    </div>
    <div class="nav">
      <Navs />
      <div class="nav_toggle" @click="changeExpand">
        <el-icon v-if="isExpand"><Fold /></el-icon>
        <el-icon v-else><Expand /></el-icon>
      </div>
    </div>
    <div class="content">
      <div class="content_bg">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Navs from '../navs/index.vue';
import Header from '../header/index.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Layout',
});
// 展开状态
const isExpand = ref(true);
// 切换展开状态
const changeExpand = () => {
  isExpand.value = !isExpand.value;
};
</script>

<style lang="less" scoped>
.layout_box {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 48px 1fr;
  grid-template-areas:
    'header header'
    'nav content';
  transition: all 0.3s ease-in-out;
  .header {
    grid-area: header;
  }
  .nav {
    grid-area: nav;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: white;
    > :first-child {
      flex-grow: 1;
    }
    .nav_toggle {
      border-top: 1px solid #e4e7ed;
      border-right: 1px solid #e4e7ed;
      height: 48px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-left: 20px;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
  .content {
    grid-area: content;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    padding: 0.5em 0 0.5em 0.5em;
    .content_bg {
      background-color: #ffffff;
      padding: 1em;
      box-sizing: border-box;
      height: 100%;
      overflow-y: auto;
    }
  }
}
.nav-collapse {
  grid-template-columns: 64px 1fr;
}
</style>
