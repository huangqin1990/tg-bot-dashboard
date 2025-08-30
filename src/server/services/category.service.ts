import { supabase } from '../utils/supabase';
import type { Category, CategoryInput, CategoryUpdate } from '@shared/types';

export class CategoryService {
  async getAll(isActive?: boolean) {
    let query = supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Category[];
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Category;
  }

  async create(input: CategoryInput) {
    const { data, error } = await supabase
      .from('categories')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async update(id: string, update: CategoryUpdate) {
    const { data, error } = await supabase
      .from('categories')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async updateOrder(categories: Array<{ id: string; display_order: number }>) {
    const updates = categories.map(cat => 
      supabase
        .from('categories')
        .update({ display_order: cat.display_order })
        .eq('id', cat.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some(result => result.error);
    
    if (hasError) {
      throw new Error('Failed to update category order');
    }

    return true;
  }
}

export const categoryService = new CategoryService();