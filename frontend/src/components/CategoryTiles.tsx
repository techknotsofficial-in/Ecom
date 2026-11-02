import { Link } from "react-router-dom";
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
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const CategoryTiles = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading && categories.length === 0) {
    return (
      <section className="py-4">
        <div className="container px-2 sm:px-4">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 sm:h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Display top categories up to 8 on desktop / 8 on mobile (2 rows of 4)
  const displayCategories = categories.slice(0, 8);

  return (
    <section className="py-3 sm:py-5">
      <div className="container px-2 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-3.5">
          <div>
            <h2 className="text-sm sm:text-lg font-heading font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
              Explore our core hardware and electronic components
            </p>
          </div>
          <Link
            to="/products"
            className="text-[11px] sm:text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Category Tiles Grid: 4 per row on mobile, 6 to 8 on larger screens */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {displayCategories.map((cat) => {
            const config = categoryIconMap[cat.slug] || {
              icon: Package,
              colorClass: "text-primary bg-primary/10",
            };
            const Icon = config.icon;

            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center justify-between rounded-xl border border-border/80 bg-card p-2 sm:p-2.5 text-center transition-all duration-200 hover:border-primary/50 hover:shadow-xs active:scale-95"
              >
                {/* Icon Container */}
                <div
                  className={`flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${config.colorClass}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                {/* Category Label */}
                <span className="text-[10px] sm:text-xs font-medium text-foreground line-clamp-2 mt-1.5 leading-tight w-full">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;
