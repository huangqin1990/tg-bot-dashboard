<template>
  <div>
    <n-h1>商户管理</n-h1>
    
    <n-space vertical :size="16">
      <n-card>
        <n-space>
          <n-input
            v-model:value="searchParams.q"
            placeholder="搜索商户名称或描述"
            style="width: 300px"
            @keyup.enter="handleSearch"
          />
          <n-select
            v-model:value="searchParams.category_id"
            placeholder="选择分类"
            clearable
            style="width: 200px"
            :options="categoryOptions"
            @update:value="handleSearch"
          />
          <n-button @click="handleSearch">搜索</n-button>
          <n-button type="primary" @click="router.push('/merchants/create')">
            <template #icon>
              <n-icon :component="AddOutline" />
            </template>
            添加商户
          </n-button>
        </n-space>
      </n-card>

      <n-data-table
        :columns="columns"
        :data="merchants"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row: MerchantWithCategory) => row.id"
        @update:page="handlePageChange"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  NH1,
  NSpace,
  NCard,
  NInput,
  NSelect,
  NButton,
  NIcon,
  NDataTable,
  NTag,
  NImage,
  useMessage,
  type DataTableColumns,
} from 'naive-ui';
import {
  AddOutline,
  CreateOutline,
  TrashOutline,
  StarOutline,
  CheckmarkCircleOutline,
} from '@vicons/ionicons5';
import { merchantsApi } from '@/api/merchants';
import { categoriesApi } from '@/api/categories';
import type { MerchantWithCategory, SearchParams, Category } from '@shared/types';

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const merchants = ref<MerchantWithCategory[]>([]);
const categories = ref<Category[]>([]);

const searchParams = reactive<SearchParams>({
  q: '',
  category_id: undefined,
  page: 1,
  limit: 20,
});

const pagination = reactive({
  page: 1,
  pageSize: 20,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    searchParams.page = page;
    loadMerchants();
  },
  onUpdatePageSize: (pageSize: number) => {
    searchParams.limit = pageSize;
    searchParams.page = 1;
    loadMerchants();
  },
});

const categoryOptions = computed(() =>
  categories.value.map((cat) => ({
    label: `${cat.emoji || ''} ${cat.name}`.trim(),
    value: cat.id,
  }))
);

const columns: DataTableColumns<MerchantWithCategory> = [
  {
    title: '图片',
    key: 'thumbnail_url',
    width: 80,
    render(row) {
      return row.thumbnail_url
        ? h(NImage, {
            src: row.thumbnail_url,
            width: 60,
            height: 60,
            objectFit: 'cover',
            style: { borderRadius: '4px' },
          })
        : '-';
    },
  },
  {
    title: '名称',
    key: 'name',
    render(row) {
      return h(
        NSpace,
        { align: 'center' },
        {
          default: () => [
            row.name,
            row.is_featured &&
              h(NIcon, { component: StarOutline, color: '#f39c12', size: 16 }),
          ],
        }
      );
    },
  },
  {
    title: '分类',
    key: 'category',
    render(row) {
      return row.category ? `${row.category.emoji || ''} ${row.category.name}`.trim() : '-';
    },
  },
  {
    title: '简介',
    key: 'short_description',
    render(row) {
      return row.short_description || '-';
    },
  },
  {
    title: '状态',
    key: 'is_active',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.is_active ? 'success' : 'default',
        },
        {
          default: () => (row.is_active ? '启用' : '禁用'),
        }
      );
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => router.push(`/merchants/${row.id}/edit`),
            },
            {
              icon: () => h(NIcon, { component: CreateOutline }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDelete(row),
            },
            {
              icon: () => h(NIcon, { component: TrashOutline }),
            }
          ),
        ],
      });
    },
  },
];

async function loadMerchants() {
  loading.value = true;
  try {
    const response = await merchantsApi.search(searchParams);
    merchants.value = response.data;
    pagination.itemCount = response.total;
    pagination.page = response.page;
  } catch (error) {
    message.error('加载商户失败');
  } finally {
    loading.value = false;
  }
}

async function loadCategories() {
  try {
    const response = await categoriesApi.getAll(true);
    categories.value = response.data;
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

function handleSearch() {
  searchParams.page = 1;
  loadMerchants();
}

function handlePageChange(page: number) {
  searchParams.page = page;
  loadMerchants();
}

async function handleDelete(merchant: MerchantWithCategory) {
  try {
    await merchantsApi.delete(merchant.id);
    message.success('删除成功');
    loadMerchants();
  } catch (error) {
    message.error('删除失败');
  }
}

onMounted(() => {
  loadCategories();
  loadMerchants();
});
</script>