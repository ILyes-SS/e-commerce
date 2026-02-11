"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getAllVariantsWithStock,
  getAllProducts,
  createVariantWithStock,
  updateVariantWithStock,
  deleteVariant,
  StockVariantWithProduct,
} from "@/actions/stock";
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

type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

export default function StockPage() {
  const [variants, setVariants] = useState<StockVariantWithProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<StockVariantWithProduct | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    prodId: "",
    price: "",
    compareAtPrice: "",
    color: "",
    size: "",
    unit: "",
    stockQty: "",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [variantsData, productsData] = await Promise.all([
        getAllVariantsWithStock(),
        getAllProducts(),
      ]);
      setVariants(variantsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      prodId: "",
      price: "",
      compareAtPrice: "",
      color: "",
      size: "",
      unit: "",
      stockQty: "",
    });
  };

  const handleCreate = async () => {
    if (!formData.prodId || !formData.price || !formData.stockQty) {
      showToast("Please fill in required fields (Product, Price, Stock Qty)", "error");
      return;
    }

    const result = await createVariantWithStock({
      prodId: formData.prodId,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
      color: formData.color || null,
      size: formData.size || null,
      unit: formData.unit || null,
      stockQty: parseInt(formData.stockQty),
    });

    if (result.success) {
      showToast("Variant created successfully!", "success");
      setIsCreateOpen(false);
      resetForm();
      fetchData();
    } else {
      showToast("Failed to create variant", "error");
    }
  };

  const handleEdit = async () => {
    if (!selectedVariant) return;

    const result = await updateVariantWithStock(selectedVariant.id, {
      prodId: formData.prodId || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
      color: formData.color || null,
      size: formData.size || null,
      unit: formData.unit || null,
      stockQty: formData.stockQty ? parseInt(formData.stockQty) : undefined,
    });

    if (result.success) {
      showToast("Variant updated successfully!", "success");
      setIsEditOpen(false);
      setSelectedVariant(null);
      resetForm();
      fetchData();
    } else {
      showToast("Failed to update variant", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedVariant) return;

    const result = await deleteVariant(selectedVariant.id);

    if (result.success) {
      showToast("Variant deleted successfully!", "success");
      setIsDeleteOpen(false);
      setSelectedVariant(null);
      fetchData();
    } else {
      showToast("Failed to delete variant", "error");
    }
  };

  const openEditModal = (variant: StockVariantWithProduct) => {
    setSelectedVariant(variant);
    setFormData({
      prodId: variant.prodId,
      price: variant.price.toString(),
      compareAtPrice: variant.compareAtPrice?.toString() || "",
      color: variant.color || "",
      size: variant.size || "",
      unit: variant.unit || "",
      stockQty: variant.stock?.qty.toString() || "0",
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (variant: StockVariantWithProduct) => {
    setSelectedVariant(variant);
    setIsDeleteOpen(true);
  };

  const filteredVariants = variants.filter(
    (variant) =>
      variant.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.size?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (qty: number | undefined) => {
    if (qty === undefined || qty === 0) return { label: "Out of Stock", color: "bg-red-500" };
    if (qty <= 5) return { label: "Low Stock", color: "bg-amber-500" };
    return { label: "In Stock", color: "bg-emerald-500" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-red-500 to-rose-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Stock Management
          </h1>
          <p className="text-slate-400 mt-2">
            Manage your product variants and inventory levels
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">Total Variants</div>
            <div className="text-2xl font-bold text-white">{variants.length}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">In Stock</div>
            <div className="text-2xl font-bold text-emerald-400">
              {variants.filter((v) => (v.stock?.qty || 0) > 5).length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">Low Stock</div>
            <div className="text-2xl font-bold text-amber-400">
              {variants.filter((v) => (v.stock?.qty || 0) > 0 && (v.stock?.qty || 0) <= 5).length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">Out of Stock</div>
            <div className="text-2xl font-bold text-red-400">
              {variants.filter((v) => !v.stock || v.stock.qty === 0).length}
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search by product name, color, or size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreateOpen(true);
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Create New Variant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-slate-300">Product *</Label>
                  <select
                    value={formData.prodId}
                    onChange={(e) => setFormData({ ...formData, prodId: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Price *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Compare At Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Color</Label>
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="e.g., Red"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Size</Label>
                    <Input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="e.g., XL"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Unit</Label>
                    <Input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="e.g., kg"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Stock Quantity *</Label>
                    <Input
                      type="number"
                      value={formData.stockQty}
                      onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Variants Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Variant Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No variants found
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((variant) => {
                    const stockStatus = getStockStatus(variant.stock?.qty);
                    return (
                      <tr
                        key={variant.id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-700">
                              <Image
                                src={variant.product.image}
                                alt={variant.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {variant.product.name}
                              </div>
                              <div className="text-sm text-slate-400">
                                ID: {variant.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {variant.color && (
                              <span className="px-2 py-1 bg-slate-700 rounded text-sm text-white">
                                {variant.color}
                              </span>
                            )}
                            {variant.size && (
                              <span className="px-2 py-1 bg-slate-700 rounded text-sm text-white">
                                {variant.size}
                              </span>
                            )}
                            {variant.unit && (
                              <span className="px-2 py-1 bg-slate-700 rounded text-sm text-slate-300">
                                {variant.unit}
                              </span>
                            )}
                            {!variant.color && !variant.size && !variant.unit && (
                              <span className="text-slate-500">Default</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">
                            {variant.price.toFixed(2)} DA
                          </div>
                          {variant.compareAtPrice && (
                            <div className="text-sm text-slate-400 line-through">
                              {variant.compareAtPrice.toFixed(2)} DA
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xl font-bold text-white">
                            {variant.stock?.qty ?? 0}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white ${stockStatus.color}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(variant)}
                              className="p-2 rounded-lg bg-slate-700 hover:bg-indigo-500 text-slate-300 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(variant)}
                              className="p-2 rounded-lg bg-slate-700 hover:bg-red-500 text-slate-300 hover:text-white transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Variant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-slate-300">Product *</Label>
              <select
                value={formData.prodId}
                onChange={(e) => setFormData({ ...formData, prodId: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Compare At Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Color</Label>
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Size</Label>
                <Input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Unit</Label>
                <Input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Stock Quantity *</Label>
                <Input
                  type="number"
                  value={formData.stockQty}
                  onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">Delete Variant</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-300">
              Are you sure you want to delete this variant? This action cannot be undone.
            </p>
            {selectedVariant && (
              <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                <div className="font-medium text-white">{selectedVariant.product.name}</div>
                <div className="text-sm text-slate-400">
                  {[selectedVariant.color, selectedVariant.size, selectedVariant.unit]
                    .filter(Boolean)
                    .join(" / ") || "Default variant"}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
