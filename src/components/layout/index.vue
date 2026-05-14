<template>
  <div class="layout_box">
    <div class="header">
      <Header />
    </div>
    <div class="nav">
      <Navs />
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

defineOptions({
  name: 'Layout',
});
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
  .header {
    grid-area: header;
  }
  .nav {
    grid-area: nav;
    height: 100%;
    width: 100%;
    overflow-y: auto;
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
</style>
