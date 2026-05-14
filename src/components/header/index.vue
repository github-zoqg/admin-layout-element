<template>
  <div class="header_container">
    <div class="left">logo</div>
    <div class="right" @click="clickLogout">退出</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const clickLogout = () => {
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.header_container {
  height: 100%;
  padding-inline: 1em;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //   .left {
  //   }
  //   .right {
  //   }
}
</style>
