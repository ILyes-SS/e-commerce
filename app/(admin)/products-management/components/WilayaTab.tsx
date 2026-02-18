"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  getWilayasAdmin,
  createWilaya,
  updateWilaya,
  deleteWilaya,
  type WilayaData,
} from "@/actions/admin/wilayas";

type Wilaya = {
  id: string;
  name: string;
  price: number;
  _count: { orders: number };
};

export default function WilayaTab() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWilaya, setEditingWilaya] = useState<Wilaya | null>(null);

  const [formData, setFormData] = useState<WilayaData>({
    name: "",
    price: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await getWilayasAdmin();
    if (result.success && result.data) {
      setWilayas(result.data as Wilaya[]);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      price: 0,
    });
    setEditingWilaya(null);
  }

  function openEditDialog(wilaya: Wilaya) {
    setEditingWilaya(wilaya);
    setFormData({
      name: wilaya.name,
      price: wilaya.price,
    });
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || formData.price < 0) {
      toast.error("Please enter a valid name and price");
      return;
    }

    if (editingWilaya) {
      const result = await updateWilaya(editingWilaya.id, formData);
      if (result.success) {
        toast.success("Wilaya updated successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to update wilaya");
      }
    } else {
      const result = await createWilaya(formData);
      if (result.success) {
        toast.success("Wilaya created successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create wilaya");
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this wilaya?")) return;

    const result = await deleteWilaya(id);
    if (result.success) {
      toast.success("Wilaya deleted successfully");
      loadData();
    } else {
      toast.error(result.error || "Failed to delete wilaya");
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-DZ", {
      style: "currency",
      currency: "DZD",
    }).format(price);
  }

  if (loading) {
    return <div className="text-center py-8">Loading wilayas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Wilayas / Delivery Zones ({wilayas.length})</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Wilaya
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingWilaya ? "Edit Wilaya" : "Add New Wilaya"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Wilaya Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Algiers, Oran, Constantine..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Delivery Price (DZD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {editingWilaya ? "Update" : "Create"} Wilaya
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wilaya Name</TableHead>
              <TableHead>Delivery Price</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wilayas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No wilayas found. Add your first delivery zone!
                </TableCell>
              </TableRow>
            ) : (
              wilayas.map((wilaya) => (
                <TableRow key={wilaya.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {wilaya.name}
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(wilaya.price)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-muted">
                      {wilaya._count.orders} orders
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(wilaya)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(wilaya.id)}
                        disabled={wilaya._count.orders > 0}
                        title={
                          wilaya._count.orders > 0
                            ? "Cannot delete wilaya with orders"
                            : "Delete wilaya"
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
