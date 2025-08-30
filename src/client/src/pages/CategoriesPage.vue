<template>
  <div>
    <n-h1>分类管理</n-h1>
    
    <n-space justify="space-between" style="margin-bottom: 16px">
      <n-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <n-icon :component="AddOutline" />
        </template>
        添加分类
      </n-button>
    </n-space>

    <n-data-table
      :columns="columns"
      :data="categories"
      :loading="loading"
      :row-key="(row: Category) => row.id"
    />

    <n-modal
      v-model:show="showCreateModal"
      preset="dialog"
      title="添加分类"
      positive-text="确定"
      negative-text="取消"
      @positive-click="handleCreate"
    >
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item label="名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入分类名称" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="请输入分类描述"
          />
        </n-form-item>
        <n-form-item label="图标" path="emoji">
          <n-input v-model:value="formData.emoji" placeholder="请输入表情图标" />
        </n-form-item>
        <n-form-item label="排序" path="display_order">
          <n-input-number v-model:value="formData.display_order" :min="0" />
        </n-form-item>
        <n-form-item label="状态" path="is_active">
          <n-switch v-model:value="formData.is_active" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import {
  NH1,
  NSpace,
  NButton,
  NIcon,
  NDataTable,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSwitch,
  NTag,
  useMessage,
  type DataTableColumns,
  type FormInst,
} from 'naive-ui';
import { AddOutline, CreateOutline, TrashOutline } from '@vicons/ionicons5';
import { categoriesApi } from '@/api/categories';
import type { Category, CategoryInput } from '@shared/types';

const message = useMessage();
const loading = ref(false);
const categories = ref<Category[]>([]);
const showCreateModal = ref(false);
const formRef = ref<FormInst | null>(null);

const defaultFormData: CategoryInput = {
  name: '',
  description: '',
  emoji: '',
  display_order: 0,
  is_active: true,
};

const formData = reactive({ ...defaultFormData });

const rules = {
  name: {
    required: true,
    message: '请输入分类名称',
    trigger: 'blur',
  },
};

const columns: DataTableColumns<Category> = [
  {
    title: '排序',
    key: 'display_order',
    width: 80,
  },
  {
    title: '图标',
    key: 'emoji',
    width: 80,
    render(row) {
      return row.emoji || '-';
    },
  },
  {
    title: '名称',
    key: 'name',
  },
  {
    title: '描述',
    key: 'description',
    render(row) {
      return row.description || '-';
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
              onClick: () => handleEdit(row),
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

async function loadCategories() {
  loading.value = true;
  try {
    const response = await categoriesApi.getAll();
    categories.value = response.data;
  } catch (error) {
    message.error('加载分类失败');
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  try {
    await formRef.value?.validate();
    await categoriesApi.create(formData);
    message.success('创建成功');
    showCreateModal.value = false;
    Object.assign(formData, defaultFormData);
    loadCategories();
  } catch (error) {
    message.error('创建失败');
  }
}

function handleEdit(category: Category) {
  message.info('编辑功能开发中');
}

async function handleDelete(category: Category) {
  try {
    await categoriesApi.delete(category.id);
    message.success('删除成功');
    loadCategories();
  } catch (error) {
    message.error('删除失败');
  }
}

onMounted(() => {
  loadCategories();
});
</script>