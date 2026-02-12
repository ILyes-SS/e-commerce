"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Package,
  PackageCheck,
  PackageMinus,
  PackageX,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import {
  getProductsWithVariantsStock,
  getVariantsByProductId,
  updateStockQty,
  bulkUpdateStock,
  deleteStock,
} from "@/actions/stock";
import { getProducts } from "@/actions/admin/products";

type Stock = { id: string; qty: number; prodVariantId: string };

type Variant = {
  id: string;
  price: number;
  compareAtPrice: number | null;
  color: string | null;
  size: string | null;
  unit: string | null;
  prodId: string;
  stock: Stock | null;
};

type ProductWithVariants = {
  id: string;
  name: string;
  slug: string;
  image: string;
  lowStock: number;
  variants: Variant[];
};

type SimpleProduct = { id: string; name: string };

export default function StockPage() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [allProducts, setAllProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Stock Dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productVariants, setProductVariants] = useState<Variant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});

  // Edit Dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editVariant, setEditVariant] = useState<
    (Variant & { productName: string }) | null
  >(null);
  const [editQty, setEditQty] = useState(0);

  // Delete Dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteVariant, setDeleteVariant] = useState<
    (Variant & { productName: string }) | null
  >(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [stockRes, productsRes] = await Promise.all([
      getProductsWithVariantsStock(),
      getProducts(),
    ]);
    if (stockRes.success && stockRes.data) {
      setProducts(stockRes.data as ProductWithVariants[]);
    }
    if (productsRes.success && productsRes.data) {
      setAllProducts(productsRes.data as SimpleProduct[]);
    }
    setLoading(false);
  }

  // When a product is selected in Add Stock dialog, fetch its variants
  async function handleProductSelect(productId: string) {
    setSelectedProductId(productId);
    setProductVariants([]);
    setStockInputs({});

    if (!productId) return;

    setLoadingVariants(true);
    const res = await getVariantsByProductId(productId);
    if (res.success && res.data) {
      const variants = res.data as Variant[];
      setProductVariants(variants);
      // Pre-fill stock inputs with existing quantities
      const inputs: Record<string, number> = {};
      variants.forEach((v) => {
        inputs[v.id] = v.stock?.qty ?? 0;
      });
      setStockInputs(inputs);
    }
    setLoadingVariants(false);
  }

  async function handleBulkSave() {
    const updates = Object.entries(stockInputs).map(([variantId, qty]) => ({
      variantId,
      qty,
    }));

    if (updates.length === 0) {
      toast.error("No variants to update");
      return;
    }

    const result = await bulkUpdateStock(updates);
    if (result.success) {
      toast.success("Stock updated successfully");
      setIsAddOpen(false);
      setSelectedProductId("");
      setProductVariants([]);
      setStockInputs({});
      loadData();
    } else {
      toast.error(result.error || "Failed to update stock");
    }
  }

  function openEditDialog(variant: Variant, productName: string) {
    setEditVariant({ ...variant, productName });
    setEditQty(variant.stock?.qty ?? 0);
    setIsEditOpen(true);
  }

  async function handleEditSave() {
    if (!editVariant) return;

    const result = await updateStockQty(editVariant.id, editQty);
    if (result.success) {
      toast.success("Stock updated successfully");
      setIsEditOpen(false);
      setEditVariant(null);
      loadData();
    } else {
      toast.error(result.error || "Failed to update stock");
    }
  }

  function openDeleteDialog(variant: Variant, productName: string) {
    setDeleteVariant({ ...variant, productName });
    setIsDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteVariant) return;

    const result = await deleteStock(deleteVariant.id);
    if (result.success) {
      toast.success("Stock record deleted");
      setIsDeleteOpen(false);
      setDeleteVariant(null);
      loadData();
    } else {
      toast.error(result.error || "Failed to delete stock");
    }
  }

  function formatPrice(price: number) {
    return `${price.toLocaleString()} DA`;
  }

  function formatVariantLabel(variant: Variant) {
    const parts = [variant.color, variant.size, variant.unit].filter(Boolean);
    return parts.length > 0 ? parts.join(" / ") : "Default";
  }

  // Flatten all variants across products for display and filtering
  const allVariants = products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productName: product.name,
      productImage: product.image,
      lowStock: product.lowStock,
    }))
  );

  const filteredVariants = allVariants.filter(
    (v) =>
      v.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.size?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalVariants = allVariants.length;
  const inStock = allVariants.filter(
    (v) => (v.stock?.qty ?? 0) > (v.lowStock ?? 5)
  ).length;
  const lowStock = allVariants.filter(
    (v) => (v.stock?.qty ?? 0) > 0 && (v.stock?.qty ?? 0) <= (v.lowStock ?? 5)
  ).length;
  const outOfStock = allVariants.filter(
    (v) => !v.stock || v.stock.qty === 0
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Stock Management
            </h1>
            <p className="text-muted-foreground mt-1">Loading stock data...</p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Stock Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product variant inventory levels
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider">
                Total Variants
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">
                {totalVariants}
              </p>
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/80 backdrop-blur-sm border-emerald-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-emerald-700">
                In Stock
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold text-emerald-600">{inStock}</p>
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <PackageCheck className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/80 backdrop-blur-sm border-amber-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-amber-700">
                Low Stock
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold text-amber-600">{lowStock}</p>
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <PackageMinus className="h-5 w-5 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50/80 backdrop-blur-sm border-red-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-red-700">
                Out of Stock
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
              <div className="p-2.5 rounded-xl bg-red-500/10">
                <PackageX className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Table Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Inventory
                </CardTitle>
                <CardDescription>
                  {filteredVariants.length} variant
                  {filteredVariants.length !== 1 ? "s" : ""} total
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product, color, or size..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>

                <Dialog
                  open={isAddOpen}
                  onOpenChange={(open) => {
                    setIsAddOpen(open);
                    if (!open) {
                      setSelectedProductId("");
                      setProductVariants([]);
                      setStockInputs({});
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add / Update Stock
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add / Update Stock</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Product selector */}
                      <div className="space-y-2">
                        <Label htmlFor="product">Select Product *</Label>
                        <select
                          id="product"
                          value={selectedProductId}
                          onChange={(e) => handleProductSelect(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                        >
                          <option value="">Choose a product</option>
                          {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Variants list with stock inputs */}
                      {loadingVariants && (
                        <div className="flex items-center justify-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      )}

                      {!loadingVariants &&
                        selectedProductId &&
                        productVariants.length === 0 && (
                          <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed">
                            <PackageX className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-sm">
                              No variants found for this product.
                            </p>
                            <p className="text-xs mt-1">
                              Create variants first in Products Management.
                            </p>
                          </div>
                        )}

                      {productVariants.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Product Variants
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              (variant details are auto-filled)
                            </span>
                          </Label>
                          <div className="border rounded-lg divide-y max-h-72 overflow-y-auto">
                            {productVariants.map((variant) => {
                              const currentQty = variant.stock?.qty ?? 0;
                              const isOut = currentQty === 0;
                              return (
                                <div
                                  key={variant.id}
                                  className="flex items-center justify-between p-3.5 gap-4 hover:bg-slate-50/50 transition-colors"
                                >
                                  <div className="flex-1 min-w-0 space-y-1.5">
                                    {/* Variant attributes display */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {variant.color && (
                                        <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                                          <span
                                            className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                                            style={{
                                              backgroundColor: variant.color,
                                            }}
                                          />
                                          {variant.color}
                                        </span>
                                      )}
                                      {variant.size && (
                                        <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                          {variant.size}
                                        </span>
                                      )}
                                      {variant.unit && (
                                        <span className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                          {variant.unit}
                                        </span>
                                      )}
                                      {!variant.color &&
                                        !variant.size &&
                                        !variant.unit && (
                                          <span className="text-xs text-muted-foreground">
                                            Default variant
                                          </span>
                                        )}
                                    </div>
                                    {/* Price & stock info */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <span className="font-medium text-slate-700">
                                        {formatPrice(variant.price)}
                                      </span>
                                      {variant.compareAtPrice && (
                                        <span className="line-through">
                                          {formatPrice(variant.compareAtPrice)}
                                        </span>
                                      )}
                                      <span>·</span>
                                      <span
                                        className={
                                          isOut
                                            ? "text-red-500"
                                            : "text-emerald-600"
                                        }
                                      >
                                        Current: {currentQty}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Label className="text-xs whitespace-nowrap text-muted-foreground">
                                      New Qty
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={stockInputs[variant.id] ?? 0}
                                      onChange={(e) =>
                                        setStockInputs({
                                          ...stockInputs,
                                          [variant.id]:
                                            parseInt(e.target.value) || 0,
                                        })
                                      }
                                      className="w-20"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleBulkSave}
                        disabled={productVariants.length === 0}
                      >
                        Save Stock
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <PackageX className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-sm font-medium">No variants found</p>
                      <p className="text-xs mt-1">
                        Add products and variants first!
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVariants.map((variant) => {
                    const qty = variant.stock?.qty ?? 0;
                    const isOut = qty === 0;
                    const isLow =
                      qty > 0 && qty <= (variant.lowStock ?? 5);
                    return (
                      <TableRow key={variant.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-100 shrink-0">
                              <img
                                src={variant.productImage}
                                alt={variant.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://placehold.co/40x40?text=No";
                                }}
                              />
                            </div>
                            <span className="text-sm">
                              {variant.productName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {variant.color && (
                              <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                  style={{
                                    backgroundColor: variant.color,
                                  }}
                                />
                                {variant.color}
                              </span>
                            )}
                            {variant.size && (
                              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                                {variant.size}
                              </span>
                            )}
                            {variant.unit && (
                              <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">
                                {variant.unit}
                              </span>
                            )}
                            {!variant.color &&
                              !variant.size &&
                              !variant.unit && (
                                <span className="text-xs text-muted-foreground">
                                  Default
                                </span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatPrice(variant.price)}
                          </div>
                          {variant.compareAtPrice && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatPrice(variant.compareAtPrice)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full text-xs font-semibold ${
                              isOut
                                ? "bg-red-500/10 text-red-600"
                                : isLow
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-emerald-500/10 text-emerald-600"
                            }`}
                          >
                            {qty}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${
                              isOut
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : isLow
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            }`}
                          >
                            {isOut
                              ? "Out of Stock"
                              : isLow
                              ? "Low Stock"
                              : "In Stock"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                openEditDialog(variant, variant.productName)
                              }
                              className="hover:bg-slate-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                openDeleteDialog(variant, variant.productName)
                              }
                              disabled={!variant.stock}
                              title={
                                !variant.stock
                                  ? "No stock record to delete"
                                  : "Delete stock record"
                              }
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Stock Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Stock Quantity</DialogTitle>
            </DialogHeader>
            {editVariant && (
              <div className="space-y-4 py-2">
                <div className="p-3 border rounded-lg bg-slate-50/80">
                  <div className="font-medium text-sm">
                    {editVariant.productName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {editVariant.color && (
                      <span className="inline-flex items-center gap-1 text-xs bg-white text-slate-600 px-1.5 py-0.5 rounded-full border">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: editVariant.color }}
                        />
                        {editVariant.color}
                      </span>
                    )}
                    {editVariant.size && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                        {editVariant.size}
                      </span>
                    )}
                    {editVariant.unit && (
                      <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">
                        {editVariant.unit}
                      </span>
                    )}
                    {!editVariant.color &&
                      !editVariant.size &&
                      !editVariant.unit && (
                        <span className="text-xs text-muted-foreground">
                          Default variant
                        </span>
                      )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editQty">Stock Quantity</Label>
                  <Input
                    id="editQty"
                    type="number"
                    min="0"
                    value={editQty}
                    onChange={(e) => setEditQty(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleEditSave}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Stock Record</DialogTitle>
            </DialogHeader>
            {deleteVariant && (
              <div className="py-2">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete the stock record for:
                </p>
                <div className="mt-3 p-3 border rounded-lg bg-red-50/50">
                  <div className="font-medium text-sm">
                    {deleteVariant.productName}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      {formatVariantLabel(deleteVariant)}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-medium text-red-600">
                      Qty: {deleteVariant.stock?.qty ?? 0}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  This will remove the stock record. The variant itself will not
                  be deleted.
                </p>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
