import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/layout/index.vue';
import emitter from '@/utils/mitt';

export let routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '接口管理',
      icon: 'Location',
    },
    redirect: 'interface-manage',
    component: Layout,
    children: [
      {
        path: 'interface-manage',
        name: 'interface-manage',
        meta: {
          title: '接口管理',
          icon: 'Location',
        },
        component: () => import('@/views/interface-manage/index.vue'),
      },
      {
        path: 'data-source-manage',
        name: 'data-source-manage',
        meta: {
          title: '数据源管理',
          icon: 'Location',
        },
        component: () => import('@/views/data-source-manage/index.vue'),
      },
      {
        path: 'data-source-manage2',
        name: 'data-source-manage2',
        meta: {
          title: '数据源管理',
          icon: 'Location',
          isHide: true,
          isActive: 'data-source-manage',
        },
        component: () => import('@/views/data-source-manage/index.vue'),
      },
      {
        path: 'view-msg',
        name: 'view-msg',
        meta: { title: '查看报文', icon: 'Location' },
        component: () => import('@/views/view-msg/index.vue'),
      },
      {
        path: 'view-interface',
        name: 'view-interface',
        meta: { title: '查看接口列表', icon: 'Location' },
        component: () => import('@/views/view-interface/index.vue'),
      },
      {
        path: 'task-create',
        name: 'task-create',
        meta: { title: '任务创建', icon: 'Location' },
        component: () => import('@/views/task-create/index.vue'),
      },
      {
        path: 'log-query',
        name: 'log-query',
        meta: { title: '日志查询', icon: 'Location' },
        component: () => import('@/views/log-query/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      icon: 'Login',
      isHide: true,
    },
    component: () => import('@/views/login/index.vue'),
  },
];

let structuredRoutes = [];
function formatRoutes(routes) {
  routes.forEach((item) => {
    if (item.meta.isHide) return;
    if (!item.path.startsWith('/')) {
      item.path = `/${item.path}`;
    }
    if (item.children) {
      if (item.path !== '/') structuredRoutes.push(item.path);

      formatRoutes(item.children);

      structuredRoutes.pop();
    }
    item.path = `${structuredRoutes.join('')}${item.path}`;
  });
}
formatRoutes(routes);
console.log(routes, 'formatRoutes');

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// router.addRoute();
// console.log(router, 'router');
emitter.on('logout', () => {
  router.push('/login');
});
export default router;
