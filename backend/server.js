require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Initialize Supabase Admin Client (Bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* -------------------- Middleware -------------------- */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];
    
    // Securely verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ success: false, message: "Unauthorized", error });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Authentication error" });
  }
};

/* -------------------- Shiprocket -------------------- */
let shiprocketToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {
  if (shiprocketToken && tokenExpiry > Date.now()) {
    return shiprocketToken;
  }
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );
  shiprocketToken = response.data.token;
  tokenExpiry = Date.now() + 8 * 60 * 60 * 1000;
  return shiprocketToken;
}

async function createShiprocketOrder(orderData) {
  const token = await getShiprocketToken();
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/* -------------------- Order Processor -------------------- */
const finalizeOrder = async (orderId, paymentMethod, transactionId, gatewayResponse, customerEmail) => {
  try {
    // 1. Fetch order and items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");

    // 2. Call the Atomic RPC
    const { data: result, error: rpcError } = await supabase.rpc('process_order_payment', {
      p_order_id: orderId,
      p_payment_method: paymentMethod,
      p_transaction_id: transactionId || null,
      p_gateway_response: gatewayResponse || null
    });

    if (rpcError) {
      if (rpcError.message.includes('INSUFFICIENT_STOCK')) {
        // Safe, conditional fallback update
        const { data, error: fallbackError } = await supabase
          .from("orders")
          .update({ status: "failed_stock" })
          .eq("id", orderId)
          .eq("status", "pending")
          .select();
        
        if (fallbackError) {
          console.error(`Fallback update error for order ${orderId}:`, fallbackError);
        } else if (data && data.length > 0) {
          console.log(`Order ${orderId} marked as failed_stock due to inventory.`);
        }
        throw new Error("Insufficient stock for one or more products");
      }
      throw rpcError;
    }

    if (!result || !result.success) throw new Error("Order processing failed");

    // 3. Idempotency check return
    if (result.message === 'Already processed') {
      console.log(`Order ${orderId} already processed. Status: ${result.order?.status}`);
      return result.order; // Already processed
    }

    // 4. Update local order object to reflect RPC changes for downstream logic
    order.status = "processing";

    // 6. Push to Shiprocket
    const addr = order.shipping_address;
    const shiprocketPayload = {
      order_id: order.order_number,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: "warehouse",
      billing_customer_name: addr.full_name,
      billing_last_name: ".", 
      billing_address: addr.address_line,
      billing_city: addr.city,
      billing_pincode: addr.pincode,
      billing_state: addr.state,
      billing_country: "India",
      billing_email: customerEmail || "customer@example.com",
      billing_phone: addr.phone,
      shipping_is_billing: true,
      order_items: order.order_items.map(item => ({
        name: item.product_name,
        sku: String(item.product_id),
        units: item.quantity,
        selling_price: item.price
      })),
      payment_method: paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: order.total,
      length: 10, breadth: 10, height: 10, weight: 0.5
    };

    try {
      await createShiprocketOrder(shiprocketPayload);
    } catch (shipErr) {
      console.error("Shiprocket error, but order confirmed:", shipErr.response?.data || shipErr.message);
    }

    return order;
  } catch (err) {
    console.error("Finalize Order Error:", err);
    throw err;
  }
};

/* -------------------- Routes -------------------- */

// Create Order (Secure Pricing)
app.post("/create-order", authenticateUser, async (req, res) => {
  try {
    const { items, couponCode, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1. Fetch products securely
    const productIds = items.map(i => i.productId);
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (prodErr || !dbProducts || dbProducts.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid products" });
    }

    let subtotal = 0;
    const validatedItems = [];

    // 2. Validate items & stock
    for (const item of items) {
      const product = dbProducts.find(p => p.id === item.productId);
      if (!product) return res.status(400).json({ success: false, message: "Product not found" });
      if (!product.is_active) return res.status(400).json({ success: false, message: "Product inactive" });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      const price = Number(product.price);
      subtotal += price * item.quantity;
      
      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        quantity: item.quantity,
        price: price,
        total: price * item.quantity
      });
    }

    // 3. Coupon validation (Basic implementation)
    let discount = 0;
    if (couponCode) {
      const { data: coupon } = await supabase.from("coupons").select("*").eq("code", couponCode).eq("is_active", true).single();
      if (coupon) {
        if (subtotal >= (coupon.min_order_amount || 0)) {
           if (coupon.discount_type === 'percentage') {
             discount = subtotal * (Number(coupon.discount_value) / 100);
           } else {
             discount = Number(coupon.discount_value);
           }
        }
      }
    }

    // 4. Calculate total
    const shipping = (subtotal - discount) >= 999 ? 0 : 79;
    const finalTotal = subtotal - discount + shipping;

    // 5. Create Internal Order
    const { data: orderData, error: orderErr } = await supabase.from("orders").insert({
      user_id: req.user.id,
      status: "pending",
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      total: finalTotal,
      shipping_address: shippingAddress,
      coupon_code: couponCode || null,
      notes: `Payment: ${paymentMethod.toUpperCase()}`
    }).select().single();

    if (orderErr) throw new Error("Order creation failed in DB");

    // 6. Create Order Items
    const orderItemsToInsert = validatedItems.map(item => ({
      ...item,
      order_id: orderData.id
    }));
    await supabase.from("order_items").insert(orderItemsToInsert);

    // 7. Razorpay specific flow
    if (paymentMethod === "card" || paymentMethod === "upi" || paymentMethod === "prepaid") {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        receipt: orderData.id, // Tie RZP order to internal order ID
      });

      return res.json({ 
        success: true, 
        internalOrderId: orderData.id, 
        razorpayOrder: rzpOrder,
        total: finalTotal 
      });
    }

    // 8. COD flow - Finalize immediately
    if (paymentMethod === "cod") {
      await finalizeOrder(orderData.id, "cod", "COD", null, req.user?.email);
      return res.json({ success: true, internalOrderId: orderData.id, orderNumber: orderData.order_number });
    }

    res.status(400).json({ success: false, message: "Invalid payment method" });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// Client-side Payment Verification
app.post("/checkout/verify", authenticateUser, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internalOrderId } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const order = await finalizeOrder(internalOrderId, "prepaid", razorpay_payment_id, req.body, req.user?.email);
    
    res.json({ success: true, orderNumber: order.order_number });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ success: false, message: err.message || "Checkout failed" });
  }
});

// Razorpay Webhook (Authoritative)
app.post("/webhook/razorpay", async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  try {
    // Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id; 
      
      // Fetch the Razorpay order to find the internal receipt (our order ID)
      const rzpOrder = await razorpay.orders.fetch(orderId);
      const internalOrderId = rzpOrder.receipt;

      if (internalOrderId) {
        await finalizeOrder(internalOrderId, "prepaid", paymentEntity.id, payload, paymentEntity.email);
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Webhook Error");
  }
});

app.get("/", (req, res) => {
  res.json({ status: "Backend secure 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));