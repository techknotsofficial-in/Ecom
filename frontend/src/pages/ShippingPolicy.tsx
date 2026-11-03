import PageShell from "@/components/PageShell";
import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ShippingPolicy = () => {
  return (
    <PageShell
      badge="Order Delivery Guidelines"
      title="Shipping & Delivery Policy"
      description="Learn about our dispatch timelines, domestic shipping charges, courier partners, and packaging safety standards across India."
      category="Policies"
    >
      <div className="space-y-10 max-w-3xl">
        {/* Quick Highlights Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-5 rounded-xl border border-border/70 bg-card">
            <Truck className="h-6 w-6 text-primary mb-2.5" />
            <h3 className="font-heading text-base font-semibold text-foreground mb-1">
              Free Shipping on Orders ₹999+
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              All domestic orders of ₹999 or more automatically qualify for free standard shipping. Orders below ₹999 incur a flat fee of ₹79.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card">
            <Clock className="h-6 w-6 text-primary mb-2.5" />
            <h3 className="font-heading text-base font-semibold text-foreground mb-1">
              24–48h Fast Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In-stock orders placed on business days are inspected, packed, and handed over to logistics partners within 24 to 48 hours.
            </p>
          </div>
        </div>

        {/* Detailed Shipping Provisions */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
              1. Delivery Timelines
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              All shipments originate from our central fulfillment center in <strong>Chennai, Tamil Nadu</strong>. Estimated delivery times are as follows:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Metro Cities (Chennai, Bengaluru, Hyderabad, Mumbai, Delhi):</strong> Typically 3 to 4 business days.
              </li>
              <li>
                <strong className="text-foreground">Rest of South & Central India:</strong> Typically 3 to 5 business days.
              </li>
              <li>
                <strong className="text-foreground">North, East, & North-Eastern States:</strong> Typically 5 to 7 business days.
              </li>
              <li>
                <strong className="text-foreground">Special / Remote Pincodes:</strong> May take up to 7 to 10 business days depending on local postal connectivity.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
              2. Courier & Logistics Partners
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We partner with <strong>Shiprocket</strong>, leveraging top courier networks such as BlueDart, Delhivery, DTDC, and India Post (Speed Post) to ensure dependable pan-India coverage. The courier is assigned automatically based on fastest verified route efficiency to your destination pincode.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
              3. Order Tracking
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              As soon as the courier scans your parcel at pickup, a unique tracking number and direct live tracking link is dispatched to your registered email address and phone number. You can also view live tracking events inside your <Link to="/dashboard" className="text-primary hover:underline font-medium">User Dashboard</Link>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
              4. Electronic Component Packaging Standards
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Electronic semiconductors, development boards, and sensors are sensitive to Electrostatic Discharge (ESD) and mechanical impacts:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>Microcontrollers and ICs are packed in sealed anti-static bags.</li>
              <li>Breakout boards and display modules are wrapped in multi-layer bubble wrap.</li>
              <li>Outer shipments use reinforced corrugate boxes to resist transit compression.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
              5. Coverage & Geographic Limitations
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We currently ship exclusively within the Republic of India. International shipping is not supported at this time. Please ensure your pincode, landmark, and phone number are accurate during checkout to prevent delivery delays.
            </p>
          </div>
        </section>

        {/* Important Notice */}
        <div className="p-4 rounded-xl border border-border/70 bg-muted/20 flex items-start gap-3 text-xs text-muted-foreground">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground font-semibold">Damaged Package on Delivery? </strong>
            If the outer shipping parcel arrives noticeably crushed, opened, or tampered with, please inspect the contents in the presence of the courier delivery agent or record an unboxing video before accepting the parcel. Contact us at <a href="mailto:support@volkitz.in" className="text-primary hover:underline">support@volkitz.in</a> immediately.
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ShippingPolicy;
