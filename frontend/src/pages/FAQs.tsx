import { useState } from "react";
import PageShell from "@/components/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, PhoneCall, ShoppingCart, Truck, CreditCard, RotateCcw } from "lucide-react";

interface FAQItem {
  id: string;
  category: "Orders" | "Payments" | "Shipping" | "Returns";
  question: string;
  answer: string | React.ReactNode;
}

const faqs: FAQItem[] = [
  // Orders
  {
    id: "order-placement",
    category: "Orders",
    question: "How do I place an order?",
    answer:
      "Browse our catalog, select the components you need, adjust the quantity, and click 'Add to Cart'. When you are ready, click on your shopping cart icon, proceed to checkout, enter your delivery address, select your payment method (UPI, Cards, Net Banking, or Cash on Delivery), and confirm your order.",
  },
  {
    id: "order-cancellation",
    category: "Orders",
    question: "Can I cancel my order after placing it?",
    answer:
      "Yes, orders can be cancelled as long as they have not yet been dispatched from our Chennai fulfillment hub. Please email support@volkitz.in or call +91 9176747268 with your order number as soon as possible. Once a package is handed over to the courier partner, it cannot be cancelled, but eligible items can be returned under our 7-day replacement policy.",
  },
  {
    id: "out-of-stock",
    category: "Orders",
    question: "What happens if a product is out of stock?",
    answer:
      "Product availability is displayed in real time on each product details page. Out-of-stock items cannot be added to cart. If you need a specific sensor, microcontroller, or bulk quantity for a project that is currently unavailable, contact us at support@volkitz.in and we can advise on restock timelines.",
  },

  // Payments
  {
    id: "payments-supported",
    category: "Payments",
    question: "What payment methods are supported?",
    answer:
      "We accept all major Indian payment methods powered securely by Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit and Debit Cards (Visa, MasterCard, RuPay), and Net Banking across 50+ Indian banks. Cash on Delivery (COD) is also available for supported pincodes.",
  },
  {
    id: "payment-security",
    category: "Payments",
    question: "Is paying online on Volkitz safe?",
    answer:
      "Yes, 100%. All online transactions are encrypted via 256-bit SSL and processed directly through Razorpay's PCI-DSS Level 1 compliant gateway. We do not store or process your bank credentials, card numbers, or UPI PINs on our servers.",
  },
  {
    id: "payment-invoice",
    category: "Payments",
    question: "Will I receive an invoice for my order?",
    answer:
      "Yes. A digital order confirmation and GST-compliant invoice is generated for every order. You can access and view your orders anytime from your User Dashboard after signing in.",
  },

  // Shipping
  {
    id: "shipping-charges",
    category: "Shipping",
    question: "What are the shipping charges?",
    answer:
      "We offer Free Standard Shipping across India on all orders of ₹999 and above. For orders below ₹999, a flat shipping fee of ₹79 is applied at checkout to cover courier logistics.",
  },
  {
    id: "shipping-timelines",
    category: "Shipping",
    question: "How long does delivery take?",
    answer:
      "Orders are typically processed and handed over to our courier partner within 24 to 48 business hours from Chennai. Standard transit time is 3 to 7 business days depending on your destination city and pincode. Metro locations generally receive delivery within 3 to 4 business days.",
  },
  {
    id: "shipping-tracking",
    category: "Shipping",
    question: "How can I track my order?",
    answer:
      "Once your order is picked up by our logistics partner (Shiprocket), an automated notification containing your tracking ID and courier link is sent via email and SMS. You can also view live status updates directly inside your User Dashboard under the 'Orders' tab.",
  },

  // Returns & Warranty
  {
    id: "returns-policy",
    category: "Returns",
    question: "How do returns and refunds work?",
    answer:
      "We offer a 7-day replacement policy for components that arrive Dead On Arrival (DOA) or damaged in transit. Because electronic maker components are delicate, please notify us within 7 days of delivery with photos or an unboxing video showing the packaging and defect. If a replacement cannot be provided due to inventory, a full refund is processed.",
  },
  {
    id: "returns-burnt",
    category: "Returns",
    question: "Are burnt or miswired components eligible for return?",
    answer:
      "No. Components damaged due to incorrect wiring, over-voltage (e.g. connecting 5V to a 3.3V-only pin), reverse polarity, static electricity, or improper soldering are not eligible for replacement. Please always inspect component datasheets and pinouts before powering up your circuit.",
  },
  {
    id: "warranty-coverage",
    category: "Returns",
    question: "Do products come with a warranty?",
    answer:
      "All boards and breakout modules are tested and covered by our 7-day DOA guarantee. Branded hardware (such as official Raspberry Pi or Arduino Foundation boards) also carries the respective manufacturer's limited warranty.",
  },
];

const categories = ["All", "Orders", "Payments", "Shipping", "Returns"] as const;

const FAQs = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredFaqs =
    selectedCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <PageShell
      badge="Knowledge Base"
      title="Frequently Asked Questions"
      description="Quick answers about placing orders, payment safety, shipping fees, courier tracking, and component replacement policies."
      category="Customer Support"
    >
      <div className="space-y-8 max-w-3xl">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-6 shadow-2xs">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-sm sm:text-base font-heading font-medium text-foreground hover:text-primary transition-colors py-3.5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still Need Help Box */}
        <div className="p-6 rounded-xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Have a question not listed here?
            </h3>
            <p className="text-xs text-muted-foreground">
              Our support team is available Monday to Saturday to assist you with order or hardware inquiries.
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 gap-2">
            <Link to="/contact">
              <PhoneCall className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default FAQs;
