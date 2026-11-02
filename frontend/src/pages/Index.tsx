import { useFeaturedProducts, useBestSellers, useNewArrivals, useRoboticsAndKits } from "@/hooks/useProducts";
import CategoryNavScroll from "@/components/CategoryNavScroll";
import PromoCarousel from "@/components/PromoCarousel";
import CategoryTiles from "@/components/CategoryTiles";
import ProductShowcaseSection from "@/components/ProductShowcaseSection";
import { Truck, ShieldCheck, Headphones, RotateCcw, Sparkles, Flame, Zap, Bot, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const trustFeatures = [
  { icon: Truck, label: "Free Shipping", desc: "On orders above ₹999" },
  { icon: ShieldCheck, label: "100% Genuine", desc: "Tested components" },
  { icon: Headphones, label: "Maker Support", desc: "Mon-Sat, 9AM-8PM" },
  { icon: RotateCcw, label: "Easy Returns", desc: "7-day return policy" },
];

const Index = () => {
  const { data: featured = [], isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellers = [], isLoading: bestSellersLoading } = useBestSellers();
  const { data: newArrivals = [], isLoading: newArrivalsLoading } = useNewArrivals();
  const { data: roboticsKits = [], isLoading: roboticsLoading } = useRoboticsAndKits();

  return (
    <main className="w-full overflow-x-hidden pb-8">
      {/* 1. Horizontal Category Navigation Bar */}
      <CategoryNavScroll />

      {/* 2. Promotional Banner Carousel */}
      <PromoCarousel />

      {/* 3. Visual Category Tiles Grid */}
      <CategoryTiles />

      {/* Trust Perks Bar */}
      <section className="border-y border-border/60 bg-muted/30 py-3 sm:py-4">
        <div className="container px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {trustFeatures.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 sm:gap-3 min-w-0 p-1"
              >
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold truncate leading-tight text-foreground">
                    {f.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate leading-tight mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Product Showcase Section 1: Featured Products */}
      <ProductShowcaseSection
        title="Featured Products"
        subtitle="Hand-picked components for your next IoT and electronics project"
        badge="Popular"
        icon={Sparkles}
        products={featured}
        isLoading={featuredLoading}
        viewAllLink="/products"
      />

      {/* 5. Product Showcase Section 2: Best Sellers */}
      <ProductShowcaseSection
        title="Best Sellers"
        subtitle="Top-rated modules, sensors and boards trusted by makers"
        badge="Hot"
        icon={Flame}
        products={bestSellers}
        isLoading={bestSellersLoading}
        viewAllLink="/products"
      />

      {/* 6. Product Showcase Section 3: New Arrivals */}
      <ProductShowcaseSection
        title="New Arrivals"
        subtitle="Freshly stocked microcontrollers, breakout boards and parts"
        badge="Fresh"
        icon={Zap}
        products={newArrivals}
        isLoading={newArrivalsLoading}
        viewAllLink="/products"
      />

      {/* 7. Product Showcase Section 4: Robotics & IoT Kits */}
      <ProductShowcaseSection
        title="Robotics & Starter Kits"
        subtitle="Motors, motor drivers, chassis and smart kits to build autonomous systems"
        badge="Build"
        icon={Bot}
        products={roboticsKits}
        isLoading={roboticsLoading}
        viewAllLink="/products?category=robotics-kits"
      />

      {/* 8. Additional Discovery / Maker Community Banner */}
      <section className="py-8 sm:py-12">
        <div className="container px-2 sm:px-4">
          <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 text-center shadow-xs">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Volkitz Maker Network</span>
              </span>
              <h2 className="font-heading text-xl sm:text-3xl font-bold tracking-tight text-foreground">
                Ready to Build Your Next Creation?
              </h2>
              <p className="mt-2 text-xs sm:text-base text-muted-foreground leading-relaxed">
                Join 10,000+ engineers, students, and makers building smart IoT hardware, robotics, and automation projects.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-none mx-auto">
                <Button asChild size="default" className="text-xs sm:text-sm font-semibold">
                  <Link to="/products" className="inline-flex items-center justify-center gap-1.5">
                    <span>Explore All Products</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="text-xs sm:text-sm font-semibold">
                  <Link to="/products?category=development-boards">
                    Development Boards
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
