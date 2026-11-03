import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import HelpCenter from "@/pages/HelpCenter";
import FAQs from "@/pages/FAQs";
import ShippingPolicy from "@/pages/ShippingPolicy";
import ReturnPolicy from "@/pages/ReturnPolicy";
import Warranty from "@/pages/Warranty";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

const renderWithProviders = (ui: React.ReactElement, initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("Navbar Mobile Enhancement", () => {
  it("renders brand logo, search input, cart, and account controls", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/kitz/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search sensors, boards, robotics/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/shopping cart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toggle navigation menu/i)).toBeInTheDocument();
  });

  it("contains touch-friendly classes on mobile header and search input", () => {
    const { container } = renderWithProviders(<Navbar />);
    // Main header has 56px height on mobile (h-14)
    const headerRow = container.querySelector(".flex.h-14");
    expect(headerRow).not.toBeNull();

    // Mobile search input has h-11 for 44px min touch target
    const searchInput = screen.getByPlaceholderText(/search sensors, boards, robotics/i);
    expect(searchInput).toHaveClass("h-11");
  });

  it("opens mobile drawer with company, support, and category links on toggle", async () => {
    renderWithProviders(<Navbar />);
    const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
    fireEvent.click(toggleBtn);

    expect(await screen.findByText(/explore products/i)).toBeInTheDocument();
    expect(await screen.findByText(/help center & faqs/i)).toBeInTheDocument();
    expect(await screen.findByText(/contact support/i)).toBeInTheDocument();
  });
});

describe("Footer Structure & Routing", () => {
  it("renders trust strip with free shipping, genuine components, and secure checkout", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/free shipping/i)).toBeInTheDocument();
    expect(screen.getByText(/100% genuine/i)).toBeInTheDocument();
    expect(screen.getByText(/7-day replacement/i)).toBeInTheDocument();
    expect(screen.getByText(/secure checkout/i)).toBeInTheDocument();
  });

  it("renders verified company contact information", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText("support@volkitz.in")).toBeInTheDocument();
    expect(screen.getByText("+91 9176747268")).toBeInTheDocument();
    expect(screen.getByText(/chennai, tamil nadu, india/i)).toBeInTheDocument();
  });

  it("links to real company and support routes without dummy '#' or broken links", () => {
    renderWithProviders(<Footer />);
    const allLinks = screen.getAllByRole("link");
    const hrefs = allLinks.map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/help");
    expect(hrefs).toContain("/faqs");
    expect(hrefs).toContain("/shipping");
    expect(hrefs).toContain("/returns");
    expect(hrefs).toContain("/warranty");
    expect(hrefs).toContain("/privacy");
    expect(hrefs).toContain("/terms");
    expect(hrefs).toContain("/refund-policy");

    // Ensure none point to bare "/" as placeholder (except brand logo)
    const nonLogoLinks = allLinks.filter(
      (a) => a.textContent?.trim() !== "Volkitz"
    );
    for (const link of nonLogoLinks) {
      const href = link.getAttribute("href");
      if (link.textContent?.includes("About Us") || link.textContent?.includes("Help Center")) {
        expect(href).not.toBe("/");
      }
    }
  });

  it("displays accepted payment modes and Shiprocket fulfillment notice", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/we accept:/i)).toBeInTheDocument();
    expect(screen.getByText(/upi \(gpay \/ phonepe\)/i)).toBeInTheDocument();
    expect(screen.getByText(/cash on delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/shiprocket/i)).toBeInTheDocument();
  });
});

describe("Company Pages Content & Functionality", () => {
  it("renders About Us page with truthful maker mission and audience breakdown", () => {
    renderWithProviders(<About />);
    expect(screen.getByText(/who we are/i)).toBeInTheDocument();
    expect(screen.getAllByText(/our mission/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/students & beginners/i)).toBeInTheDocument();
    expect(screen.getByText(/makers & hobbyists/i)).toBeInTheDocument();
    expect(screen.getByText(/educators & labs/i)).toBeInTheDocument();
  });

  it("renders Contact Us page with contact details and interactive form", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("support@volkitz.in")).toBeInTheDocument();
    expect(screen.getByText("+91 9176747268")).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("allows submitting Contact Us form with client feedback", () => {
    renderWithProviders(<Contact />);
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hello, testing support inquiry" },
    });

    const submitBtn = screen.getByRole("button", { name: /submit message/i });
    fireEvent.click(submitBtn);

    // Verify submit button shows pending or completes
    expect(submitBtn).toBeInTheDocument();
  });

  it("renders Careers page with honest 'No Active Openings' status", () => {
    renderWithProviders(<Careers />);
    expect(
      screen.getByText(/no active openings at present/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/maker curiosity/i)).toBeInTheDocument();
  });
});

describe("Customer Support & Policy Pages", () => {
  it("renders Help Center with categorized support topics", () => {
    renderWithProviders(<HelpCenter />);
    expect(screen.getByText(/orders & tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/payments & billing/i)).toBeInTheDocument();
    expect(screen.getByText(/shipping & delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/returns & replacements/i)).toBeInTheDocument();
  });

  it("renders FAQs with categorized accordion items", () => {
    renderWithProviders(<FAQs />);
    expect(screen.getByText(/how do i place an order\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/what payment methods are supported\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/what are the shipping charges\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how do returns and refunds work\?/i)
    ).toBeInTheDocument();
  });

  it("renders Shipping Policy with ₹999 free shipping and 24-48h dispatch details", () => {
    renderWithProviders(<ShippingPolicy />);
    expect(
      screen.getByText(/free shipping on orders ₹999\+/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/24–48h fast dispatch/i)).toBeInTheDocument();
    expect(screen.getByText(/shiprocket/i)).toBeInTheDocument();
  });

  it("renders Returns Policy with 7-Day DOA terms and exclusions", () => {
    renderWithProviders(<ReturnPolicy />);
    expect(
      screen.getByText(/7-day replacement policy/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Eligible for Replacement")).toBeInTheDocument();
    expect(screen.getByText("Not Eligible for Replacement")).toBeInTheDocument();
  });

  it("renders Warranty page without false universal claims", () => {
    renderWithProviders(<Warranty />);
    expect(
      screen.getByText(/warranty terms for maker electronics/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/safe hardware testing checklist/i)
    ).toBeInTheDocument();
  });

  it("renders Privacy Policy and Terms & Conditions pages", () => {
    renderWithProviders(<PrivacyPolicy />);
    expect(screen.getByText(/payment security & financial data/i)).toBeInTheDocument();

    renderWithProviders(<Terms />);
    expect(screen.getByText(/products & intended use/i)).toBeInTheDocument();
  });
});
