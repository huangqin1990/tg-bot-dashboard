import { supabase } from '../utils/supabase';
import type { Merchant, MerchantWithCategory, MerchantInput, MerchantUpdate, SearchParams, NearbySearchParams } from '@shared/types';

export class MerchantService {
  async search(params: SearchParams) {
    let query = supabase
      .from('merchants')
      .select('*, category:categories(*)', { count: 'exact' });

    if (params.q) {
      query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }

    if (params.category_id) {
      query = query.eq('category_id', params.category_id);
    }

    if (params.is_active !== undefined) {
      query = query.eq('is_active', params.is_active);
    }

    if (params.is_featured !== undefined) {
      query = query.eq('is_featured', params.is_featured);
    }

    const sortField = params.sort || 'created_at';
    const sortOrder = params.order || 'desc';
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as MerchantWithCategory[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('merchants')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as MerchantWithCategory;
  }

  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('merchants')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data as MerchantWithCategory[];
  }

  async getFeatured() {
    const { data, error } = await supabase
      .from('merchants')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(10);

    if (error) throw error;
    return data as MerchantWithCategory[];
  }

  async getNearby(params: NearbySearchParams) {
    const radius = params.radius || 5;
    
    const { data, error } = await supabase.rpc('get_nearby_merchants', {
      lat: params.latitude,
      lng: params.longitude,
      radius_km: radius
    });

    if (error) throw error;
    return data as MerchantWithCategory[];
  }

  async create(input: MerchantInput) {
    const { data, error } = await supabase
      .from('merchants')
      .insert(input)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return data as MerchantWithCategory;
  }

  async update(id: string, update: MerchantUpdate) {
    const { data, error } = await supabase
      .from('merchants')
      .update(update)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return data as MerchantWithCategory;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('merchants')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async bulkUpdateStatus(ids: string[], isActive: boolean) {
    const { error } = await supabase
      .from('merchants')
      .update({ is_active: isActive })
      .in('id', ids);

    if (error) throw error;
    return true;
  }

  async bulkUpdateFeatured(ids: string[], isFeatured: boolean) {
    const { error } = await supabase
      .from('merchants')
      .update({ is_featured: isFeatured })
      .in('id', ids);

    if (error) throw error;
    return true;
  }
}

export const merchantService = new MerchantService();