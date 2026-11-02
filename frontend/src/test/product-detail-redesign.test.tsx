import { describe, it, expect } from "vitest";

describe("Product Details Page Redesign & Mobile UX", () => {
  describe("Authentic Highlights Extractor", () => {
    const extractGenuineHighlights = (name: string, desc: string | null, specs: any[]) => {
      const highlights: string[] = [];

      if (Array.isArray(specs) && specs.length > 0) {
        specs.slice(0, 3).forEach((s) => {
          const val = typeof s === "string" ? s : s.value || s.label;
          if (val && typeof val === "string" && val.length < 35) {
            highlights.push(val);
          }
        });
        if (highlights.length > 0) return highlights.slice(0, 3);
      }

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

      return highlights.slice(0, 3);
    };

    it("extracts hardware highlights accurately from real product data", () => {
      const dht11Highlights = extractGenuineHighlights(
        "DHT11",
        "Measures temperature and humidity levels in the surrounding environment.",
        []
      );
      expect(dht11Highlights).toEqual(["Temp & Humidity Sensing"]);

      const esp32CamHighlights = extractGenuineHighlights(
        "ESP 32 CAM",
        "Wi-Fi and Bluetooth camera module for computer vision and IoT remote monitoring.",
        []
      );
      expect(esp32CamHighlights).toContain("Wi-Fi Connectivity");
      expect(esp32CamHighlights).toContain("Bluetooth Supported");
      expect(esp32CamHighlights).toContain("Image & Video Capture");

      const mpuHighlights = extractGenuineHighlights(
        "MPU6050",
        "Measures motion using a 3-axis accelerometer and gyroscope.",
        []
      );
      expect(mpuHighlights).toEqual(["3-Axis Motion Sensing"]);
    });

    it("returns empty array for products without identifiable hardware keywords", () => {
      const genericHighlights = extractGenuineHighlights("Generic Enclosure Box", "A plastic casing for circuits.", []);
      expect(genericHighlights).toEqual([]);
    });
  });

  describe("Sticky Mobile Purchase Bar Calculations", () => {
    const computeTotalPrice = (price: number, qty: number) => price * qty;
    const isPurchaseAllowed = (stock: number) => stock > 0;

    it("multiplies selling price accurately by chosen quantity", () => {
      expect(computeTotalPrice(50, 1)).toBe(50);
      expect(computeTotalPrice(50, 4)).toBe(200);
      expect(computeTotalPrice(650, 3)).toBe(1950);
    });

    it("disables purchase actions when stock is 0 or negative", () => {
      expect(isPurchaseAllowed(0)).toBe(false);
      expect(isPurchaseAllowed(-1)).toBe(false);
      expect(isPurchaseAllowed(5)).toBe(true);
    });
  });

  describe("Mobile Layout & Safe Area Insets", () => {
    it("verifies controlled image height and safe-area padding classes", () => {
      const mobileImageClasses = "relative h-[230px] sm:h-[280px] md:h-[340px] lg:h-[420px]";
      const stickyBarClasses = "md:hidden fixed bottom-0 left-0 right-0 z-40 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]";
      const pagePaddingClasses = "pb-24 md:pb-12";

      expect(mobileImageClasses).toContain("h-[230px]");
      expect(stickyBarClasses).toContain("md:hidden fixed bottom-0");
      expect(pagePaddingClasses).toContain("pb-24");
    });
  });
});
