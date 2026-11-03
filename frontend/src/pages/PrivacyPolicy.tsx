import PageShell from "@/components/PageShell";
import { ShieldCheck, Lock, Eye, Database, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <PageShell
      badge="Legal & Compliance"
      title="Privacy Policy"
      description="How Volkitz (IoT Haven) collects, safeguards, and utilizes your personal information when you use our services."
      category="Policies"
    >
      <div className="space-y-8 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <div className="p-4 rounded-xl border border-border/70 bg-muted/20 text-xs">
          <strong className="text-foreground">Effective Date:</strong> January 1, 2026. This policy applies to all users visiting and purchasing from Volkitz.
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            When you browse our catalog, register an account, or place an order, we collect information necessary to fulfill your purchases and ensure smooth delivery:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Contact & Identity Details:</strong> Full name, email address, and phone number.</li>
            <li><strong className="text-foreground">Delivery Information:</strong> Physical shipping address, city, state, and postal code.</li>
            <li><strong className="text-foreground">Order Records:</strong> Items ordered, quantities, prices, payment method type (e.g. UPI, COD, Card), and date of purchase.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            2. Payment Security & Financial Data
          </h2>
          <p>
            All online financial transactions are handled directly through <strong>Razorpay</strong>, a certified PCI-DSS Level 1 payment gateway provider. Volkitz does <strong>NOT</strong> process, view, or store your credit/debit card numbers, CVVs, net banking credentials, or UPI PINs on any server.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            3. How We Use Your Data
          </h2>
          <p>We use your information exclusively to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process, assemble, and deliver your orders.</li>
            <li>Send order confirmations, tracking links, and delivery updates via email/SMS.</li>
            <li>Provide customer support and process replacement or refund requests.</li>
            <li>Maintain account security and comply with legal accounting regulations in India.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            4. Third-Party Sharing
          </h2>
          <p>
            We do not sell, rent, or trade your personal data. We only share necessary delivery information with vetted service partners required to complete your order:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Shiprocket & Couriers:</strong> Name, phone, and delivery address to facilitate physical delivery of your parcel.</li>
            <li><strong className="text-foreground">Razorpay:</strong> Encrypted transaction identifiers for payment verification.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            5. Cookies & Local Storage
          </h2>
          <p>
            We use essential session tokens and local browser storage strictly to preserve your cart items and authentication state across page navigations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            6. Your Rights & Data Inquiries
          </h2>
          <p>
            You may request to view, correct, or delete your account information at any time by emailing us at <a href="mailto:support@volkitz.in" className="text-primary hover:underline">support@volkitz.in</a>.
          </p>
        </section>
      </div>
    </PageShell>
  );
};

export default PrivacyPolicy;
