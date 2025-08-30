<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        v-model:value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        @update:value="handleMenuSelect"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center;">
        <h2>TG Bot 管理后台</h2>
      </n-layout-header>
      <n-layout-content style="padding: 24px;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import {
  HomeOutline,
  ListOutline,
  StorefrontOutline,
} from '@vicons/ionicons5';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const activeKey = computed(() => route.name as string);

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: '仪表盘',
    key: 'Dashboard',
    icon: renderIcon(HomeOutline),
  },
  {
    label: '分类管理',
    key: 'Categories',
    icon: renderIcon(ListOutline),
  },
  {
    label: '商户管理',
    key: 'Merchants',
    icon: renderIcon(StorefrontOutline),
  },
];

function handleMenuSelect(key: string) {
  router.push({ name: key });
}
</script>