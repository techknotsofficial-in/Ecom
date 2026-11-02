import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  PackageSearch,
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  Cpu,
  Activity,
  Bot,
  Package,
  Cog,
  Tv,
  BatteryCharging,
  HardDrive,
  Layers,
  Camera,
  Sparkles,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import ProductCard from "@/components/ProductCard";
import TablePagination from "@/components/TablePagination";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "name";

// Distinctive category icons matching homepage design system
const categoryIconMap: Record<string, { icon: LucideIcon; colorClass: string }> = {
  "development-boards": { icon: Cpu, colorClass: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
  "sensors-acuators": { icon: Activity, colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  "robotics-kits": { icon: Bot, colorClass: "text-purple-600 dark:text-purple-400 bg-purple-500/10" },
  "iot-starter-kits": { icon: Package, colorClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  "motors-pumps": { icon: Cog, colorClass: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10" },
  "motor-drivers": { icon: Cpu, colorClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10" },
  display: { icon: Tv, colorClass: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
  "power-supply-batteries": { icon: BatteryCharging, colorClass: "text-green-600 dark:text-green-400 bg-green-500/10" },
  "modules-storage": { icon: HardDrive, colorClass: "text-orange-600 dark:text-orange-400 bg-orange-500/10" },
  "prototyping-accessories": { icon: Layers, colorClass: "text-teal-600 dark:text-teal-400 bg-teal-500/10" },
  "camera-modules": { icon: Camera, colorClass: "text-pink-600 dark:text-pink-400 bg-pink-500/10" },
  "electronic-components": { icon: Sparkles, colorClass: "text-violet-600 dark:text-violet-400 bg-violet-500/10" },
};

const categoryDescriptions: Record<string, string> = {
  all: "Explore our comprehensive collection of IoT hardware, microcontrollers, development boards, and electronic sensors.",
  "development-boards": "Microcontrollers, ESP32, Arduino boards, and wireless IoT development platforms.",
  "sensors-acuators": "Precision environmental sensors, motion modules, and actuators for smart systems.",
  "robotics-kits": "Complete robotics chassis, robotic arms, and starter kits for makers and students.",
  "iot-starter-kits": "All-in-one IoT bundles designed for rapid prototyping and smart connected projects.",
  "motors-pumps": "High-torque BO gear motors, stepper motors, micro submersible pumps, and motion hardware.",
  "motor-drivers": "L298N drivers, servo shields, and motor controller modules for automation systems.",
  display: "OLED displays, 16x2 LCD modules, and graphical readout screens for electronics projects.",
  "power-supply-batteries": "Li-ion TP4056 chargers, solar panels, battery packs, and step-down power modules.",
  "modules-storage": "Wireless RF, Bluetooth, Wi-Fi, SD card storage shields, and relay breakout boards.",
  "prototyping-accessories": "Solderless breadboards, jumper wires, test clips, and prototyping hardware.",
  "camera-modules": "ESP32-CAM and miniature camera sensors for computer vision and remote monitoring.",
  "electronic-components": "Fundamental electronic components, resistors, capacitors, LEDs, and ICs.",
  kits: "Hands-on robotics kits and IoT starter packs designed for students and makers.",
  courses: "Expert-led workshops and hands-on courses to master embedded systems and IoT hardware.",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const sort = (searchParams.get("sort") as SortOption) || "featured";
  const inStockOnly = searchParams.get("in_stock") === "true";
  const page = Number(searchParams.get("page")) || 1;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Sync local search when URL changes externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Product counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach((cat) => {
      counts[cat.slug] = products.filter((p) => p.category_id === cat.id).length;
    });
    return counts;
  }, [products, categories]);

  // In-stock products count
  const inStockCount = useMemo(() => {
    return products.filter((p) => p.stock > 0).length;
  }, [products]);

  // Filtered & Sorted products list
  const filtered = useMemo(() => {
    let list =
      activeCategory === "all"
        ? products
        : products.filter((p) => {
            if (activeCategory === "kits") {
              const kitCatIds = categories
                .filter((c) => c.slug.includes("kit"))
                .map((c) => c.id);
              return (
                (p.category_id && kitCatIds.includes(p.category_id)) ||
                p.name.toLowerCase().includes("kit") ||
                p.name.toLowerCase().includes("arm") ||
                p.name.toLowerCase().includes("robot")
              );
            }
            if (activeCategory === "courses") {
              return (
                p.badge === "course" ||
                p.name.toLowerCase().includes("course") ||
                p.name.toLowerCase().includes("masterclass")
              );
            }
            const cat = categories.find((c) => c.slug === activeCategory);
            return cat ? p.category_id === cat.id : false;
          });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
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
  }, [activeCategory, searchQuery, inStockOnly, sort, products, categories]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Navigation and filter handlers
  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (newPage > 1) {
      next.set("page", String(newPage));
    } else {
      next.delete("page");
    }
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "all") {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    next.delete("page");
    setSearchParams(next);
  };

  const handleSortChange = (newSort: SortOption) => {
    const next = new URLSearchParams(searchParams);
    if (newSort === "featured") {
      next.delete("sort");
    } else {
      next.set("sort", newSort);
    }
    next.delete("page");
    setSearchParams(next);
  };

  const toggleInStockOnly = () => {
    const next = new URLSearchParams(searchParams);
    if (!inStockOnly) {
      next.set("in_stock", "true");
    } else {
      next.delete("in_stock");
    }
    next.delete("page");
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      next.set("search", localSearch.trim());
    } else {
      next.delete("search");
    }
    next.delete("page");
    setSearchParams(next);
  };

  const clearSearch = () => {
    setLocalSearch("");
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    next.delete("page");
    setSearchParams(next);
  };

  const resetAllFilters = () => {
    setLocalSearch("");
    setSearchParams({});
  };

  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (sort !== "featured" ? 1 : 0);

  // Category title and description
  const currentCategoryObj = useMemo(() => {
    return categories.find((c) => c.slug === activeCategory);
  }, [categories, activeCategory]);

  let activeCategoryName =
    activeCategory === "all"
      ? "All Products"
      : activeCategory === "kits"
      ? "Robotics & Starter Kits"
      : activeCategory === "courses"
      ? "Courses & Workshops"
      : currentCategoryObj?.name || "Products";

  if (searchQuery) {
    activeCategoryName = `Search results for "${searchQuery}"`;
  }

  const activeCategoryDesc = useMemo(() => {
    if (searchQuery) return null;
    return (
      categoryDescriptions[activeCategory] ||
      currentCategoryObj?.description ||
      "Explore high-quality IoT components, microcontrollers, and hardware."
    );
  }, [activeCategory, currentCategoryObj, searchQuery]);

  const isLoading = productsLoading || categoriesLoading;

  return (
    <main className="py-3 sm:py-6 w-full overflow-x-hidden min-h-[calc(100vh-4rem)]">
      {/* 1. Horizontal Category Navigation Bar with Icons (Homepage Consistency) */}
      <nav
        aria-label="Category navigation"
        className="w-full bg-card/95 backdrop-blur-sm border-b border-border/60 shadow-2xs mb-4 sm:mb-6"
      >
        <div className="container px-2 sm:px-4">
          <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar py-2 sm:py-2.5 scroll-smooth overscroll-x-contain">
            {/* All Products Option */}
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "group flex flex-col items-center gap-1 shrink-0 px-2 py-1 rounded-lg transition-colors min-w-[62px] sm:min-w-[70px]",
                activeCategory === "all" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all group-hover:scale-105 shadow-2xs",
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/70 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}
              >
                <LayoutGrid className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-[11px] font-medium tracking-tight text-center leading-tight truncate max-w-[64px]",
                  activeCategory === "all" && "font-bold text-primary"
                )}
              >
                All
              </span>
            </button>

            {/* Database Categories */}
            {categories.map((cat) => {
              const config = categoryIconMap[cat.slug] || { icon: Package, colorClass: "" };
              const Icon = config.icon;
              const isActive = activeCategory === cat.slug;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.slug)}
                  className={cn(
                    "group flex flex-col items-center gap-1 shrink-0 px-1.5 py-1 rounded-lg transition-colors min-w-[64px] sm:min-w-[74px]",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all group-hover:scale-105 shadow-2xs",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-muted/70 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] sm:text-[11px] font-medium tracking-tight text-center leading-tight line-clamp-1 max-w-[68px] sm:max-w-[76px]",
                      isActive && "font-bold text-primary"
                    )}
                    title={cat.name}
                  >
                    {cat.name.replace(" & ", "/")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="container px-2 sm:px-4 max-w-7xl">
        {/* 2. Compact Catalog Header */}
        <div className="mb-3 sm:mb-4 bg-card rounded-xl sm:rounded-2xl border border-border/80 p-3.5 sm:p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {activeCategoryName}
                </h1>
                <span className="rounded-full bg-primary/10 text-primary font-semibold text-xs px-2.5 py-0.5 shrink-0">
                  {filtered.length} {filtered.length === 1 ? "Product" : "Products"}
                </span>
              </div>
              {activeCategoryDesc && (
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
                  {activeCategoryDesc}
                </p>
              )}
            </div>

            {/* Catalog Search & Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Filter within catalog..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-8 pr-8 h-8.5 sm:h-9 text-xs bg-muted/40 border-border/80 rounded-lg w-full"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search query"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-muted-foreground text-[11px] font-medium mr-1">Active filters:</span>

              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary font-medium px-2.5 py-0.5 text-[11px]">
                  <span>{activeCategoryName}</span>
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className="hover:opacity-75"
                    aria-label="Remove category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium px-2.5 py-0.5 text-[11px]">
                  <span>In Stock Only</span>
                  <button
                    type="button"
                    onClick={toggleInStockOnly}
                    className="hover:opacity-75"
                    aria-label="Remove in-stock filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 text-accent-foreground font-medium px-2.5 py-0.5 text-[11px]">
                  <span>"{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="hover:opacity-75"
                    aria-label="Remove search filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-destructive transition-colors ml-auto"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* 3. Controls & Action Bar */}
        <div className="mb-3.5 sm:mb-4 flex items-center justify-between gap-2 bg-card rounded-lg sm:rounded-xl border border-border/80 px-3 py-2 text-xs">
          {/* Left: Desktop Sidebar Toggle & Mobile Filter Button */}
          <div className="flex items-center gap-2">
            {/* Desktop Sidebar Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:inline-flex h-8 px-2.5 text-xs font-semibold gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              <span>{isSidebarOpen ? "Hide Filters" : "Show Filters"}</span>
              {activeFiltersCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Mobile Filter Sheet Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden h-8 px-2.5 text-xs font-semibold gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Quick In-Stock Filter Chip */}
            <button
              type="button"
              onClick={toggleInStockOnly}
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border text-xs font-medium transition-colors",
                inStockOnly
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-semibold"
                  : "bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground"
              )}
            >
              <CheckCircle2
                className={cn("h-3.5 w-3.5", inStockOnly ? "text-emerald-600" : "text-muted-foreground")}
              />
              <span>In Stock Only</span>
            </button>
          </div>

          {/* Right: Showing Products Counter & Sort Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium hidden sm:inline">
              Showing{" "}
              <strong>
                {filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–
                {Math.min(page * PAGE_SIZE, filtered.length)}
              </strong>{" "}
              of {filtered.length}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <span className="hidden md:inline text-xs text-muted-foreground font-medium">Sort:</span>
              <Select value={sort} onValueChange={(v) => handleSortChange(v as SortOption)}>
                <SelectTrigger className="w-[125px] sm:w-[155px] h-8 text-xs font-medium bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 4. Desktop Sidebar + Product Grid Layout */}
        <div className="flex gap-4 sm:gap-5 items-start">
          {/* Desktop Left Filter Sidebar (Flipkart / Amazon style) */}
          {isSidebarOpen && (
            <aside className="hidden lg:block w-60 xl:w-64 shrink-0 space-y-4 sticky top-28">
              {/* Category Filter Card */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Categories
                  </h3>
                  {activeCategory !== "all" && (
                    <button
                      type="button"
                      onClick={() => setCategory("all")}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-[320px] overflow-y-auto no-scrollbar pr-1">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left",
                      activeCategory === "all"
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>All Products</span>
                    <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.slug;
                    const count = categoryCounts[cat.slug] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.slug)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left",
                          isActive
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full shrink-0">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Filter Card */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b border-border/60">
                  Availability
                </h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium select-none">
                  <Checkbox checked={inStockOnly} onCheckedChange={toggleInStockOnly} />
                  <span>In Stock Only</span>
                  <span className="text-[10px] text-muted-foreground ml-auto bg-muted/60 px-1.5 py-0.5 rounded-full">
                    {inStockCount}
                  </span>
                </label>
              </div>

              {/* Sorting Filter Card */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b border-border/60">
                  Sort Order
                </h3>
                <div className="space-y-1">
                  {[
                    { id: "featured", label: "Featured" },
                    { id: "price-asc", label: "Price: Low to High" },
                    { id: "price-desc", label: "Price: High to Low" },
                    { id: "rating", label: "Customer Rating" },
                    { id: "name", label: "Name: A to Z" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSortChange(s.id as SortOption)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left",
                        sort === s.id
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>{s.label}</span>
                      {sort === s.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Main Product Grid Area */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div
                className={cn(
                  "grid gap-2.5 sm:gap-3.5 lg:gap-4",
                  isSidebarOpen
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5"
                )}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg sm:rounded-xl border border-border/80 bg-card overflow-hidden p-2.5 sm:p-3 flex flex-col gap-2"
                  >
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="h-3.5 w-4/5" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="mt-auto pt-2 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <motion.div
                  key={activeCategory + sort + page + inStockOnly + searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "grid gap-2.5 sm:gap-3.5 lg:gap-4",
                    isSidebarOpen
                      ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
                      : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5"
                  )}
                >
                  {paginatedProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>

                {/* Pagination (Preserved from Phase 3D) */}
                <div className="mt-6 sm:mt-8 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground order-2 sm:order-1">
                    Page {page} of {totalPages} ({filtered.length} total products)
                  </p>
                  <div className="order-1 sm:order-2">
                    <TablePagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 md:py-24 text-center rounded-xl border border-border/80 bg-card p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <PackageSearch className="h-7 w-7 text-muted-foreground" />
                </div>
                <h2 className="mb-2 font-heading text-lg sm:text-xl font-bold">No products found</h2>
                <p className="mx-auto mb-6 max-w-sm text-xs sm:text-sm text-muted-foreground">
                  We couldn't find any products matching your current filters or search term.
                </p>
                <Button variant="outline" size="sm" onClick={resetAllFilters} className="text-xs font-semibold">
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Reset all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Mobile Filter Drawer / Bottom Sheet */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="right" className="w-[85vw] max-w-[340px] p-4 flex flex-col justify-between">
          <div>
            <SheetHeader className="mb-4 pb-2 border-b border-border/60 text-left">
              <SheetTitle className="font-heading text-base font-bold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Filters & Sorting</span>
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar pr-1">
              {/* Availability Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Availability
                </h4>
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 cursor-pointer text-xs font-medium">
                  <Checkbox checked={inStockOnly} onCheckedChange={toggleInStockOnly} />
                  <span>In Stock Only</span>
                  <span className="text-[10px] text-muted-foreground ml-auto bg-muted px-1.5 py-0.5 rounded-full">
                    {inStockCount}
                  </span>
                </label>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Categories
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("all");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-left transition-colors",
                      activeCategory === "all"
                        ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                        : "bg-muted/40 text-foreground hover:bg-muted"
                    )}
                  >
                    <span>All Products</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full",
                        activeCategory === "all" ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.slug;
                    const count = categoryCounts[cat.slug] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.slug);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-left transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                            : "bg-muted/40 text-foreground hover:bg-muted"
                        )}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                            isActive ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Selection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Sort By
                </h4>
                <div className="space-y-1">
                  {[
                    { id: "featured", label: "Featured" },
                    { id: "price-asc", label: "Price: Low to High" },
                    { id: "price-desc", label: "Price: High to Low" },
                    { id: "rating", label: "Customer Rating" },
                    { id: "name", label: "Name: A to Z" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSortChange(s.id as SortOption)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-left transition-colors",
                        sort === s.id
                          ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                          : "bg-muted/40 text-foreground hover:bg-muted"
                      )}
                    >
                      <span>{s.label}</span>
                      {sort === s.id && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-4 pt-3 border-t border-border/60 flex flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
              className="flex-1 text-xs font-semibold"
            >
              Reset All
            </Button>
            <SheetClose asChild>
              <Button size="sm" className="flex-1 text-xs font-semibold">
                Apply Filters
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </main>
  );
};

export default Products;
