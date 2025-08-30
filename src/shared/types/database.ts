export interface Category {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  channel_url: string | null;
  channel_username: string | null;
  address: string | null;
  phone: string | null;
  business_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MerchantWithCategory extends Merchant {
  category?: Category;
}

export type CategoryInput = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdate = Partial<CategoryInput>;

export type MerchantInput = Omit<Merchant, 'id' | 'created_at' | 'updated_at'>;
export type MerchantUpdate = Partial<MerchantInput>;