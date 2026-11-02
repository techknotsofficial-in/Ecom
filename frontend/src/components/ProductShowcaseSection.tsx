import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface ProductShowcaseSectionProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  viewAllLink?: string;
  products: Product[];
  isLoading?: boolean;
}

const ProductShowcaseSection = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  viewAllLink = "/products",
  products,
  isLoading,
}: ProductShowcaseSectionProps) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 border-b border-border/40 last:border-b-0">
      <div className="container px-2 sm:px-4">
        {/* Header Row */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base sm:text-xl font-bold tracking-tight truncate text-foreground">
                  {title}
                </h2>
                {badge && (
                  <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-muted-foreground truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <Button asChild variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-primary font-semibold hover:text-primary/90 shrink-0">
            <Link to={viewAllLink} className="inline-flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Product Grid: 2 per row on mobile (320px+), 2-3 on tablet, 4 on desktop, 5 on large screen */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg sm:rounded-xl border border-border/80 bg-card overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-2.5 sm:p-3.5 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-7 w-full rounded-md mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
