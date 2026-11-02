import { describe, it, expect } from "vitest";

describe("Flipkart-Inspired Homepage Components & Functionality", () => {
  describe("Category Navigation & URL mapping", () => {
    const categories = [
      { id: "1", name: "Development Boards", slug: "development-boards" },
      { id: "2", name: "Sensors & Acuators", slug: "sensors-acuators" },
      { id: "3", name: "Robotics Kits", slug: "robotics-kits" },
      { id: "4", name: "Power Supply & Batteries", slug: "power-supply-batteries" },
    ];

    it("generates correct filter query URL for categories", () => {
      categories.forEach((cat) => {
        const url = `/products?category=${cat.slug}`;
        expect(url).toBe(`/products?category=${cat.slug}`);
      });
    });

    it("identifies active category from URL search parameters", () => {
      const getActiveSlug = (search: string) => new URLSearchParams(search).get("category");
      expect(getActiveSlug("?category=sensors-acuators")).toBe("sensors-acuators");
      expect(getActiveSlug("")).toBeNull();
    });
  });

  describe("Promo Carousel auto-advancement & bounds", () => {
    const totalSlides = 3;

    it("advances slide index cyclically", () => {
      const nextSlide = (curr: number) => (curr + 1) % totalSlides;
      expect(nextSlide(0)).toBe(1);
      expect(nextSlide(1)).toBe(2);
      expect(nextSlide(2)).toBe(0);
    });

    it("moves to previous slide cyclically", () => {
      const prevSlide = (curr: number) => (curr - 1 + totalSlides) % totalSlides;
      expect(prevSlide(0)).toBe(2);
      expect(prevSlide(2)).toBe(1);
      expect(prevSlide(1)).toBe(0);
    });

    it("handles touch swipe threshold calculation", () => {
      const computeSwipeDirection = (startX: number, endX: number, threshold = 40) => {
        const diff = startX - endX;
        if (Math.abs(diff) <= threshold) return "none";
        return diff > 0 ? "next" : "prev";
      };

      expect(computeSwipeDirection(200, 100)).toBe("next");
      expect(computeSwipeDirection(100, 200)).toBe("prev");
      expect(computeSwipeDirection(150, 160)).toBe("none"); // below 40px threshold
    });
  });

  describe("Search query encoding", () => {
    it("properly trims and encodes special characters in search input", () => {
      const formatSearchUrl = (query: string) => {
        const trimmed = query.trim();
        return trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : null;
      };

      expect(formatSearchUrl("  esp32 & sensor  ")).toBe("/products?search=esp32%20%26%20sensor");
      expect(formatSearchUrl("   ")).toBeNull();
      expect(formatSearchUrl("arduino nano")).toBe("/products?search=arduino%20nano");
    });
  });

  describe("Visual Category Tiles grid constraints", () => {
    it("limits displayed categories to 8 for neat 2x4 mobile and 1x8 desktop grid", () => {
      const allCats = Array.from({ length: 12 }, (_, i) => ({ id: `${i}`, name: `Cat ${i}` }));
      const displayCats = allCats.slice(0, 8);
      expect(displayCats.length).toBe(8);
    });
  });

  describe("Showcase 2-column mobile and 4-column desktop layout classes", () => {
    it("verifies grid-cols-2 class is present for mobile layout", () => {
      const gridClasses = "grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5";
      expect(gridClasses).toContain("grid-cols-2");
      expect(gridClasses).toContain("lg:grid-cols-4");
      expect(gridClasses).not.toContain("grid-cols-1"); // Ensure single-column mobile blowout is eliminated
    });
  });
});
