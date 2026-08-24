import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-bold">
                Vol<span className="text-primary">kitz</span>
              </span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              India's trusted destination for IoT components, electronics, and tech education.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@volkitz.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 9176747268</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Chennai, India</span>
              </div>
            </div>
          </div>
          

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              {["Sensors", "Development Boards", "IoT Kits", "Robotics", "Modules", "Courses"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/products"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              {["Help Center", "Shipping Info", "Returns", "Track Order", "Privacy Policy", "Terms of Service"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Volkitz. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>We accept: UPI • Cards • Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
