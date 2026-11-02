import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/components/ProductCard";
import { User, ShoppingBag, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Profile {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [orders, setOrders] = useState<any[]>([]);
  const [tracking, setTracking] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setProfile({
          full_name: profileRes.data.full_name || "",
          phone: profileRes.data.phone || "",
          address: profileRes.data.address || "",
          city: profileRes.data.city || "",
          state: profileRes.data.state || "",
          pincode: profileRes.data.pincode || "",
        });
      }
      setOrders(ordersRes.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name || null,
      phone: profile.phone || null,
      address: profile.address || null,
      city: profile.city || null,
      state: profile.state || null,
      pincode: profile.pincode || null,
    }).eq("user_id", user.id);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated!" });
    setSaving(false);
  };

  const viewTracking = async (orderId: string) => {
    if (selectedOrder === orderId) { setSelectedOrder(null); return; }
    setSelectedOrder(orderId);
    if (!tracking[orderId]) {
      const { data } = await supabase.from("order_tracking").select("*").eq("order_id", orderId).order("created_at", { ascending: true });
      setTracking((prev) => ({ ...prev, [orderId]: data ?? [] }));
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-accent/10 text-accent",
    confirmed: "bg-primary/10 text-primary",
    processing: "bg-primary/10 text-primary",
    shipped: "bg-primary/15 text-primary",
    delivered: "bg-primary/20 text-primary",
    cancelled: "bg-destructive/10 text-destructive",
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <main className="py-8 md:py-12 w-full overflow-x-hidden">
      <div className="container max-w-4xl">
        <h1 className="mb-6 font-heading text-3xl font-bold">My Account</h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders" className="gap-2"><ShoppingBag className="h-4 w-4" />Orders</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
                <p className="text-muted-foreground">No orders yet. Start shopping!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="min-w-0 flex-1 pr-4">
                        <p className="font-heading font-bold font-mono break-all">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                          {order.status}
                        </span>
                        <p className="font-heading font-bold">{formatINR(Number(order.total))}</p>
                      </div>
                    </div>

                    <div className="border-t border-border px-4 py-2">
                      <Button variant="ghost" size="sm" onClick={() => viewTracking(order.id)}>
                        <MapPin className="mr-1 h-3 w-3" />
                        {selectedOrder === order.id ? "Hide Tracking" : "Track Order"}
                      </Button>
                    </div>

                    {selectedOrder === order.id && (
                      <div className="border-t border-border bg-muted/30 p-4">
                        {(tracking[order.id] ?? []).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No tracking updates yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {(tracking[order.id] ?? []).map((t, i) => (
                              <div key={t.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className={`h-3 w-3 rounded-full ${i === (tracking[order.id]?.length ?? 0) - 1 ? "bg-primary" : "bg-border"}`} />
                                  {i < (tracking[order.id]?.length ?? 0) - 1 && <div className="w-px flex-1 bg-border" />}
                                </div>
                                <div className="pb-3">
                                  <p className="text-sm font-medium capitalize">{t.status}</p>
                                  <p className="text-xs text-muted-foreground">{t.description}</p>
                                  {t.tracking_id && <p className="text-xs font-mono text-primary">ID: {t.tracking_id}</p>}
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(t.created_at).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading text-lg font-bold">Profile Information</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" maxLength={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} maxLength={300} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input value={profile.pincode} onChange={(e) => setProfile({ ...profile, pincode: e.target.value })} placeholder="400001" maxLength={10} />
                  </div>
                </div>
                <Button onClick={saveProfile} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-2 font-heading text-lg font-bold">Account Details</h2>
              <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default UserDashboard;
