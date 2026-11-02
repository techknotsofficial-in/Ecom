import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async (): Promise<Product[]> => {
      // First try products flagged as featured
      const { data: featured, error: featuredError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!featuredError && featured && featured.length > 0) {
        return featured;
      }

      // Fallback: Return active products with discounts or latest additions
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ["products", "bestsellers"],
    queryFn: async (): Promise<Product[]> => {
      // Best sellers: query products with badge='bestseller' or high rating
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .or("badge.eq.bestseller,rating.gte.4")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useRoboticsAndKits = () => {
  return useQuery({
    queryKey: ["products", "robotics-and-kits"],
    queryFn: async (): Promise<Product[]> => {
      // Query categories for robotics, development boards, motors & starter kits
      const { data: cats } = await supabase
        .from("categories")
        .select("id, slug")
        .in("slug", [
          "robotics-kits",
          "iot-starter-kits",
          "development-boards",
          "motor-drivers",
          "motors-pumps",
        ]);

      const catIds = (cats || []).map((c) => c.id);

      let query = supabase.from("products").select("*").eq("is_active", true);

      if (catIds.length > 0) {
        query = query.in("category_id", catIds);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["products", "slug", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useProductsByCategory = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });
};
