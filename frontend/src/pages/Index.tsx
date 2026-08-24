import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import { useFeaturedProducts, useBestSellers } from "@/hooks/useProducts";
import { Truck, Shield, Headphones, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Truck, label: "Free Shipping", desc: "On orders above ₹999" },
  { icon: Shield, label: "Secure Payment", desc: "UPI, Cards & Net Banking" },
  { icon: Headphones, label: "Expert Support", desc: "Mon-Sat, 9AM-8PM" },
  { icon: RotateCcw, label: "Easy Returns", desc: "7-day return policy" },
];

const Index = () => {
  const { data: featured = [], isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellers = [], isLoading: bestSellersLoading } = useBestSellers();

  return (
    <main>
      <Hero />

      {/* Trust Bar */}
      <section className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <f.icon className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CategorySection />

      <div className="border-t border-border" />

      <FeaturedProducts
        title="Featured Products"
        subtitle="Hand-picked components for your next IoT project"
        products={featured}
        isLoading={featuredLoading}
      />

      <div className="border-t border-border" />

      <FeaturedProducts
        title="Best Sellers"
        subtitle="Top-rated by our community of makers and engineers"
        products={bestSellers}
        isLoading={bestSellersLoading}
      />

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
              Ready to Build Something Amazing?
            </h2>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
              Join 10,000+ makers, students, and engineers who trust Volkitz for their electronics needs.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start Shopping
              </a>
              <a
                href="/products?category=courses"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-8 py-3 font-medium transition-colors hover:bg-muted"
              >
                Explore Courses
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Index;
