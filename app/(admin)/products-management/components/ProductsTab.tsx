"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductData,
} from "@/actions/admin/products";
import { getAllCategories } from "@/actions/admin/categories";
import { getBrands, getBrandsByCategory } from "@/actions/admin/brands";

type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  weight: number | null;
  dimension: number | null;
  lowStock: number;
  categoryId: string;
  brandId: string;
  category: { id: string; title: string };
  brand: { id: string; title: string };
};

type Category = { id: string; title: string };
type Brand = { id: string; title: string; categoryId: string };

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<ProductData>({
    name: "",
    slug: "",
    image: "",
    description: "",
    weight: null,
    dimension: null,
    lowStock: 5,
    categoryId: "",
    brandId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      const filtered = brands.filter((b) => b.categoryId === formData.categoryId);
      setFilteredBrands(filtered);
      if (!filtered.find((b) => b.id === formData.brandId)) {
        setFormData((prev) => ({ ...prev, brandId: "" }));
      }
    } else {
      setFilteredBrands([]);
    }
  }, [formData.categoryId, brands]);

  useEffect(() => {
    setImagePreview(formData.image);
  }, [formData.image]);

  async function loadData() {
    setLoading(true);
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
      getProducts(),
      getAllCategories(),
      getBrands(),
    ]);

    if (productsRes.success && productsRes.data) {
      setProducts(productsRes.data as Product[]);
    }
    if (categoriesRes.success && categoriesRes.data) {
      setCategories(categoriesRes.data);
    }
    if (brandsRes.success && brandsRes.data) {
      setBrands(brandsRes.data as Brand[]);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      slug: "",
      image: "",
      description: "",
      weight: null,
      dimension: null,
      lowStock: 5,
      categoryId: "",
      brandId: "",
    });
    setEditingProduct(null);
    setImagePreview("");
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      image: product.image,
      description: product.description,
      weight: product.weight,
      dimension: product.dimension,
      lowStock: product.lowStock,
      categoryId: product.categoryId,
      brandId: product.brandId,
    });
    setImagePreview(product.image);
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.categoryId || !formData.brandId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingProduct) {
      const result = await updateProduct(editingProduct.id, formData);
      if (result.success) {
        toast.success("Product updated successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to update product");
      }
    } else {
      const result = await createProduct(formData);
      if (result.success) {
        toast.success("Product created successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create product");
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const result = await deleteProduct(id);
    if (result.success) {
      toast.success("Product deleted successfully");
      loadData();
    } else {
      toast.error(result.error || "Failed to delete product");
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="product-slug"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {imagePreview && (
                  <div className="mt-2 border rounded-lg p-2 bg-muted/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 object-contain mx-auto rounded"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
                {!imagePreview && formData.image && (
                  <div className="mt-2 border rounded-lg p-4 bg-muted/50 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Product description"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <select
                    id="brand"
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: e.target.value })
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    required
                    disabled={!formData.categoryId}
                  >
                    <option value="">
                      {formData.categoryId
                        ? "Select brand"
                        : "Select category first"}
                    </option>
                    {filteredBrands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimension">Dimension</Label>
                  <Input
                    id="dimension"
                    type="number"
                    step="0.01"
                    value={formData.dimension ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimension: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStock">Low Stock Alert</Label>
                  <Input
                    id="lowStock"
                    type="number"
                    value={formData.lowStock ?? 5}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lowStock: parseInt(e.target.value) || 5,
                      })
                    }
                    placeholder="5"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {editingProduct ? "Update" : "Create"} Product
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
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Low Stock</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found. Add your first product!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/48x48?text=No+Image";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category.title}</TableCell>
                  <TableCell>{product.brand.title}</TableCell>
                  <TableCell>{product.lowStock}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(product.id)}
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
