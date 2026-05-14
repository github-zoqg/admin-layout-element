import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './style.css';

// 只开开发模式中使用
// if (import.meta.env.DEV) {
// }
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia);
app.mount('#app');
console.log('app', pinia);
