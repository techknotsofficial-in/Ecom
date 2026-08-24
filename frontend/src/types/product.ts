export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  image_url: string | null;
  images: string[] | null;
  badge: string | null;
  rating: number | null;
  reviews_count: number | null;
  stock: number;
  is_active: boolean | null;
  is_featured: boolean | null;
  specifications: any | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon_name: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
}
