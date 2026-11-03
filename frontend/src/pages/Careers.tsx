import PageShell from "@/components/PageShell";
import { Briefcase, Mail, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Careers = () => {
  return (
    <PageShell
      badge="Join the Team"
      title="Careers at Volkitz"
      description="We are passionate about building tools, sourcing reliable components, and fostering practical hardware learning across India."
      category="Company"
    >
      <div className="space-y-10 max-w-3xl">
        {/* Transparent Status Banner */}
        <div className="p-6 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>Hiring Status</span>
          </div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
            No Active Openings at Present
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We currently do not have any open full-time positions. However, as our maker community and product catalog expand, we periodically look for embedded systems enthusiasts, technical content writers, electronics lab mentors, and operations teammates.
          </p>
        </div>

        {/* Culture & What We Value */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
            What We Value
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-xl border border-border/70 bg-card">
              <CheckCircle2 className="h-5 w-5 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Maker Curiosity
              </h3>
              <p className="text-xs text-muted-foreground">
                A genuine enthusiasm for microcontrollers, sensors, and practical prototyping.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card">
              <CheckCircle2 className="h-5 w-5 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Hardware Empathy
              </h3>
              <p className="text-xs text-muted-foreground">
                Helping beginner makers debug wiring issues with clear, constructive advice.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card">
              <CheckCircle2 className="h-5 w-5 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Transparency
              </h3>
              <p className="text-xs text-muted-foreground">
                Accurate product data, honest stock counts, and dependable customer service.
              </p>
            </div>
          </div>
        </section>

        {/* Speculative Inquiries */}
        <section className="p-6 rounded-xl border border-border/70 bg-card space-y-3">
          <h3 className="text-base font-heading font-semibold text-foreground">
            Interested in Future Collaborations?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you create IoT tutorials, open-source hardware libraries, or have experience with maker workshops, we would love to hear from you. Feel free to introduce yourself and share your GitHub or portfolio.
          </p>
          <div className="pt-1">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a href="mailto:support@volkitz.in?subject=Maker%20Collaboration%20Inquiry">
                <Mail className="h-4 w-4" />
                <span>Email support@volkitz.in</span>
              </a>
            </Button>
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default Careers;
