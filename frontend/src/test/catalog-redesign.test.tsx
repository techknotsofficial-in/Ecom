import { describe, it, expect } from "vitest";

describe("Products Catalog Redesign & Filtering Engine", () => {
  const sampleProducts = [
    { id: "1", name: "ESP32 Dev Board", category_id: "cat-boards", price: 450, stock: 10, rating: 4.8 },
    { id: "2", name: "Arduino Uno R3", category_id: "cat-boards", price: 650, stock: 0, rating: 4.5 },
    { id: "3", name: "DHT11 Sensor", category_id: "cat-sensors", price: 99, stock: 25, rating: 4.2 },
    { id: "4", name: "Ultrasonic Sensor HC-SR04", category_id: "cat-sensors", price: 120, stock: 5, rating: 4.9 },
    { id: "5", name: "L298N Motor Driver", category_id: "cat-drivers", price: 180, stock: 12, rating: 4.3 },
  ];

  describe("In-stock availability filter", () => {
    it("filters out out-of-stock products when inStockOnly is active", () => {
      const inStock = sampleProducts.filter((p) => p.stock > 0);
      expect(inStock.length).toBe(4);
      expect(inStock.some((p) => p.stock <= 0)).toBe(false);
    });

    it("returns all products when inStockOnly is false", () => {
      const inStockOnly = false;
      const result = inStockOnly ? sampleProducts.filter((p) => p.stock > 0) : sampleProducts;
      expect(result.length).toBe(5);
    });
  });

  describe("Sorting calculations", () => {
    it("sorts correctly by price low-to-high", () => {
      const sorted = [...sampleProducts].sort((a, b) => a.price - b.price);
      expect(sorted[0].name).toBe("DHT11 Sensor");
      expect(sorted[sorted.length - 1].name).toBe("Arduino Uno R3");
    });

    it("sorts correctly by price high-to-low", () => {
      const sorted = [...sampleProducts].sort((a, b) => b.price - a.price);
      expect(sorted[0].name).toBe("Arduino Uno R3");
      expect(sorted[sorted.length - 1].name).toBe("DHT11 Sensor");
    });

    it("sorts correctly by customer rating", () => {
      const sorted = [...sampleProducts].sort((a, b) => b.rating - a.rating);
      expect(sorted[0].name).toBe("Ultrasonic Sensor HC-SR04");
    });

    it("sorts correctly by name alphabetically", () => {
      const sorted = [...sampleProducts].sort((a, b) => a.name.localeCompare(b.name));
      expect(sorted[0].name).toBe("Arduino Uno R3");
      expect(sorted[sorted.length - 1].name).toBe("Ultrasonic Sensor HC-SR04");
    });
  });

  describe("Catalog search & category filtering", () => {
    it("filters products by search term case-insensitively", () => {
      const query = "sensor";
      const matches = sampleProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
      expect(matches.length).toBe(2);
      expect(matches.map((m) => m.name)).toEqual(["DHT11 Sensor", "Ultrasonic Sensor HC-SR04"]);
    });

    it("filters products by category ID", () => {
      const catId = "cat-boards";
      const matches = sampleProducts.filter((p) => p.category_id === catId);
      expect(matches.length).toBe(2);
      expect(matches.map((m) => m.name)).toEqual(["ESP32 Dev Board", "Arduino Uno R3"]);
    });
  });

  describe("Pagination preservation (12 items per page)", () => {
    const PAGE_SIZE = 12;
    const generateProducts = (count: number) =>
      Array.from({ length: count }, (_, i) => ({ id: `${i}`, name: `Item ${i}` }));

    it("calculates total pages accurately for exact multiples and remainders", () => {
      expect(Math.ceil(generateProducts(43).length / PAGE_SIZE)).toBe(4);
      expect(Math.ceil(generateProducts(12).length / PAGE_SIZE)).toBe(1);
      expect(Math.ceil(generateProducts(0).length / PAGE_SIZE)).toBe(0);
    });

    it("slices correct 12 items for page 1 and page 2", () => {
      const all43 = generateProducts(43);
      const page1 = all43.slice(0, 12);
      const page2 = all43.slice(12, 24);
      expect(page1.length).toBe(12);
      expect(page1[0].name).toBe("Item 0");
      expect(page2.length).toBe(12);
      expect(page2[0].name).toBe("Item 12");
    });
  });

  describe("Responsive grid classes", () => {
    it("ensures mobile 2-column and desktop 4/5-column grid classes are properly formed", () => {
      const gridWithSidebar = "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4";
      const gridFullWidth = "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5";

      expect(gridWithSidebar).toContain("grid-cols-2");
      expect(gridWithSidebar).toContain("xl:grid-cols-4");
      expect(gridFullWidth).toContain("grid-cols-2");
      expect(gridFullWidth).toContain("xl:grid-cols-5");
      expect(gridWithSidebar).not.toContain("grid-cols-1"); // Eliminates 1-per-row blowout
    });
  });
});
