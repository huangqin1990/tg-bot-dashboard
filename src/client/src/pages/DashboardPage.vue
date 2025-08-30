<template>
  <div>
    <n-h1>仪表盘</n-h1>
    <n-grid :cols="4" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-statistic label="总分类数" :value="stats.totalCategories">
          <template #prefix>
            <n-icon :component="ListOutline" />
          </template>
        </n-statistic>
      </n-gi>
      <n-gi>
        <n-statistic label="总商户数" :value="stats.totalMerchants">
          <template #prefix>
            <n-icon :component="StorefrontOutline" />
          </template>
        </n-statistic>
      </n-gi>
      <n-gi>
        <n-statistic label="活跃商户" :value="stats.activeMerchants">
          <template #prefix>
            <n-icon :component="CheckmarkCircleOutline" />
          </template>
        </n-statistic>
      </n-gi>
      <n-gi>
        <n-statistic label="推荐商户" :value="stats.featuredMerchants">
          <template #prefix>
            <n-icon :component="StarOutline" />
          </template>
        </n-statistic>
      </n-gi>
    </n-grid>

    <n-divider />

    <n-h2>快速操作</n-h2>
    <n-space>
      <n-button type="primary" @click="router.push('/merchants/create')">
        <template #icon>
          <n-icon :component="AddOutline" />
        </template>
        添加商户
      </n-button>
      <n-button @click="router.push('/categories')">
        管理分类
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NH1, NH2, NGrid, NGi, NStatistic, NIcon, NDivider, NSpace, NButton } from 'naive-ui';
import {
  ListOutline,
  StorefrontOutline,
  CheckmarkCircleOutline,
  StarOutline,
  AddOutline,
} from '@vicons/ionicons5';
import { categoriesApi } from '@/api/categories';
import { merchantsApi } from '@/api/merchants';

const router = useRouter();

const stats = ref({
  totalCategories: 0,
  totalMerchants: 0,
  activeMerchants: 0,
  featuredMerchants: 0,
});

async function loadStats() {
  try {
    const [categoriesRes, merchantsRes, featuredRes] = await Promise.all([
      categoriesApi.getAll(),
      merchantsApi.search({ limit: 1 }),
      merchantsApi.getFeatured(),
    ]);

    stats.value = {
      totalCategories: categoriesRes.data.length,
      totalMerchants: merchantsRes.total,
      activeMerchants: merchantsRes.total,
      featuredMerchants: featuredRes.data.length,
    };
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

onMounted(() => {
  loadStats();
});
</script>