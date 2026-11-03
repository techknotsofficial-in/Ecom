import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Zap,
  User,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  MapPin,
  HelpCircle,
  PhoneCall,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/products?category=kits", label: "Kits" },
  { to: "/products?category=courses", label: "Courses" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/70 shadow-2xs">
      {/* Main Bar */}
      <div className="container px-3.5 sm:px-4 lg:px-6">
        {/* Top Header Row: 56px on mobile (h-14), 64px on sm+ (sm:h-16) */}
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Left: Brand Logo & Breathing Space */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 group py-1"
              aria-label="Volkitz Home"
            >
              <div className="flex h-9 w-9 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105 shadow-2xs">
                <Zap className="h-5 w-5 sm:h-5 sm:w-5" />
              </div>
              <span className="font-heading text-xl sm:text-xl font-bold tracking-tight text-foreground">
                Vol<span className="text-primary">kitz</span>
              </span>
            </Link>

            {/* Location indicator */}
            <div className="hidden min-[380px]:flex md:hidden items-center gap-1 text-[11px] text-muted-foreground border-l border-border/60 pl-2.5 ml-1">
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate max-w-[85px]">India</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to ||
                (link.to !== "/" && location.pathname + location.search === link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Desktop Search + User + Cart + Mobile Drawer Toggle */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            {/* Desktop Search Input */}
            <form onSubmit={handleSearch} className="hidden md:flex relative items-center mr-0.5 lg:mr-1">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[140px] md:w-[160px] lg:w-[240px] pl-9 h-9 bg-muted/50 border-border/60 focus-visible:ring-1 focus-visible:bg-background transition-colors text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Desktop Location Hint */}
            <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 rounded border border-border/50 bg-muted/30">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>Deliver to <strong>India</strong></span>
            </div>

            {/* User Account Button (Desktop & Mobile) */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-9 sm:w-9 relative text-foreground hover:bg-muted"
                    aria-label="User Account Menu"
                  >
                    <User className="h-5 w-5 sm:h-5 sm:w-5" />
                    {isAdmin && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    My Account
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 md:hidden text-foreground hover:bg-muted"
                  onClick={() => navigate("/auth")}
                  aria-label="Sign in"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="hidden md:flex h-9 text-xs" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            )}

            {/* Cart Button with Reactive Badge */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 sm:h-9 sm:w-9 text-foreground hover:bg-muted"
              onClick={() => setIsOpen(true)}
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute 0.5 top-1 right-1 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </Button>

            {/* Mobile Hamburger / Close Button (Touch Friendly 40x40) */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 md:hidden text-foreground hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar Row (Touch Usable ~46px row, ~116px combined mobile header) */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearch} className="relative flex items-center w-full">
            <Search className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search sensors, boards, robotics..."
              className="w-full pl-10 pr-3 h-11 bg-muted/60 border border-border/80 focus-visible:bg-background text-sm rounded-lg shadow-2xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/60 overflow-hidden bg-background/98 backdrop-blur-md"
          >
            <div className="container px-4 py-3 flex flex-col gap-1">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Explore Products
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="my-1.5 border-t border-border/60" />

              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Company & Support
              </p>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2.5"
              >
                <Info className="h-4 w-4 text-primary" />
                <span>About Us</span>
              </Link>
              <Link
                to="/help"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2.5"
              >
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>Help Center & FAQs</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2.5"
              >
                <PhoneCall className="h-4 w-4 text-primary" />
                <span>Contact Support</span>
              </Link>

              <div className="my-1.5 border-t border-border/60" />

              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In / Register</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    <span>My Account</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
