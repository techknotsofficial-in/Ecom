import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/components/ProductCard";
import { Eye, Search, Loader2 } from "lucide-react";
import TablePagination from "@/components/TablePagination";

const PAGE_SIZE = 10;
const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-accent/10 text-accent",
  confirmed: "bg-primary/10 text-primary",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-primary/15 text-primary",
  delivered: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

const OrdersManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [trackingId, setTrackingId] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const fetchOrders = async (targetPage = page, s = debouncedSearch, status = statusFilter) => {
    setLoading(true);
    let query = supabase.from("orders").select("*", { count: "exact" });
    if (status !== "all") {
      query = query.eq("status", status);
    }
    if (s.trim()) {
      query = query.ilike("order_number", `%${s.trim()}%`);
    }
    const from = (targetPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error) {
      setOrders(data ?? []);
      setTotalCount(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter]);

  const openOrder = async (order: any) => {
    setSelectedOrder(order);
    setTrackingId("");
    const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id);
    setOrderItems(data ?? []);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Add tracking entry
      await supabase.from("order_tracking").insert({
        order_id: orderId,
        status: newStatus,
        description: `Order status changed to ${newStatus}`,
        tracking_id: trackingId || null,
      });
      toast({ title: "Status updated" });
      fetchOrders(page, debouncedSearch, statusFilter);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
    setUpdatingStatus(false);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">{totalCount} total orders</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by order number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order #</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30 whitespace-nowrap">
                <td className="px-4 py-3 font-medium font-mono">{o.order_number}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 font-medium">{formatINR(Number(o.total))}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[o.status] || "bg-muted text-muted-foreground"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openOrder(o)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Order detail dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize mt-1 ${statusColors[selectedOrder.status] || ""}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold">{formatINR(Number(selectedOrder.total))}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{new Date(selectedOrder.created_at).toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Coupon</p>
                  <p>{selectedOrder.coupon_code || "—"}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="mb-2 font-heading text-sm font-bold">Items</h3>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">{formatINR(Number(item.total))}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-3 rounded-xl border border-border p-4">
                <h3 className="font-heading text-sm font-bold">Update Status</h3>
                <div className="space-y-2">
                  <Label>Tracking ID (optional)</Label>
                  <Input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="AWB / Tracking number" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <Button
                      key={s}
                      variant={selectedOrder.status === s ? "default" : "outline"}
                      size="sm"
                      className="capitalize"
                      disabled={updatingStatus || selectedOrder.status === s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                    >
                      {updatingStatus ? <Loader2 className="h-3 w-3 animate-spin" /> : s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
