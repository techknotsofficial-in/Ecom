import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingBag, Users, IndianRupee, TrendingUp, Clock } from "lucide-react";
import { formatINR } from "@/components/ProductCard";
import { motion } from "framer-motion";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: any[];
}

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border bg-card p-5"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-2xl font-bold">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [productsRes, ordersRes, usersRes, pendingRes, recentRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

      setStats({
        totalProducts: productsRes.count ?? 0,
        totalOrders: ordersRes.data?.length ?? 0,
        totalUsers: usersRes.count ?? 0,
        totalRevenue,
        pendingOrders: pendingRes.count ?? 0,
        recentOrders: recentRes.data ?? [],
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Volkitz store</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatINR(stats.totalRevenue)} color="bg-primary/10 text-primary" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(stats.totalOrders)} color="bg-accent/10 text-accent" />
        <StatCard icon={Package} label="Products" value={String(stats.totalProducts)} color="bg-primary/10 text-primary" />
        <StatCard icon={Users} label="Users" value={String(stats.totalUsers)} color="bg-muted text-muted-foreground" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Pending Orders */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <h2 className="font-heading text-lg font-bold">Pending Orders</h2>
            <span className="ml-auto rounded-full bg-accent/10 px-3 py-0.5 text-sm font-medium text-accent">
              {stats.pendingOrders}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.pendingOrders === 0
              ? "No pending orders — all caught up!"
              : `${stats.pendingOrders} order(s) awaiting processing.`}
          </p>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-bold">Recent Orders</h2>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatINR(Number(order.total))}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      order.status === "delivered" ? "bg-primary/10 text-primary" :
                      order.status === "pending" ? "bg-accent/10 text-accent" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
