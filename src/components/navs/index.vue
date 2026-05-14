<template>
  <el-menu
    :default-active="activeIdex"
    :default-openeds="fristRoutes"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    router
    @open="handleOpen"
    @close="handleClose"
  >
    <SubMenu :menus="menus" />
  </el-menu>
</template>

<script setup>
import SubMenu from './SubMenu.vue';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed } from 'vue';
// import { routes } from '@/router/index.js';
// import { formatRoutes } from '@/utils/index.js';

defineOptions({
  name: 'Navs',
});

console.log(
  useRouter()
    .getRoutes()
    .filter((item) => !item.meta.isHide && item.children.length === 0),
  'useRouter().getRoutes()'
);
const isCollapse = ref(false);
const currentRoute = useRoute();
const activeIdex = computed(() => {
  return currentRoute.path;
});
const fristRoutes = [currentRoute.path];
const menus = computed(() => {
  // 拍扁路由
  return useRouter()
    .getRoutes()
    .filter((item) => !item.meta.isHide && item.children.length === 0);
  // 树结构路由
  //   return formatRoutes(routes);
});

const handleOpen = (key) => {
  console.log(key);
};
const handleClose = (key) => {
  console.log(key);
};
</script>

<style lang="scss" scoped></style>
