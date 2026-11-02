import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  isLoading?: boolean;
}

const FeaturedProducts = ({ title, subtitle, products, isLoading }: FeaturedProductsProps) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-heading text-3xl font-bold md:text-4xl">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex group">
            <Link to="/products">
              View All
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
