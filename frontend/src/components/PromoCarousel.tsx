import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Cpu, Bot, BatteryCharging } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgType: "image" | "gradient";
  bgImage?: string;
  gradientClass?: string;
  icon: typeof Cpu;
}

const slides: BannerSlide[] = [
  {
    id: "hardware",
    badge: "HARDWARE CATALOG",
    title: "Next-Gen IoT Hardware &",
    highlight: "Dev Boards",
    subtitle: "High-precision microcontrollers, ESP32 boards & sensors for makers and IoT engineers.",
    ctaText: "Shop Components",
    ctaLink: "/products",
    bgType: "image",
    bgImage: heroBg,
    icon: Cpu,
  },
  {
    id: "robotics",
    badge: "ROBOTICS & MOTORS",
    title: "Build Autonomous",
    highlight: "Robotics Kits",
    subtitle: "BO gear motors, L298N drivers, chassis kits & sensors for advanced maker projects.",
    ctaText: "Explore Robotics",
    ctaLink: "/products?category=robotics-kits",
    bgType: "gradient",
    gradientClass: "from-slate-950 via-indigo-950 to-slate-900",
    icon: Bot,
  },
  {
    id: "power",
    badge: "POWER & PROTOTYPING",
    title: "Reliable Power &",
    highlight: "Prototyping Essentials",
    subtitle: "Li-ion TP4056 chargers, solar panels, high-grade breadboards & accessories.",
    ctaText: "Shop Power & Tools",
    ctaLink: "/products?category=power-supply-batteries",
    bgType: "gradient",
    gradientClass: "from-slate-950 via-emerald-950 to-slate-900",
    icon: BatteryCharging,
  },
];

const PromoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const currentSlide = slides[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <section className="w-full pt-3 pb-2 sm:py-4">
      <div className="container px-2 sm:px-4">
        <div
          className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 shadow-sm bg-card h-[175px] sm:h-[240px] md:h-[280px] lg:h-[320px] select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12"
            >
              {/* Background */}
              {currentSlide.bgType === "image" && currentSlide.bgImage ? (
                <div className="absolute inset-0 z-0">
                  <img
                    src={currentSlide.bgImage}
                    alt={currentSlide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
                </div>
              ) : (
                <div
                  className={`absolute inset-0 z-0 bg-gradient-to-r ${currentSlide.gradientClass}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
                </div>
              )}

              {/* Decorative Tech Icon in corner */}
              <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 opacity-10 sm:opacity-20 pointer-events-none text-white">
                <IconComponent className="h-28 w-28 sm:h-48 sm:w-48" />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-xl text-white">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs font-bold tracking-wider text-primary-light uppercase mb-1.5 sm:mb-2.5 backdrop-blur-xs">
                  <IconComponent className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{currentSlide.badge}</span>
                </div>

                {/* Title */}
                <h2 className="font-heading text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white line-clamp-2">
                  {currentSlide.title}{" "}
                  <span className="text-primary-light">{currentSlide.highlight}</span>
                </h2>

                {/* Subtitle */}
                <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm text-white/80 line-clamp-1 sm:line-clamp-2 max-w-md">
                  {currentSlide.subtitle}
                </p>

                {/* CTA Button */}
                <div className="mt-2.5 sm:mt-4">
                  <Button
                    asChild
                    size="sm"
                    className="h-7 sm:h-9 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    <Link to={currentSlide.ctaLink} className="inline-flex items-center gap-1">
                      <span>{currentSlide.ctaText}</span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop Arrow Controls */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? "w-5 sm:w-6 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoCarousel;
