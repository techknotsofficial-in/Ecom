import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  new: "bg-[hsl(var(--badge-new))] text-white",
  sale: "bg-destructive text-destructive-foreground",
  bestseller: "bg-amber-600 text-white",
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
  className?: string;
}

const formatINR = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);

const ProductCard = ({ product, index = 0, className }: ProductCardProps) => {
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={cn(
        "group relative flex h-full min-w-0 w-full flex-col rounded-lg sm:rounded-xl border border-border/80 bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40",
        className
      )}
    >
      {/* Product Image Area with Fixed Aspect Ratio (Amazon / Flipkart Style) */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-white dark:bg-muted/10 p-2.5 sm:p-4 flex items-center justify-center overflow-hidden border-b border-border/40"
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

        {/* Top-Left Badges: Discount Tag / Category Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="rounded bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {badge && badgeStyles[badge] && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold shadow-xs",
                badgeStyles[badge]
              )}
            >
              {badgeLabels[badge]}
            </span>
          )}
        </div>

        {/* Top-Right Out-of-Stock Badge */}
        {isOutOfStock && (
          <span className="absolute top-2 right-2 rounded bg-muted/95 border border-border text-muted-foreground px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold backdrop-blur-xs pointer-events-none">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5 justify-between min-w-0">
        <div>
          {/* 2-line Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-heading text-xs sm:text-sm font-semibold leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.4rem] text-foreground">
              {product.name}
            </h3>
          </Link>

          {/* Short Product Description (1–2 lines, compact typography) */}
          {product.description && (
            <p className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground leading-tight line-clamp-2 min-h-[1.6rem] sm:min-h-[2rem]">
              {product.description}
            </p>
          )}

          {/* Rating & Stock Status */}
          <div className="mt-1.5 flex items-center justify-between gap-1.5 flex-wrap text-xs">
            <div className="flex items-center gap-1 shrink-0">
              {rating > 0 ? (
                <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-500 text-amber-500" />
                  {rating.toFixed(1)}
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground font-medium">New</span>
              )}
              {reviews > 0 && (
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">({reviews})</span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="shrink-0 text-right ml-auto">
              {isOutOfStock ? (
                <span className="text-[10px] sm:text-[11px] font-medium text-destructive">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] sm:text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  In Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price & Add to Cart Section */}
        <div className="mt-auto pt-2.5 sm:pt-3">
          {/* Price row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-heading text-sm sm:text-base font-bold text-foreground">
              {formatINR(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-[11px] sm:text-xs text-muted-foreground line-through">
                  {formatINR(product.original_price)}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  ({discountPercent}% off)
                </span>
              </>
            )}
          </div>

          {/* Full-width Amazon/Flipkart style Action Button */}
          <Button
            size="sm"
            className={cn(
              "mt-2 w-full h-8 sm:h-9 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5",
              isOutOfStock
                ? "cursor-not-allowed opacity-50 bg-muted text-muted-foreground hover:bg-muted"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isOutOfStock) {
                addItem(product);
              }
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export { formatINR };
export default ProductCard;
