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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  type VariantData,
} from "@/actions/admin/variants";
import { getProducts } from "@/actions/admin/products";

type Variant = {
  id: string;
  price: number;
  compareAtPrice: number | null;
  color: string | null;
  size: string | null;
  unit: string | null;
  prodId: string;
  product: { id: string; name: string; image: string };
  stock: { id: string; qty: number } | null;
};

type Product = { id: string; name: string };

export default function VariantsTab() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  const [formData, setFormData] = useState<VariantData>({
    price: 0,
    compareAtPrice: null,
    color: null,
    size: null,
    unit: null,
    prodId: "",
    stockQty: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [variantsRes, productsRes] = await Promise.all([
      getVariants(),
      getProducts(),
    ]);

    if (variantsRes.success && variantsRes.data) {
      setVariants(variantsRes.data as Variant[]);
    }
    if (productsRes.success && productsRes.data) {
      setProducts(productsRes.data as Product[]);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      price: 0,
      compareAtPrice: null,
      color: null,
      size: null,
      unit: null,
      prodId: "",
      stockQty: 0,
    });
    setEditingVariant(null);
  }

  function openEditDialog(variant: Variant) {
    setEditingVariant(variant);
    setFormData({
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      color: variant.color,
      size: variant.size,
      unit: variant.unit,
      prodId: variant.prodId,
      stockQty: variant.stock?.qty ?? 0,
    });
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.prodId || formData.price <= 0) {
      toast.error("Please select a product and enter a valid price");
      return;
    }

    if (editingVariant) {
      const result = await updateVariant(editingVariant.id, formData);
      if (result.success) {
        toast.success("Variant updated successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to update variant");
      }
    } else {
      const result = await createVariant(formData);
      if (result.success) {
        toast.success("Variant created successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create variant");
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    const result = await deleteVariant(id);
    if (result.success) {
      toast.success("Variant deleted successfully");
      loadData();
    } else {
      toast.error(result.error || "Failed to delete variant");
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-DZ", {
      style: "currency",
      currency: "DZD",
    }).format(price);
  }

  if (loading) {
    return <div className="text-center py-8">Loading variants...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Variants ({variants.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingVariant ? "Edit Variant" : "Add New Variant"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product *</Label>
                <select
                  id="product"
                  value={formData.prodId}
                  onChange={(e) =>
                    setFormData({ ...formData, prodId: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  required
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (DZD) *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compareAtPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAtPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="Original price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value || null,
                      })
                    }
                    placeholder="Red, Blue..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        size: e.target.value || null,
                      })
                    }
                    placeholder="S, M, L..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unit: e.target.value || null,
                      })
                    }
                    placeholder="kg, pack..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQty">Stock Quantity</Label>
                <Input
                  id="stockQty"
                  type="number"
                  min="0"
                  value={formData.stockQty ?? 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockQty: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {editingVariant ? "Update" : "Create"} Variant
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
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Compare At</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No variants found. Add your first variant!
                </TableCell>
              </TableRow>
            ) : (
              variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img
                        src={variant.product.image}
                        alt={variant.product.name}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/32x32?text=No";
                        }}
                      />
                      {variant.product.name}
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(variant.price)}</TableCell>
                  <TableCell>
                    {variant.compareAtPrice
                      ? formatPrice(variant.compareAtPrice)
                      : "-"}
                  </TableCell>
                  <TableCell>{variant.color || "-"}</TableCell>
                  <TableCell>{variant.size || "-"}</TableCell>
                  <TableCell>{variant.unit || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        (variant.stock?.qty ?? 0) === 0
                          ? "bg-destructive/10 text-destructive"
                          : (variant.stock?.qty ?? 0) < 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {variant.stock?.qty ?? 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(variant)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(variant.id)}
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
