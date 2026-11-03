import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import {
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Cpu,
  UserCheck,
  HelpCircle,
  PhoneCall,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const supportCategories = [
  {
    icon: Package,
    title: "Orders & Tracking",
    description: "Track shipment progress, view order history, or understand order status updates.",
    links: [
      { label: "View My Orders", to: "/dashboard" },
      { label: "Track Shipment via Shiprocket", to: "/faqs#tracking" },
      { label: "Cancellation Guidelines", to: "/faqs#cancellation" },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description: "Information about UPI, Card payments, Net Banking, COD, and invoices.",
    links: [
      { label: "Accepted Payment Modes", to: "/faqs#payments" },
      { label: "Razorpay Security Information", to: "/faqs#security" },
      { label: "Invoices & GST Details", to: "/terms#billing" },
    ],
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Delivery timelines, flat shipping rates, and free shipping on orders over ₹999.",
    links: [
      { label: "Read Shipping Policy", to: "/shipping" },
      { label: "Delivery Timelines & Pincodes", to: "/shipping#timelines" },
      { label: "Packaging Standards", to: "/shipping#packaging" },
    ],
  },
  {
    icon: RotateCcw,
    title: "Returns & Replacements",
    description: "7-day replacement guarantee for Dead On Arrival (DOA) or transit-damaged items.",
    links: [
      { label: "Return Eligibility Policy", to: "/returns" },
      { label: "How to File a DOA Claim", to: "/returns#claim" },
      { label: "Refund Timeline", to: "/refund-policy" },
    ],
  },
  {
    icon: Cpu,
    title: "Components & Tech Specs",
    description: "Datasheets, pinout diagrams, 3.3V vs 5V logic compatibility, and hardware help.",
    links: [
      { label: "Browse Product Specs", to: "/products" },
      { label: "Hardware Best Practices", to: "/warranty#guidelines" },
      { label: "Ask a Tech Question", to: "/contact" },
    ],
  },
  {
    icon: UserCheck,
    title: "Account & Profile",
    description: "Manage delivery addresses, password recovery, and order history.",
    links: [
      { label: "Go to Dashboard", to: "/dashboard" },
      { label: "Update Saved Address", to: "/dashboard" },
      { label: "Sign In / Register", to: "/auth" },
    ],
  },
];

const HelpCenter = () => {
  return (
    <PageShell
      badge="Support Hub"
      title="Help Center"
      description="Find answers, explore policies, or reach out to our customer care team for quick assistance."
      category="Customer Support"
    >
      <div className="space-y-12">
        {/* Quick Search & Common Inquiries Banner */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-muted/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <HelpCircle className="h-4 w-4" />
              <span>Need Quick Answers?</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We have compiled direct answers covering order placement, payment safety, shipping timelines, and our 7-day replacement guarantee.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button asChild className="gap-2">
              <Link to="/faqs">
                <span>Browse FAQs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/contact">
                <PhoneCall className="h-4 w-4" />
                <span>Contact Us</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 6 Core Categories Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              Browse by Support Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Select a category to find specific guidance and answers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="p-6 rounded-xl border border-border/70 bg-card flex flex-col justify-between hover:border-primary/40 transition-colors shadow-2xs"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {cat.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-border/50 text-xs">
                    {cat.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Direct Contact Banner */}
        <section className="p-6 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">
              Still Can't Find What You're Looking For?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Email our support team at <strong className="text-foreground">support@volkitz.in</strong> or call <strong className="text-foreground">+91 9176747268</strong>.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 gap-2">
            <Link to="/contact">
              <PhoneCall className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </section>
      </div>
    </PageShell>
  );
};

export default HelpCenter;
