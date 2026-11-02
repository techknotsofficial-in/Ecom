import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { formatINR } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProductBySlug(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  // Gallery image handling
  const imageList = useMemo(() => {
    const list: string[] = [];
    if (product?.image_url) list.push(product.image_url);
    if (Array.isArray(product?.images)) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ["/placeholder.svg"];
  }, [product]);

  const [activeImage, setActiveImage] = useState<string>(imageList[0]);

  useEffect(() => {
    if (imageList[0]) setActiveImage(imageList[0]);
  }, [imageList]);

  // Specifications parser supporting objects, key-value pairs, and string arrays
  const parsedSpecs = useMemo(() => {
    if (!product?.specifications) return [];
    const raw = product.specifications;
    if (Array.isArray(raw)) {
      return raw.map((item) => {
        if (typeof item === "string") return { label: null, value: item };
        if (item && typeof item === "object") {
          const label = item.label || item.key || item.name || Object.keys(item)[0];
          const value = item.value || (label ? item[label] : JSON.stringify(item));
          return { label: label || null, value: String(value) };
        }
        return { label: null, value: String(item) };
      });
    }
    if (typeof raw === "object") {
      return Object.entries(raw).map(([k, v]) => ({
        label: k,
        value: typeof v === "object" ? JSON.stringify(v) : String(v),
      }));
    }
    return [{ label: null, value: String(raw) }];
  }, [product]);

  if (isLoading) {
    return (
      <main className="py-8 md:py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="py-20 text-center">
        <div className="container">
          <h1 className="mb-4 font-heading text-2xl font-bold">Product Not Found</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </main>
    );
  }

  const related = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const rating = product.rating ?? 0;
  const reviews = product.reviews_count ?? 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <main className="py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb / Back button */}
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Image Gallery Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-3"
          >
            {/* Main Image Frame */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted/20 p-6 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                className={cn(
                  "h-full w-full object-contain transition-all duration-300",
                  isOutOfStock && "opacity-75 grayscale-[20%]"
                )}
              />
              {product.badge && (
                <Badge
                  className="absolute top-4 left-4 text-xs font-semibold"
                  variant={product.badge === "sale" ? "destructive" : "default"}
                >
                  {product.badge === "sale"
                    ? (discount ? `${discount}% OFF` : "Sale")
                    : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                </Badge>
              )}
              {isOutOfStock && (
                <span className="absolute top-4 right-4 rounded-md bg-destructive text-destructive-foreground px-2.5 py-1 text-xs font-semibold shadow-xs">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {imageList.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
                {imageList.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "h-16 w-16 shrink-0 rounded-lg border-2 overflow-hidden bg-muted/20 p-1.5 transition-all",
                      activeImage === img
                        ? "border-primary shadow-xs ring-2 ring-primary/20"
                        : "border-border/60 opacity-70 hover:opacity-100 hover:border-border"
                    )}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="mb-3 font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* Rating and Stock Pill */}
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold ml-1">
                  {rating > 0 ? rating.toFixed(1) : "New"}
                </span>
                {reviews > 0 && (
                  <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
                )}
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Stock Status Badge */}
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Currently Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Only {product.stock} units left — order soon
                </span>
              ) : (
                <span className="text-xs font-semibold text-primary">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="mb-6 rounded-xl bg-muted/30 border border-border/50 p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                  {formatINR(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatINR(product.original_price)}
                    </span>
                    <Badge variant="destructive" className="text-xs font-semibold">
                      Save {formatINR(product.original_price - product.price)} ({discount}% OFF)
                    </Badge>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Inclusive of all taxes. Free shipping on orders over ₹999.
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Specifications Grid */}
            {parsedSpecs.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Technical Specifications
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {parsedSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-muted/40 border border-border/40 px-3 py-2 text-xs sm:text-sm flex flex-col justify-center"
                    >
                      {spec.label ? (
                        <>
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                            {spec.label}
                          </span>
                          <span className="font-mono font-medium text-foreground mt-0.5 break-words">
                            {spec.value}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 font-mono">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span className="break-words">{spec.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart Action */}
            <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center rounded-lg border border-border self-start sm:self-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-r-none"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={isOutOfStock || qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-sm">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-l-none"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={isOutOfStock || qty >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1 h-11 text-base font-medium"
                onClick={() => {
                  if (!isOutOfStock) addItem(product, qty);
                }}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2.5 rounded-xl border border-border/60 bg-card p-4">
              {[
                { icon: Truck, text: "Free shipping on orders above ₹999" },
                { icon: Shield, text: "Genuine components & verified quality" },
                { icon: RotateCcw, text: "7-day return policy on eligible items" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-border/50 pt-12">
            <h2 className="mb-6 font-heading text-2xl font-bold">
              Related Products
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
