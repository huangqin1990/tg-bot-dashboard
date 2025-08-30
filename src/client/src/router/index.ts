import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/pages/CategoriesPage.vue'),
      },
      {
        path: 'merchants',
        name: 'Merchants',
        component: () => import('@/pages/MerchantsPage.vue'),
      },
      {
        path: 'merchants/create',
        name: 'CreateMerchant',
        component: () => import('@/pages/MerchantFormPage.vue'),
      },
      {
        path: 'merchants/:id/edit',
        name: 'EditMerchant',
        component: () => import('@/pages/MerchantFormPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;