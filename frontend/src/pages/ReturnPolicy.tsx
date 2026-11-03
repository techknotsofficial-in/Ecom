import PageShell from "@/components/PageShell";
import { RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ReturnPolicy = () => {
  return (
    <PageShell
      badge="Customer Protection"
      title="Returns & Replacement Policy"
      description="Our transparent replacement and refund guidelines for electronic maker hardware, microcontrollers, and sensor modules."
      category="Policies"
    >
      <div className="space-y-10 max-w-3xl">
        {/* Core Guarantee */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <RotateCcw className="h-4 w-4" />
            <span>7-Day Replacement Policy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
            Dead On Arrival (DOA) & Transit Damage Protection
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Because electronic components (ICs, breakout boards, sensors, and microcontrollers) are fragile and sensitive to circuit configuration, we provide a <strong>7-Day Replacement Guarantee</strong> specifically for items that arrive physically damaged, missing parts, or non-functional out of the box (DOA).
          </p>
        </div>

        {/* What Is Eligible vs Ineligible */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Eligible */}
          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span>Eligible for Replacement</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Component physically cracked, bent, or broken upon parcel unboxing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Missing cables, antennas, or headers listed in product contents.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Module fails initial power test with manufacturer recommended voltage prior to any soldering.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Incorrect item received differing from your placed order.</span>
              </li>
            </ul>
          </div>

          {/* Ineligible */}
          <div className="p-5 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <ShieldAlert className="h-5 w-5" />
              <span>Not Eligible for Replacement</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Components burnt or damaged from reversed polarity or short circuits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Applying 5V logic or power to 3.3V-only microcontrollers/sensors (e.g. ESP8266/ESP32 GPIO pins).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Boards damaged during excessive soldering, desoldering, or firmware tampering.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Claims filed after the 7-day post-delivery inspection window.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step by Step Claim Process */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
            How to File a Replacement Request
          </h2>
          <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Photograph or Record:</strong> Take clear photographs or a short video showing the courier parcel label, outer packaging, and the defective component.
            </li>
            <li>
              <strong className="text-foreground">Email Support:</strong> Send your order number and issue description to <a href="mailto:support@volkitz.in" className="text-primary hover:underline">support@volkitz.in</a> within 7 days of delivery.
            </li>
            <li>
              <strong className="text-foreground">Technical Review:</strong> Our technical team will review the claim within 24 to 48 business hours to troubleshoot or confirm defect eligibility.
            </li>
            <li>
              <strong className="text-foreground">Dispatch of Replacement:</strong> Once verified, a replacement unit is dispatched at zero additional shipping cost.
            </li>
          </ol>
        </section>

        {/* Refund Policy */}
        <section className="space-y-3 p-5 rounded-xl border border-border/70 bg-card">
          <h3 className="text-base font-heading font-semibold text-foreground">
            Refunds & Out-of-Stock Replacements
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If a replacement component is out of stock and cannot be dispatched within a reasonable timeframe, a full refund for the item amount will be initiated:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Prepaid Orders (UPI/Cards/Net Banking):</strong> Refund is credited directly to the original payment source within 5 to 7 business days via Razorpay.
            </li>
            <li>
              <strong className="text-foreground">COD Orders:</strong> Refund is processed via NEFT / IMPS bank transfer after verification of your bank account details.
            </li>
          </ul>
        </section>

        {/* Contact Help */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Questions regarding return eligibility? Contact us at <strong className="text-foreground">support@volkitz.in</strong>.
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0 gap-1.5">
            <Link to="/contact">
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default ReturnPolicy;
