import { useState } from "react";
import PageShell from "@/components/PageShell";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate sending contact message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Message Received",
        description: `Thank you, ${formData.name}. Our support team will reply to ${formData.email} within 24 hours.`,
      });
    }, 600);
  };

  return (
    <PageShell
      badge="Customer & Technical Support"
      title="Contact Us"
      description="Have questions about component compatibility, order status, or need help with a hardware project? Our team is ready to assist."
      category="Company"
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Information Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-5 rounded-xl border border-border/70 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Email Support
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              For general questions, order tracking, and component specs:
            </p>
            <a
              href="mailto:support@volkitz.in"
              className="text-sm font-medium text-primary hover:underline break-all"
            >
              support@volkitz.in
            </a>
            <p className="text-[11px] text-muted-foreground mt-1">
              Typical response time: Within 24 business hours.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Phone & WhatsApp
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Direct assistance during working hours:
            </p>
            <a
              href="tel:+919176747268"
              className="text-sm font-medium text-primary hover:underline"
            >
              +91 9176747268
            </a>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Working Hours
              </h3>
            </div>
            <p className="text-xs text-foreground font-medium">
              Monday – Saturday
            </p>
            <p className="text-xs text-muted-foreground">
              9:00 AM – 6:00 PM IST
            </p>
            <p className="text-[11px] text-muted-foreground mt-2">
              Closed on Sundays and National Holidays.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Location & Dispatch Hub
              </h3>
            </div>
            <p className="text-xs text-foreground font-medium">
              Chennai, Tamil Nadu, India
            </p>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              All orders are dispatched from our central hub via Shiprocket courier partners pan-India.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-2xl border border-border/70 bg-card shadow-2xs">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-1">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Fill out the form below and our technical or order support team will respond promptly.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl border border-primary/30 bg-primary/5 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Thank You! Message Submitted
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  We have received your message regarding <strong>{formData.subject}</strong>. We will contact you at <strong>{formData.email}</strong> shortly.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "Order Inquiry",
                        message: "",
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-xs">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-xs">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className="text-xs">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject" className="text-xs">
                      Topic / Subject
                    </Label>
                    <select
                      id="contact-subject"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    >
                      <option value="Order Inquiry">Order Inquiry / Tracking</option>
                      <option value="Product Technical Question">Component Specifications / Tech Help</option>
                      <option value="Return or Replacement">Return or Replacement (DOA)</option>
                      <option value="Bulk or Educational Orders">Bulk College / School Order</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message" className="text-xs">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Describe your inquiry, including order ID if applicable..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
                  <Send className="h-4 w-4" />
                  <span>{loading ? "Sending..." : "Submit Message"}</span>
                </Button>
              </form>
            )}

            {/* Confirmation & Transparency Notice */}
            <div className="mt-8 pt-4 border-t border-border/60 flex items-start gap-2.5 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground font-medium">Business Details Notice: </strong>
                Registered GSTIN and commercial invoice credentials are provided upon order completion or on request for educational/institutional bulk procurement. Physical warehouse visits are by prior appointment only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Contact;
