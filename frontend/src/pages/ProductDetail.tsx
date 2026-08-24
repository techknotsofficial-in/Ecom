import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { formatINR } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProductBySlug(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

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

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const rating = product.rating ?? 0;
  const reviews = product.reviews_count ?? 0;
  const imageUrl = product.image_url || "/placeholder.svg";
  const specs = Array.isArray(product.specifications) ? product.specifications : [];

  return (
    <main className="py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square overflow-hidden rounded-2xl bg-muted"
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <Badge
                className="absolute top-4 left-4"
                variant={product.badge === "sale" ? "destructive" : "default"}
              >
                {product.badge === "sale"
                  ? `${discount}% OFF`
                  : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
              </Badge>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-2">
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
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-sm text-muted-foreground">
                ({reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold">
                {formatINR(product.price)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatINR(product.original_price)}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Save {formatINR(product.original_price - product.price)}
                  </Badge>
                </>
              )}
            </div>

            <p className="mb-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            {specs.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {specs.map((spec: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-muted px-3 py-2 text-sm font-mono"
                    >
                      {typeof spec === "string" ? spec : JSON.stringify(spec)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-sm font-medium text-primary">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-sm font-medium text-destructive">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1"
                onClick={() => addItem(product, qty)}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>

            {/* Trust badges */}
            <div className="space-y-3 rounded-xl border border-border p-4">
              {[
                { icon: Truck, text: "Free shipping on orders above ₹999" },
                { icon: Shield, text: "Genuine products with warranty" },
                { icon: RotateCcw, text: "7-day easy return policy" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="mb-8 font-heading text-2xl font-bold">
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
