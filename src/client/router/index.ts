import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'merchants',
        name: 'Merchants',
        component: () => import('@/views/Merchants.vue'),
        meta: { title: '商户管理' }
      },
      {
        path: 'merchants/create',
        name: 'CreateMerchant',
        component: () => import('@/views/MerchantForm.vue'),
        meta: { title: '新增商户' }
      },
      {
        path: 'merchants/:id/edit',
        name: 'EditMerchant',
        component: () => import('@/views/MerchantForm.vue'),
        meta: { title: '编辑商户' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to: any, _from: any, next: any) => {
  document.title = `${to.meta.title || '管理'} - TG Bot 后台管理系统`;
  next();
});

export default router;