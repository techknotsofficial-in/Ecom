import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, PackageSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { motion } from "framer-motion";
import TablePagination from "@/components/TablePagination";

const PAGE_SIZE = 12;
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "name";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? products
      : products.filter((p) => {
          const cat = categories.find((c) => c.slug === activeCategory);
          return cat ? p.category_id === cat.id : false;
        });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [activeCategory, searchQuery, sort, products, categories]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setCategory = (cat: string) => {
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const clearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const resetAllFilters = () => {
    setSearchParams({});
    setSort("featured");
    setPage(1);
  };

  let activeCategoryName =
    activeCategory === "all"
      ? "All Products"
      : categories.find((c) => c.slug === activeCategory)?.name || "Products";

  if (searchQuery) {
    activeCategoryName = `Search: "${searchQuery}"`;
  }

  const isLoading = productsLoading || categoriesLoading;

  return (
    <main className="py-8 md:py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold md:text-4xl">
                {activeCategoryName}
              </h1>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear search <X className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading
                ? "Loading products..."
                : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>

        {/* Filters & Sorting Toolbar */}
        <div className="mb-8 flex flex-col gap-4 border-b border-border/50 pb-6 md:flex-row md:items-center md:justify-between">
          {/* Category Filter Pills (Scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider pr-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Category:</span>
            </div>
            <Button
              variant={activeCategory === "all" ? "default" : "secondary"}
              size="sm"
              onClick={() => setCategory("all")}
              className="rounded-full text-xs shrink-0 h-8 px-3.5"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.slug ? "default" : "secondary"}
                size="sm"
                onClick={() => setCategory(cat.slug)}
                className="rounded-full text-xs shrink-0 h-8 px-3.5"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Sort:</span>
            </div>
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as SortOption)}
            >
              <SelectTrigger className="w-[160px] h-9 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden p-4 flex flex-col gap-3"
              >
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/40">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <motion.div
              key={activeCategory + sort + page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {paginatedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="py-16 md:py-24 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <PackageSearch className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="mb-2 font-heading text-xl font-bold">No products found</h2>
            <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
              We couldn't find any products matching your current filters or search query.
            </p>
            <Button variant="outline" onClick={resetAllFilters}>
              Reset all filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
