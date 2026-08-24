import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {badge && badgeStyles[badge] && (
          <span
            className={`absolute top-3 left-3 rounded-md px-2.5 py-1 text-xs font-semibold ${badgeStyles[badge]}`}
          >
            {badgeLabels[badge]}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading text-sm font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold">{formatINR(product.price)}</span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatINR(product.original_price)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0 rounded-lg hover:bg-primary hover:text-primary-foreground"
            onClick={() => addItem(product)}
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
