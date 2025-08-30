<template>
  <div>
    <n-h1>{{ isEdit ? '编辑商户' : '添加商户' }}</n-h1>
    
    <n-card>
      <n-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <n-grid :cols="2" :x-gap="24">
          <n-gi>
            <n-form-item label="商户名称" path="name">
              <n-input v-model:value="formData.name" placeholder="请输入商户名称" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="所属分类" path="category_id">
              <n-select
                v-model:value="formData.category_id"
                placeholder="请选择分类"
                :options="categoryOptions"
              />
            </n-form-item>
          </n-gi>
          <n-gi :span="2">
            <n-form-item label="简短描述" path="short_description">
              <n-input
                v-model:value="formData.short_description"
                placeholder="请输入简短描述（显示在列表中）"
                maxlength="100"
                show-count
              />
            </n-form-item>
          </n-gi>
          <n-gi :span="2">
            <n-form-item label="详细描述" path="description">
              <n-input
                v-model:value="formData.description"
                type="textarea"
                placeholder="请输入详细描述"
                :rows="4"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="地址" path="address">
              <n-input v-model:value="formData.address" placeholder="请输入地址" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="电话" path="phone">
              <n-input v-model:value="formData.phone" placeholder="请输入电话" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="营业时间" path="business_hours">
              <n-input v-model:value="formData.business_hours" placeholder="如：9:00-22:00" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="评分" path="rating">
              <n-input-number
                v-model:value="formData.rating"
                :min="0"
                :max="5"
                :step="0.1"
                :precision="1"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="频道用户名" path="channel_username">
              <n-input v-model:value="formData.channel_username" placeholder="@username" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="频道链接" path="channel_url">
              <n-input v-model:value="formData.channel_url" placeholder="https://t.me/..." />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="缩略图URL" path="thumbnail_url">
              <n-input v-model:value="formData.thumbnail_url" placeholder="请输入缩略图URL" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="大图URL" path="image_url">
              <n-input v-model:value="formData.image_url" placeholder="请输入大图URL" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="纬度" path="latitude">
              <n-input-number
                v-model:value="formData.latitude"
                :precision="8"
                placeholder="如：39.908823"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="经度" path="longitude">
              <n-input-number
                v-model:value="formData.longitude"
                :precision="8"
                placeholder="如：116.397470"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="推荐商户" path="is_featured">
              <n-switch v-model:value="formData.is_featured" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="启用状态" path="is_active">
              <n-switch v-model:value="formData.is_active" />
            </n-form-item>
          </n-gi>
        </n-grid>

        <n-divider />

        <n-space>
          <n-button type="primary" @click="handleSubmit">
            {{ isEdit ? '更新' : '创建' }}
          </n-button>
          <n-button @click="router.back()">取消</n-button>
        </n-space>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  NH1,
  NCard,
  NForm,
  NFormItem,
  NGrid,
  NGi,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NDivider,
  NSpace,
  NButton,
  useMessage,
  type FormInst,
} from 'naive-ui';
import { merchantsApi } from '@/api/merchants';
import { categoriesApi } from '@/api/categories';
import type { MerchantInput, Category } from '@shared/types';

const router = useRouter();
const route = useRoute();
const message = useMessage();
const formRef = ref<FormInst | null>(null);

const isEdit = computed(() => !!route.params.id);
const merchantId = computed(() => route.params.id as string);

const categories = ref<Category[]>([]);
const categoryOptions = computed(() =>
  categories.value.map((cat) => ({
    label: `${cat.emoji || ''} ${cat.name}`.trim(),
    value: cat.id,
  }))
);

const defaultFormData: MerchantInput = {
  category_id: '',
  name: '',
  description: null,
  short_description: null,
  image_url: null,
  thumbnail_url: null,
  channel_url: null,
  channel_username: null,
  address: null,
  phone: null,
  business_hours: null,
  latitude: null,
  longitude: null,
  rating: null,
  is_featured: false,
  is_active: true,
};

const formData = reactive<MerchantInput>({ ...defaultFormData });

const rules = {
  name: {
    required: true,
    message: '请输入商户名称',
    trigger: 'blur',
  },
  category_id: {
    required: true,
    message: '请选择分类',
    trigger: 'blur',
  },
};

async function loadCategories() {
  try {
    const response = await categoriesApi.getAll(true);
    categories.value = response.data;
  } catch (error) {
    message.error('加载分类失败');
  }
}

async function loadMerchant() {
  if (!isEdit.value) return;
  
  try {
    const response = await merchantsApi.getById(merchantId.value);
    const merchant = response.data;
    Object.assign(formData, {
      category_id: merchant.category_id,
      name: merchant.name,
      description: merchant.description,
      short_description: merchant.short_description,
      image_url: merchant.image_url,
      thumbnail_url: merchant.thumbnail_url,
      channel_url: merchant.channel_url,
      channel_username: merchant.channel_username,
      address: merchant.address,
      phone: merchant.phone,
      business_hours: merchant.business_hours,
      latitude: merchant.latitude,
      longitude: merchant.longitude,
      rating: merchant.rating,
      is_featured: merchant.is_featured,
      is_active: merchant.is_active,
    });
  } catch (error) {
    message.error('加载商户信息失败');
    router.back();
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    
    if (isEdit.value) {
      await merchantsApi.update(merchantId.value, formData);
      message.success('更新成功');
    } else {
      await merchantsApi.create(formData);
      message.success('创建成功');
    }
    
    router.push('/merchants');
  } catch (error) {
    message.error(isEdit.value ? '更新失败' : '创建失败');
  }
}

onMounted(() => {
  loadCategories();
  loadMerchant();
});
</script>