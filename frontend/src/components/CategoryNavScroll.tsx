import { Link, useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import {
  Activity,
  Cpu,
  Package,
  Bot,
  Layers,
  Tv,
  BatteryCharging,
  Camera,
  Cog,
  HardDrive,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map category slugs to distinctive Lucide icons
const categoryIconMap: Record<string, LucideIcon> = {
  "development-boards": Cpu,
  "sensors-acuators": Activity,
  "robotics-kits": Bot,
  "iot-starter-kits": Package,
  "motors-pumps": Cog,
  "motor-drivers": Cpu,
  display: Tv,
  "power-supply-batteries": BatteryCharging,
  "modules-storage": HardDrive,
  "prototyping-accessories": Layers,
  "camera-modules": Camera,
};

const CategoryNavScroll = () => {
  const { data: categories = [], isLoading } = useCategories();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");

  if (isLoading && categories.length === 0) {
    return (
      <div className="w-full bg-card border-b border-border/60 py-2.5">
        <div className="container flex gap-3 overflow-x-auto no-scrollbar px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 animate-pulse">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="h-2.5 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav
      aria-label="Categories navigation"
      className="w-full bg-card/95 backdrop-blur-sm border-b border-border/60 sticky top-16 md:top-16 z-30 shadow-xs"
    >
      <div className="container px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2.5 scroll-smooth overscroll-x-contain">
          {/* "All" Item */}
          <Link
            to="/products"
            className={cn(
              "group flex flex-col items-center gap-1 shrink-0 px-2 py-1 rounded-lg transition-colors min-w-[62px] sm:min-w-[70px]",
              !currentCategory ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div
              className={cn(
                "flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105 shadow-2xs",
                !currentCategory
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/70 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <LayoutGrid className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-[10px] sm:text-[11px] font-medium tracking-tight text-center leading-tight truncate max-w-[64px]",
                !currentCategory && "font-bold text-primary"
              )}
            >
              All
            </span>
          </Link>

          {/* Database Categories */}
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.slug] || Package;
            const isActive = currentCategory === cat.slug;

            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className={cn(
                  "group flex flex-col items-center gap-1 shrink-0 px-1.5 py-1 rounded-lg transition-colors min-w-[64px] sm:min-w-[74px]",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all group-hover:scale-105 shadow-2xs",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/70 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
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
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavScroll;
