<template>
  <div v-for="item in props.menus" :key="item.path">
    <template v-if="item.children?.length > 0">
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <SubMenu :menus="item.children" />
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item
        :index="item.path"
        :class="{ 'is-active': item.name === $route.meta.isActive }"
      >
        {{ item.meta.title }}
      </el-menu-item>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineOptions({
  name: 'SubMenu',
});

const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
});
console.log(useRouter().getRoutes(), 'props.menus');
</script>

<style lang="scss" scoped></style>
