import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { ArrowRight, Activity, Cpu, Package, Bot, Layers, GraduationCap, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Cpu,
  Package,
  Bot,
  Layers,
  GraduationCap,
  Tag,
};

const CategorySection = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
            Shop by Category
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            From tiny sensors to complete robotics kits — find exactly what your project needs.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const Icon = (cat.icon_name && iconMap[cat.icon_name]) || Tag;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full min-w-0"
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="group flex w-full min-w-0 items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-base font-semibold truncate">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{cat.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
