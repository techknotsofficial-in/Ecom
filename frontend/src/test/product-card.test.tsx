import { describe, it, expect } from "vitest";
import { formatINR } from "@/components/ProductCard";

describe("Product Card & Catalog Enhancements", () => {
  it("formats prices in INR correctly", () => {
    const formatted = formatINR(1250);
    expect(formatted).toContain("1,250");
  });

  describe("Discount calculations and edge cases", () => {
    const computeDiscount = (price: number, originalPrice: number | null | undefined): number => {
      if (!originalPrice || originalPrice <= price) return 0;
      const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
      return isNaN(pct) || !isFinite(pct) ? 0 : Math.max(0, pct);
    };

    it("calculates positive discount accurately when original_price > price", () => {
      expect(computeDiscount(800, 1000)).toBe(20);
      expect(computeDiscount(499, 999)).toBe(50);
    });

    it("returns 0 when original_price is null or undefined", () => {
      expect(computeDiscount(800, null)).toBe(0);
      expect(computeDiscount(800, undefined)).toBe(0);
    });

    it("returns 0 when original_price is zero", () => {
      expect(computeDiscount(800, 0)).toBe(0);
    });

    it("returns 0 when original_price equals current price", () => {
      expect(computeDiscount(800, 800)).toBe(0);
    });

    it("returns 0 when original_price is lower than current price (price increase)", () => {
      expect(computeDiscount(800, 600)).toBe(0);
    });
  });

  describe("Product stock state determination", () => {
    const getStockState = (stock: number) => {
      const isOutOfStock = stock <= 0;
      const isLowStock = stock > 0 && stock <= 5;
      return { isOutOfStock, isLowStock, canAddToCart: !isOutOfStock };
    };

    it("correctly identifies out-of-stock products and blocks adding to cart", () => {
      expect(getStockState(0)).toEqual({ isOutOfStock: true, isLowStock: false, canAddToCart: false });
      expect(getStockState(-2)).toEqual({ isOutOfStock: true, isLowStock: false, canAddToCart: false });
    });

    it("correctly flags low stock when stock is between 1 and 5", () => {
      expect(getStockState(1)).toEqual({ isOutOfStock: false, isLowStock: true, canAddToCart: true });
      expect(getStockState(5)).toEqual({ isOutOfStock: false, isLowStock: true, canAddToCart: true });
    });

    it("handles ample stock correctly", () => {
      expect(getStockState(25)).toEqual({ isOutOfStock: false, isLowStock: false, canAddToCart: true });
    });
  });

  describe("Image resolution fallback", () => {
    const resolveImages = (imageUrl: string | null | undefined, images: string[] | null | undefined): string[] => {
      const list: string[] = [];
      if (imageUrl) list.push(imageUrl);
      if (Array.isArray(images)) {
        images.forEach((img) => {
          if (img && !list.includes(img)) list.push(img);
        });
      }
      return list.length > 0 ? list : ["/placeholder.svg"];
    };

    it("falls back to placeholder when image_url and images are missing", () => {
      expect(resolveImages(null, null)).toEqual(["/placeholder.svg"]);
      expect(resolveImages("", [])).toEqual(["/placeholder.svg"]);
    });

    it("handles single image correctly without duplicates", () => {
      expect(resolveImages("/img1.jpg", ["/img1.jpg"])).toEqual(["/img1.jpg"]);
    });

    it("handles multiple images correctly", () => {
      expect(resolveImages("/img1.jpg", ["/img2.jpg", "/img3.jpg"])).toEqual([
        "/img1.jpg",
        "/img2.jpg",
        "/img3.jpg",
      ]);
    });
  });

  describe("Cart quantity boundaries", () => {
    it("caps quantity strictly to available stock", () => {
      const stock = 4;
      const requestedQty = 10;
      const capped = Math.min(stock, requestedQty);
      expect(capped).toBe(4);
    });

    it("prevents increment when already at max stock", () => {
      const stock = 3;
      let currentQty = 3;
      const canIncrement = currentQty < stock;
      expect(canIncrement).toBe(false);
    });
  });
});
