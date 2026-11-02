import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  new: "bg-[hsl(var(--badge-new))] text-white",
  sale: "bg-[hsl(var(--badge-sale))] text-white",
  bestseller: "bg-primary text-primary-foreground",
  course: "bg-[hsl(var(--badge-course))] text-white",
};

const badgeLabels: Record<string, string> = {
  new: "New",
  sale: "Sale",
  bestseller: "Best Seller",
  course: "Course",
};

interface ProductCardProps {
  product: Product;
  index?: number;
}

const formatINR = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();

  const imageUrl = product.image_url || "/placeholder.svg";
  const badge = product.badge || undefined;
  const rating = product.rating ?? 0;
  const reviews = product.reviews_count ?? 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="group relative flex h-full min-w-0 w-full flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
    >
      {/* Image Container with Badges */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-muted/20 p-4 flex items-center justify-center"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className={cn(
            "h-full w-full object-contain transition-transform duration-300 group-hover:scale-105",
            isOutOfStock && "opacity-60 grayscale-[30%]"
          )}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {badge && badgeStyles[badge] && (
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-xs",
                badgeStyles[badge]
              )}
            >
              {badgeLabels[badge]}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded-md bg-destructive text-destructive-foreground px-2 py-0.5 text-[11px] font-bold shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Out of Stock Ribbon */}
        {isOutOfStock && (
          <span className="absolute top-2.5 right-2.5 rounded-md bg-muted/90 border border-border text-muted-foreground px-2 py-0.5 text-[11px] font-semibold backdrop-blur-xs">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-heading text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating and Stock Hint */}
        <div className="mt-2 flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-medium">{rating > 0 ? rating.toFixed(1) : "New"}</span>
            {reviews > 0 && <span className="text-muted-foreground">({reviews})</span>}
          </div>
          {isLowStock && (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/40 gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-heading text-base sm:text-lg font-bold text-foreground">
                {formatINR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-9 w-9 shrink-0 rounded-lg transition-colors",
              isOutOfStock
                ? "cursor-not-allowed opacity-50 text-muted-foreground hover:bg-transparent"
                : "hover:bg-primary hover:text-primary-foreground"
            )}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock) {
                addItem(product);
              }
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export { formatINR };
export default ProductCard;
