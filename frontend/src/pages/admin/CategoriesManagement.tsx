import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon_name: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  icon_name: "",
  display_order: 0,
  is_active: true,
};

const CategoriesManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("display_order");
    setCategories((data as CategoryRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openCreate = () => { setEditing(null); setForm(emptyCategory); setDialogOpen(true); };

  const openEdit = (c: CategoryRow) => {
    setEditing(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image_url: c.image_url || "",
      icon_name: c.icon_name || "",
      display_order: c.display_order,
      is_active: c.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      icon_name: form.icon_name || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    const { error } = editing
      ? await supabase.from("categories").update(payload).eq("id", editing)
      : await supabase.from("categories").insert(payload);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Category updated" : "Category created" });
      setDialogOpen(false);
      fetchCategories();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Category deleted" }); fetchCategories(); }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading categories...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">{categories.length} categories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-bold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.slug}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                c.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {c.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            {c.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
            <div className="mt-3 flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                <Pencil className="mr-1 h-3 w-3" />Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(c.id)}>
                <Trash2 className="mr-1 h-3 w-3" />Delete
              </Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="col-span-full py-8 text-center text-muted-foreground">No categories yet. Create your first one!</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagement;
