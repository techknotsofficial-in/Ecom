import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsManagement from "./pages/admin/ProductsManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import CouponsManagement from "./pages/admin/CouponsManagement";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/Callback";
import ScrollToTop from "@/components/ScrollToTop";

// Company & Support Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import FAQs from "./pages/FAQs";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import Warranty from "./pages/Warranty";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsManagement />} />
                    <Route path="categories" element={<CategoriesManagement />} />
                    <Route path="orders" element={<OrdersManagement />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="coupons" element={<CouponsManagement />} />
                  </Route>

                  {/* Company Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/mission" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/careers" element={<Careers />} />

                  {/* Customer Support & Policies Routes */}
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/help-center" element={<HelpCenter />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/returns" element={<ReturnPolicy />} />
                  <Route path="/refund-policy" element={<ReturnPolicy />} />
                  <Route path="/warranty" element={<Warranty />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/terms-of-service" element={<Terms />} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
              <CartSheet />
            </div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
