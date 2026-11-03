import PageShell from "@/components/PageShell";
import { FileText, ShieldAlert, Scale, HelpCircle } from "lucide-react";

const Terms = () => {
  return (
    <PageShell
      badge="Legal & Service Agreement"
      title="Terms & Conditions"
      description="The standard legal terms and conditions governing the use of Volkitz (IoT Haven) and purchase of electronic components."
      category="Policies"
    >
      <div className="space-y-8 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <div className="p-4 rounded-xl border border-border/70 bg-muted/20 text-xs">
          <strong className="text-foreground">Last Updated:</strong> January 2026. By accessing, browsing, or purchasing from Volkitz, you agree to be bound by these terms.
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            1. General Overview
          </h2>
          <p>
            Volkitz (operated under IoT Haven) is an e-commerce platform offering electronic components, microcontrollers, sensors, development kits, and prototyping accessories. These Terms of Service apply to all site visitors, registered customers, and buyers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            2. Products & Intended Use
          </h2>
          <p>
            All products listed on Volkitz—including bare circuit boards, breakout modules, microcontrollers, and semiconductors—are intended specifically for <strong>prototyping, education, STEM research, hobbyist projects, and development testing</strong>.
          </p>
          <div className="p-4 rounded-lg border border-border/60 bg-card">
            <strong className="block text-foreground mb-1 font-semibold">User Responsibility Notice:</strong>
            Because these components involve open circuits and varying voltage ratings (3.3V, 5V, 12V, etc.), the buyer/user is solely responsible for verifying pinouts, ensuring correct polarity, preventing short circuits, and maintaining electrical safety during experimentation.
          </div>
        </section>

        <section className="space-y-3" id="billing">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            3. Pricing & Payments
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are stated in Indian Rupees (₹ INR) and include applicable taxes unless specified otherwise.</li>
            <li>Prices and promotional offers are subject to change without prior notice.</li>
            <li>We accept prepaid payments via Razorpay (UPI, Debit/Credit Cards, Net Banking) and Cash on Delivery (COD) for eligible pincodes.</li>
            <li>In the event of a pricing typo or stock discrepancy, we reserve the right to cancel the order and provide a full refund.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            4. Shipping & Fulfilment
          </h2>
          <p>
            Orders are fulfilled from Chennai, India via Shiprocket courier partners. Orders equal to or exceeding ₹999 receive free shipping; orders below ₹999 incur a flat ₹79 shipping charge. Delivery timeframes are estimates and may vary due to weather, logistics bottlenecks, or regional restrictions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            5. Replacement & Refunds
          </h2>
          <p>
            We provide a 7-day Dead On Arrival (DOA) replacement guarantee for transit-damaged or factory-defective modules. Damage caused by user miswiring, overvoltage, reversed polarity, or soldering is excluded. For full details, see our <a href="/returns" className="text-primary hover:underline font-medium">Returns Policy</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            6. Limitation of Liability
          </h2>
          <p>
            Volkitz shall not be liable for any incidental, indirect, or consequential damages resulting from the use, misuse, or failure of any electronic component, including but not limited to circuit damage, data loss, or experimental project failure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            7. Governing Law & Jurisdiction
          </h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Chennai, Tamil Nadu, India</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
            8. Contact Information
          </h2>
          <p>
            Questions regarding these Terms & Conditions should be directed to <a href="mailto:support@volkitz.in" className="text-primary hover:underline">support@volkitz.in</a> or by calling <a href="tel:+919176747268" className="text-primary hover:underline">+91 9176747268</a>.
          </p>
        </section>
      </div>
    </PageShell>
  );
};

export default Terms;
