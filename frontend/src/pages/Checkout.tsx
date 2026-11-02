import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "";
// Remove trailing slash if present to prevent double-slash errors in fetch
const BACKEND_URL = rawBackendUrl.endsWith("/") ? rawBackendUrl.slice(0, -1) : rawBackendUrl;

import { ArrowLeft, CreditCard, Banknote, Smartphone, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

type PaymentMethod = "cod" | "upi" | "card";
type Address = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, cartLoaded } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Address
  const [address, setAddress] = useState<Address>({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  // // Card (dummy)
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  // UPI (dummy)
  const [upiId, setUpiId] = useState("");

  const shipping = totalPrice >= 999 ? 0 : 79;
  const grandTotal = totalPrice + shipping;
  // Load Razorpay script once
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);


  const validateAddress = () => {
    if (!address.full_name || !address.phone || !address.address_line || !address.city || !address.state || !address.pincode) {
      toast({ title: "Missing address", description: "Please fill all address fields.", variant: "destructive" });
      return false;
    }

    const rawPhone = address.phone.replace(/\D/g, "");
    if (rawPhone.length !== 10) {
      toast({ title: "Invalid Phone", description: "Phone number must be exactly 10 digits.", variant: "destructive" });
      return false;
    }

    if (address.pincode.length !== 6) {
      toast({ title: "Invalid Pincode", description: "Pincode must be exactly 6 digits.", variant: "destructive" });
      return false;
    }

    return true;
  };

  const fetchPincodeDetails = async (pincode: string) => {
  try {
    if (pincode.length !== 6) return;

    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();

    if (data[0].Status === "Success") {
      const postOffice = data[0].PostOffice[0];

      setAddress((prev) => ({
        ...prev,
        city: postOffice.District,
        state: postOffice.State,
      }));
    } else {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid pincode",
        variant: "destructive",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

 
  // 🔥 Secure Backend Checkout Flow
  const placeOrder = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!validateAddress()) return;
    if (items.length === 0) return;

    setProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No valid session found.");

      const payload = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        couponCode: null, // Add coupon state if implemented later
        shippingAddress: {
          full_name: address.full_name,
          phone: address.phone.replace(/\D/g, ""),
          address_line: address.address_line,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod: paymentMethod === "cod" ? "cod" : "prepaid"
      };

      // 1. Create secure order on backend
      const createRes = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload),
      });

      const createData = await createRes.json();

      if (!createData.success) {
        throw new Error(createData.message || "Failed to initialize order.");
      }

      // COD Flow
      if (paymentMethod === "cod") {
        setOrderNumber(createData.orderNumber);
        setOrderPlaced(true);
        clearCart();
        setProcessing(false);
        return;
      }

      // Prepaid Flow (Razorpay)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: createData.razorpayOrder.amount,
        currency: "INR",
        name: "Volkitz IoT",
        description: "Order Payment",
        order_id: createData.razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // 2. Verify payment on backend
            const verifyRes = await fetch(`${BACKEND_URL}/checkout/verify`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                internalOrderId: createData.internalOrderId
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              throw new Error(verifyData.message || "Verification failed");
            }

            setOrderNumber(verifyData.orderNumber);
            setOrderPlaced(true);
            clearCart();
          } catch (err: any) {
            toast({
              title: "Payment Verification Failed",
              description: err.message,
              variant: "destructive",
            });
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Checkout failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

// Wait for cart to load from localStorage
if (!cartLoaded) {
  return (
    <main className="py-20 text-center">
      <Loader2 className="mx-auto animate-spin h-6 w-6" />
      <p className="mt-2 text-muted-foreground">Loading cart...</p>
    </main>
  );
}
  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="py-20">
        <div className="container text-center">
          <h1 className="mb-4 font-heading text-2xl font-bold">No items in cart</h1>
          <Button asChild><Link to="/products">Browse Products</Link></Button>
        </div>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="py-20">
        <div className="container max-w-md text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
            <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-primary" />
          </motion.div>
          <h1 className="mb-2 font-heading text-3xl font-bold">Order Placed!</h1>
          <p className="mb-2 text-muted-foreground">Your order has been confirmed successfully.</p>
          <p className="mb-6 font-mono text-lg font-bold text-primary">{orderNumber}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild><Link to="/dashboard">Track Order</Link></Button>
            <Button variant="outline" asChild><Link to="/products">Continue Shopping</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 md:py-12 w-full overflow-x-hidden">
      <div className="container max-w-4xl">
        <Link to="/cart" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>
        <h1 className="mb-8 font-heading text-3xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping Address */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading text-lg font-bold">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div><div className="space-y-2">
  <Label>Full Address *</Label>

  <textarea
    className="w-full min-h-[90px] rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    placeholder="Flat / Door No, Street Name, Area, Landmark"
    value={address.address_line}
    onChange={(e) =>
      setAddress({ ...address, address_line: e.target.value })
    }
  />
</div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>City *</Label><Input value={address.city} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>State *</Label><Input value={address.state} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode *</Label>
                    <Input value={address.pincode} onChange={(e) => {    const value = e.target.value;
                        setAddress({ ...address, pincode: value });
                         if (value.length === 6) {
                             fetchPincodeDetails(value);
                            }
                            }}
/>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading text-lg font-bold">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="space-y-3">
                <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                  <RadioGroupItem value="cod" />
                  <Banknote className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </label>

                <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                  <RadioGroupItem value="upi" />
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">UPI Payment</p>
                    <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm etc.</p>
                  </div>
                </label>

                <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                  <RadioGroupItem value="card" />
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Credit / Debit Card</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading text-lg font-bold">Order Summary</h2>
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between gap-2">
                    <span className="text-muted-foreground truncate">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatINR(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? <span className="text-primary">FREE</span> : formatINR(shipping)}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-heading font-bold">Total</span>
                    <span className="font-heading text-xl font-bold">{formatINR(grandTotal)}</span>
                  </div>
                </div>
              </div>
              <Button className="mt-6 w-full" size="lg" onClick={placeOrder} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order — ${formatINR(grandTotal)}`
                )}
                
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Secure dummy checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};



export default Checkout;
