import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface PageShellProps {
  badge?: string;
  title: string;
  description: string;
  category?: "Company" | "Customer Support" | "Policies";
  children: ReactNode;
}

const navItems = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Help Center", to: "/help" },
  { label: "FAQs", to: "/faqs" },
  { label: "Shipping Policy", to: "/shipping" },
  { label: "Returns & Refunds", to: "/returns" },
  { label: "Warranty", to: "/warranty" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

export const PageShell = ({
  badge,
  title,
  description,
  category = "Company",
  children,
}: PageShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header / Hero */}
      <div className="border-b border-border/60 bg-muted/20">
        <div className="container max-w-5xl px-4 py-8 sm:py-12">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap scrollbar-none"
          >
            <Link
              to="/"
              className="hover:text-foreground transition-colors shrink-0"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            <span className="text-muted-foreground shrink-0">{category}</span>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            <span className="text-foreground font-medium truncate">
              {title}
            </span>
          </nav>

          {/* Heading Section */}
          <div className="max-w-3xl">
            {badge && (
              <span className="inline-block px-2.5 py-0.5 mb-3 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                {badge}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight mb-3">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quick Sub-navigation Bar */}
          <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="shrink-0 px-3 py-1.5 text-xs rounded-full border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="container max-w-5xl px-4 py-8 sm:py-12">
        {children}

        {/* Back Link */}
        <div className="mt-12 pt-6 border-t border-border/60 flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          <Link
            to="/contact"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            Need help? Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PageShell;
