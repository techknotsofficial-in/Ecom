import PageShell from "@/components/PageShell";
import { ShieldCheck, Cpu, AlertCircle, Wrench, CheckCircle2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Warranty = () => {
  return (
    <PageShell
      badge="Component Guidelines"
      title="Warranty & Hardware Usage Information"
      description="Clear, transparent terms regarding manufacturer warranty coverage, initial testing policies, and hardware safety practices for makers."
      category="Policies"
    >
      <div className="space-y-10 max-w-3xl">
        {/* Core Principle */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Honest & Accurate Hardware Coverage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
            Warranty Terms for Maker Electronics
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            In the electronics and IoT maker ecosystem, hardware components consist of semiconductors, bare printed circuit boards (PCBs), and open-pin modules. Unlike consumer electronics with enclosed casings, maker components can be damaged instantly by static discharge (ESD), reverse polarity, or incorrect voltage applied to unbuffered GPIO pins.
          </p>
        </div>

        {/* Coverage Categories */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-border/70 bg-card space-y-2.5">
            <h3 className="font-heading text-base font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>1. 7-Day Dead On Arrival (DOA) Guarantee</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every breakout board, sensor, motor driver, and microcontroller sold on Volkitz is covered by our <strong>7-Day Dead On Arrival (DOA) Guarantee</strong>. If a unit is defective or fails initial basic power/communication testing upon arrival, we provide a free replacement or full refund under our <Link to="/returns" className="text-primary hover:underline">Returns Policy</Link>.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card space-y-2.5">
            <h3 className="font-heading text-base font-semibold text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <span>2. Branded Manufacturer Warranties</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Select branded development hardware (such as official Raspberry Pi Foundation products, STMicroelectronics Nucleo boards, or authentic Arduino boards) carry standard manufacturer warranties as stipulated by their respective makers. In such cases, manufacturer RMA (Return Merchandise Authorization) or support policies apply.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card space-y-2.5">
            <h3 className="font-heading text-base font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span>3. What Is Excluded From Warranty</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Overvoltage & Electrical Stress:</strong> Exceeding maximum voltage ratings (e.g., connecting a 12V supply to a 5V VIN or 3.3V GPIO).
              </li>
              <li>
                <strong className="text-foreground">Reverse Polarity:</strong> Swapping VCC and GND connections causing burnt diodes or IC latch-up.
              </li>
              <li>
                <strong className="text-foreground">Soldering Damage:</strong> Cold joints, lifted PCB copper pads, or excessive heat from an ungrounded soldering iron.
              </li>
              <li>
                <strong className="text-foreground">Physical Abuse:</strong> Broken pins, cracked SMD components, or liquid spills.
              </li>
            </ul>
          </div>
        </div>

        {/* Maker Best Practices Guide */}
        <section id="guidelines" className="p-6 rounded-2xl border border-border/80 bg-muted/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Recommended Best Practices</span>
          </div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
            Safe Hardware Testing Checklist
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm text-muted-foreground">
            <div className="p-3.5 rounded-lg bg-card border border-border/60">
              <strong className="block text-foreground mb-1 font-semibold">1. Verify Logic Levels</strong>
              Ensure your sensor's logic level matches your MCU. ESP32 and Raspberry Pi are 3.3V logic; connecting 5V signals can damage the GPIO.
            </div>
            <div className="p-3.5 rounded-lg bg-card border border-border/60">
              <strong className="block text-foreground mb-1 font-semibold">2. Double-Check Pinout</strong>
              Never assume pin order is standard. Compare physical board silk-screen labels with the official datasheet before wiring.
            </div>
            <div className="p-3.5 rounded-lg bg-card border border-border/60">
              <strong className="block text-foreground mb-1 font-semibold">3. Use Current Limiting</strong>
              When powering a newly assembled prototype for the first time, use a current-limited bench supply or protected USB hub.
            </div>
            <div className="p-3.5 rounded-lg bg-card border border-border/60">
              <strong className="block text-foreground mb-1 font-semibold">4. Ground Yourself</strong>
              Touch an unpainted metal surface to discharge static electricity before handling bare CMOS chips and sensitive sensors.
            </div>
          </div>
        </section>

        {/* Support Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-card">
          <p className="text-xs text-muted-foreground">
            Have questions about component voltage tolerances or wiring diagrams?
          </p>
          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link to="/contact">Ask Our Technical Team</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default Warranty;
