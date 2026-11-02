import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, ShieldCheck, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TablePagination from "@/components/TablePagination";

const PAGE_SIZE = 10;

interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

const UsersManagement = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchData = async (targetPage = page, s = debouncedSearch) => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("id, user_id, full_name, phone, city, state, created_at", { count: "exact" });

    if (s.trim()) {
      query = query.ilike("full_name", `%${s.trim()}%`);
    }

    const from = (targetPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: profilesData, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && profilesData) {
      setProfiles(profilesData as ProfileRow[]);
      setTotalCount(count ?? 0);

      // Only query user_roles for the users present on the current page
      const userIds = profilesData.map((p) => p.user_id).filter(Boolean);
      if (userIds.length > 0) {
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", userIds);

        const rolesMap: Record<string, string[]> = {};
        (rolesData ?? []).forEach((r: any) => {
          if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
          rolesMap[r.user_id].push(r.role);
        });
        setRoles(rolesMap);
      } else {
        setRoles({});
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const toggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    if (currentlyAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Admin role removed" });
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Admin role granted" });
    }
    fetchData(page, debouncedSearch);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">{totalCount} registered users</p>
        </div>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : profiles.map((p) => {
              const userRoles = roles[p.user_id] || [];
              const isAdmin = userRoles.includes("admin");
              return (
                <tr key={p.id} className="hover:bg-muted/30 whitespace-nowrap">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        {isAdmin ? <ShieldCheck className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium">{p.full_name || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">{p.phone || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {[p.city, p.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdmin(p.user_id, isAdmin)}
                    >
                      {isAdmin ? "Remove Admin" : "Make Admin"}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {!loading && profiles.length === 0 && (
              <tr className="whitespace-nowrap"><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default UsersManagement;
