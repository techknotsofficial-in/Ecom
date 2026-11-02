import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  AlertCircle,
  Zap,
  CheckCircle2,
} from "lucide-react";
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

// Helper to extract genuine product highlights from existing database fields
const extractGenuineHighlights = (name: string, desc: string | null, specs: any[]) => {
  const highlights: string[] = [];

  // 1. Check if specifications contain specific highlights
  if (Array.isArray(specs) && specs.length > 0) {
    specs.slice(0, 3).forEach((s) => {
      const val = typeof s === "string" ? s : s.value || s.label;
      if (val && typeof val === "string" && val.length < 35) {
        highlights.push(val);
      }
    });
    if (highlights.length > 0) return highlights.slice(0, 3);
  }

  // 2. Extract genuine hardware characteristics from actual name & description text
  const text = `${name || ""} ${desc || ""}`.toLowerCase();
  if (text.includes("wifi") || text.includes("wi-fi")) highlights.push("Wi-Fi Connectivity");
  if (text.includes("bluetooth")) highlights.push("Bluetooth Supported");
  if (text.includes("3-axis") || text.includes("accelerometer") || text.includes("gyroscope")) {
    highlights.push("3-Axis Motion Sensing");
  }
  if (text.includes("li-ion") || text.includes("lithium-ion") || text.includes("tp 4056")) {
    highlights.push("3.7V Li-ion Battery Charging");
  }
  if (text.includes("relay")) highlights.push("AC/DC Relay Control");
  if (text.includes("temperature") || text.includes("humidity")) {
    highlights.push("Temp & Humidity Sensing");
  }
  if (text.includes("gear motor") || text.includes("bo motor")) {
    highlights.push("High-Torque DC Gear Motor");
  }
  if (text.includes("solar")) highlights.push("Solar Energy Conversion");
  if (text.includes("oled") || text.includes("display")) highlights.push("Digital Graphical Output");
  if (text.includes("ultrasonic")) highlights.push("Ultrasonic Distance Detection");
  if (text.includes("camera") || text.includes("esp 32 cam")) {
    highlights.push("Image & Video Capture");
  }
  if (text.includes("pwm")) highlights.push("Multi-Channel PWM Control");
  if (text.includes("rfid")) highlights.push("Contactless RFID Interface");
  if (text.includes("breadboard") || text.includes("bread board")) {
    highlights.push("Solderless Prototyping");
  }

  return highlights.slice(0, 3);
};

const ProductDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  // Route scroll reset and quantity reset when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setQty(1);
  }, [slug]);

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

  // Extract genuine highlights
  const productHighlights = useMemo(() => {
    if (!product) return [];
    return extractGenuineHighlights(product.name, product.description, parsedSpecs);
  }, [product, parsedSpecs]);

  if (isLoading) {
    return (
      <main className="py-6 sm:py-8 md:py-12 w-full overflow-x-hidden">
        <div className="container px-3 sm:px-6 max-w-6xl">
          <Skeleton className="h-5 w-32 mb-4 rounded" />
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <Skeleton className="h-[260px] sm:h-[320px] lg:h-[420px] w-full rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="py-20 text-center">
        <div className="container px-4">
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

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  const rating = product.rating ?? 0;
  const reviews = product.reviews_count ?? 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product, qty);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addItem(product, qty);
      navigate("/checkout");
    }
  };

  return (
    <main className="py-4 sm:py-6 md:py-10 w-full overflow-x-hidden pb-24 md:pb-12">
      <div className="container px-3 sm:px-6 max-w-6xl">
        {/* Breadcrumb / Back button */}
        <div className="mb-3 sm:mb-5 flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Primary Product Layout: Gallery (Left) & Details (Right) */}
        <div className="grid gap-5 sm:gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12 items-start">
          {/* 1. Image Gallery Column (Constrained height on mobile: 240-280px) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2.5 sm:gap-3.5 min-w-0 w-full"
          >
            {/* Main Image Frame with controlled aspect ratio */}
            <div className="relative h-[230px] sm:h-[280px] md:h-[340px] lg:h-[420px] w-full rounded-xl sm:rounded-2xl border border-border/80 bg-white dark:bg-muted/10 p-3 sm:p-6 flex items-center justify-center overflow-hidden shadow-2xs">
              <img
                src={activeImage}
                alt={product.name}
                className={cn(
                  "h-full w-full object-contain transition-all duration-300",
                  isOutOfStock && "opacity-75 grayscale-[20%]"
                )}
              />

              {/* Badges on image */}
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
                {discount && (
                  <Badge variant="destructive" className="text-[10px] sm:text-xs font-bold shadow-xs">
                    {discount}% OFF
                  </Badge>
                )}
                {product.badge && product.badge !== "sale" && (
                  <Badge className="text-[10px] sm:text-xs font-semibold shadow-xs">
                    {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                  </Badge>
                )}
              </div>

              {isOutOfStock && (
                <span className="absolute top-2.5 right-2.5 rounded bg-muted/95 border border-border text-muted-foreground px-2 py-0.5 text-[10px] sm:text-xs font-semibold backdrop-blur-xs pointer-events-none">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Thumbnail Carousel (compact) */}
            {imageList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {imageList.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg border-2 overflow-hidden bg-white dark:bg-muted/10 p-1 transition-all",
                      activeImage === img
                        ? "border-primary shadow-xs ring-2 ring-primary/20"
                        : "border-border/60 opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Trust Badges below Gallery */}
            <div className="hidden lg:grid grid-cols-1 gap-2 rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs mt-2">
              {[
                { icon: Truck, text: "Free shipping on orders above ₹999" },
                { icon: Shield, text: "100% genuine components & verified quality" },
                { icon: RotateCcw, text: "7-day return policy on eligible electronics" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 2. Product Information Column */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col min-w-0 w-full"
          >
            {/* Title */}
            <h1 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold leading-snug text-foreground">
              {product.name}
            </h1>

            {/* Rating & Stock Availability Row */}
            <div className="mt-2 flex items-center gap-2.5 flex-wrap text-xs">
              {/* Rating */}
              <div className="flex items-center gap-1 shrink-0">
                {rating > 0 ? (
                  <>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.floor(rating)
                              ? "fill-accent text-accent"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground ml-1">{rating.toFixed(1)}</span>
                    {reviews > 0 && (
                      <span className="text-muted-foreground">({reviews} reviews)</span>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground font-medium">New Arrival</span>
                )}
              </div>

              <span className="h-3 w-px bg-border/60" />

              {/* Stock Status */}
              <div className="shrink-0">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Only {product.stock} units left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="mt-3.5 rounded-xl bg-muted/30 border border-border/70 p-3 sm:p-4">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  {formatINR(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-sm sm:text-base text-muted-foreground line-through">
                      {formatINR(product.original_price)}
                    </span>
                    <Badge variant="destructive" className="text-[11px] sm:text-xs font-semibold">
                      Save {formatINR(product.original_price - product.price)} ({discount}% OFF)
                    </Badge>
                  </>
                )}
              </div>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
                Inclusive of all taxes. Free shipping on orders over ₹999.
              </p>
            </div>

            {/* Short Description */}
            {product.description && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Overview
                </h2>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Highlights (2-3 compact tags from real data) */}
            {productHighlights.length > 0 && (
              <div className="mt-3.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Key Highlights
                </h2>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {productHighlights.map((hl) => (
                    <span
                      key={hl}
                      className="inline-flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 text-[11px] font-semibold"
                    >
                      <Zap className="h-3 w-3 shrink-0" />
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop & Tablet Purchase Controls */}
            <div className="mt-5 pt-4 border-t border-border/60">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center rounded-lg border border-border self-start sm:self-auto bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-r-none"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={isOutOfStock || qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-10 text-center font-bold text-xs sm:text-sm">{qty}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-l-none"
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    disabled={isOutOfStock || qty >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 flex-1">
                  <Button
                    size="default"
                    className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="mr-1.5 h-4 w-4" />
                    <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                  </Button>
                  <Button
                    size="default"
                    variant="secondary"
                    className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                  >
                    <Zap className="mr-1.5 h-4 w-4" />
                    <span>Buy Now</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Trust Perks (compact) */}
            <div className="lg:hidden mt-4 grid grid-cols-1 gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
              {[
                { icon: Truck, text: "Free shipping over ₹999" },
                { icon: Shield, text: "100% genuine components" },
                { icon: RotateCcw, text: "7-day return policy" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Icon className="h-3 w-3 text-primary shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 3. Technical Specifications Section */}
        {parsedSpecs.length > 0 && (
          <section className="mt-8 sm:mt-12 border-t border-border/60 pt-6 sm:pt-8">
            <h2 className="mb-3 font-heading text-base sm:text-xl font-bold text-foreground">
              Technical Specifications
            </h2>
            <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
              <div className="divide-y divide-border/60">
                {parsedSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "grid grid-cols-3 sm:grid-cols-4 px-3.5 py-2.5 text-xs sm:text-sm",
                      idx % 2 === 0 ? "bg-muted/20" : "bg-card"
                    )}
                  >
                    <span className="font-semibold text-muted-foreground col-span-1">
                      {spec.label || "Feature"}
                    </span>
                    <span className="font-medium text-foreground col-span-2 sm:col-span-3 break-words">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Related Products Section (2-col mobile, 4-col desktop) */}
        {related.length > 0 && (
          <section className="mt-8 sm:mt-12 md:mt-16 border-t border-border/60 pt-6 sm:pt-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-heading text-base sm:text-xl font-bold text-foreground">
                Related Products
              </h2>
              <Link
                to={`/products?category=${product.category_id}`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View Category
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 5. Sticky Mobile Purchase Bar (Always accessible, respects safe-area insets) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/80 px-3 py-2 shadow-lg flex items-center justify-between gap-2.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Price summary */}
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-muted-foreground font-medium leading-none">Price</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-heading text-base font-bold text-foreground">
              {formatINR(product.price * qty)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[10px] text-muted-foreground line-through">
                {formatINR(product.original_price * qty)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            className="h-8.5 px-3 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8.5 px-3 text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
          >
            <Zap className="h-3.5 w-3.5 mr-1" />
            <span>Buy Now</span>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
