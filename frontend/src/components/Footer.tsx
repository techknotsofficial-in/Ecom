import { Link } from "react-router-dom";
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronRight,
} from "lucide-react";

const footerSections = {
  company: [
    { label: "About Us", to: "/about" },
    { label: "Our Mission", to: "/about#mission" },
    { label: "Contact Us", to: "/contact" },
    { label: "Careers", to: "/careers" },
  ],
  support: [
    { label: "Help Center", to: "/help" },
    { label: "FAQs", to: "/faqs" },
    { label: "Shipping & Delivery", to: "/shipping" },
    { label: "Returns & Refunds", to: "/returns" },
    { label: "Warranty Information", to: "/warranty" },
    { label: "Contact Support", to: "/contact" },
  ],
  shopping: [
    { label: "All Products", to: "/products" },
    { label: "Development Boards", to: "/products?category=development-boards" },
    { label: "Sensors & Modules", to: "/products?category=sensors" },
    { label: "IoT Kits & Robotics", to: "/products?category=kits" },
    { label: "Courses & Tutorials", to: "/products?category=courses" },
  ],
  policies: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Shipping Policy", to: "/shipping" },
    { label: "Cancellation & Refund Policy", to: "/refund-policy" },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      {/* Trust & Highlights Strip */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="container px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On all orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">100% Genuine</p>
                <p className="text-xs text-muted-foreground">Verified maker components</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">7-Day Replacement</p>
                <p className="text-xs text-muted-foreground">For DOA & transit damages</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking & COD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Company Details */}
      <div className="container px-4 py-10 sm:py-14">
        <div className="grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Contact Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 inline-flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs group-hover:scale-105 transition-transform">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">
                Vol<span className="text-primary">kitz</span>
              </span>
            </Link>
            <p className="mb-5 text-sm text-muted-foreground leading-relaxed max-w-sm">
              India's trusted maker store for genuine IoT components, sensors, microcontrollers, development boards, and robotics. Empowering students, developers, and educators.
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:support@volkitz.in"
                  className="hover:text-primary transition-colors"
                >
                  support@volkitz.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="tel:+919176747268"
                  className="hover:text-primary transition-colors"
                >
                  +91 9176747268
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>Mon – Sat: 9:00 AM – 6:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column: Shopping */}
          <div>
            <h4 className="mb-4 font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground">
              Shopping
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerSections.shopping.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary -ml-3 group-hover:ml-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Column */}
          <div>
            <h4 className="mb-4 font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerSections.support.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary -ml-3 group-hover:ml-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Policies Column */}
          <div>
            <h4 className="mb-4 font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground">
              Company & Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerSections.company.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary -ml-3 group-hover:ml-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <div className="my-2 border-t border-border/40" />
              {footerSections.policies.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary -ml-3 group-hover:ml-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Payment Methods, Logistics */}
        <div className="mt-12 border-t border-border/70 pt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © 2026 Volkitz (IoT Haven). All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">We Accept:</span>
            <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/60">UPI (GPay / PhonePe)</span>
            <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/60">Cards (Visa / MC / RuPay)</span>
            <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/60">Net Banking</span>
            <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/60">Cash on Delivery</span>
          </div>

          <div className="text-xs text-muted-foreground">
            <span>Fulfilled via <strong>Shiprocket</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
