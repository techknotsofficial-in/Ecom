import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import {
  Cpu,
  Radio,
  BookOpen,
  CheckCircle2,
  Users,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <PageShell
      badge="About IoT Haven & Volkitz"
      title="Empowering the Makers of Tomorrow"
      description="We make IoT hardware, development boards, sensors, and robotics components accessible to students, developers, hobbyists, and educators across India."
      category="Company"
    >
      <div className="space-y-12 sm:space-y-16">
        {/* Who We Are */}
        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              Who We Are
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Volkitz (IoT Haven) is an electronics e-commerce platform dedicated to democratizing embedded systems, IoT prototyping, and hardware learning in India.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Whether you are an engineering student building your first microcontroller circuit, a hobbyist automating your home, or a professional engineer prototyping a connected industrial device, finding authentic, tested components with fast dispatch should never be a roadblock.
            </p>
            <div className="pt-2">
              <Button asChild className="gap-2">
                <Link to="/products">
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs">
              <Cpu className="h-7 w-7 text-primary mb-2.5" />
              <h3 className="font-heading text-sm font-semibold text-foreground mb-1">
                Development Boards
              </h3>
              <p className="text-xs text-muted-foreground">
                ESP32, ESP8266, Arduino ecosystem & microcontrollers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs">
              <Radio className="h-7 w-7 text-primary mb-2.5" />
              <h3 className="font-heading text-sm font-semibold text-foreground mb-1">
                Sensors & Modules
              </h3>
              <p className="text-xs text-muted-foreground">
                Precision environmental, motion, ultrasonic & RF sensors.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs">
              <Sparkles className="h-7 w-7 text-primary mb-2.5" />
              <h3 className="font-heading text-sm font-semibold text-foreground mb-1">
                Robotics & Power
              </h3>
              <p className="text-xs text-muted-foreground">
                Motors, drivers, lithium battery accessories & breakout boards.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs">
              <BookOpen className="h-7 w-7 text-primary mb-2.5" />
              <h3 className="font-heading text-sm font-semibold text-foreground mb-1">
                Learning Kits
              </h3>
              <p className="text-xs text-muted-foreground">
                Curated starter sets and educational hardware packages.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section id="mission" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl border border-border/80 bg-muted/20 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Our Purpose</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
            Our Mission
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            Our mission is simple: to make electronic hardware accessible, reliable, and straightforward to purchase. We focus on curating dependable modules so students and innovators can focus on writing code, designing circuits, and solving real-world challenges rather than worrying about component authenticity.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 pt-4">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <strong className="block text-foreground font-semibold">Accessibility</strong>
                <span className="text-muted-foreground">Affordable components available to any pincode in India.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <strong className="block text-foreground font-semibold">Authenticity</strong>
                <span className="text-muted-foreground">Pre-screened electronic parts with verified pinouts and specs.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <strong className="block text-foreground font-semibold">Practical Learning</strong>
                <span className="text-muted-foreground">Hands-on hardware kits to support STEM education.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              Who We Serve
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Built by hardware enthusiasts for everyone building with electronics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-5 rounded-xl border border-border/70 bg-card">
              <Users className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">
                Students & Beginners
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Affordable sensors, jumper wires, and breadboard-friendly modules tailored for college mini-projects and self-paced learning.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/70 bg-card">
              <Cpu className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">
                Makers & Hobbyists
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Development boards with built-in Wi-Fi and Bluetooth (ESP32/ESP8266) for home automation, weather stations, and robotics projects.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/70 bg-card">
              <BookOpen className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">
                Educators & Labs
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Bulk kits and standardized component packs designed for robotics clubs, maker spaces, and university IoT laboratories.
              </p>
            </div>
          </div>
        </section>

        {/* Commitment to Quality */}
        <section className="p-6 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                Verified Quality & DOA Protection
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Every component is visually inspected and packed with antistatic care. We provide a 7-day replacement policy for transit-damaged or defective parts.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link to="/contact">Contact Our Team</Link>
          </Button>
        </section>
      </div>
    </PageShell>
  );
};

export default About;
