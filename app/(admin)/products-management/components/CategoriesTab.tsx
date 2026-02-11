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
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryData,
} from "@/actions/admin/categories";

type Category = {
  id: string;
  title: string;
  slug: string | null;
  image: string | null;
  parentCategoryId: string | null;
};

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<CategoryData>({
    title: "",
    slug: "",
    image: "",
    parentCategoryId: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setImagePreview(formData.image || "");
  }, [formData.image]);

  async function loadData() {
    setLoading(true);
    const result = await getAllCategories();
    if (result.success && result.data) {
      setCategories(result.data as Category[]);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      title: "",
      slug: "",
      image: "",
      parentCategoryId: null,
    });
    setEditingCategory(null);
    setImagePreview("");
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      slug: category.slug,
      image: category.image,
      parentCategoryId: category.parentCategoryId,
    });
    setImagePreview(category.image || "");
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Please enter a category title");
      return;
    }

    if (editingCategory) {
      const result = await updateCategory(editingCategory.id, formData);
      if (result.success) {
        toast.success("Category updated successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to update category");
      }
    } else {
      const result = await createCategory(formData);
      if (result.success) {
        toast.success("Category created successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create category");
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const result = await deleteCategory(id);
    if (result.success) {
      toast.success("Category deleted successfully");
      loadData();
    } else {
      toast.error(result.error || "Failed to delete category");
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Get root categories for parent selector
  const rootCategories = categories.filter((c) => !c.parentCategoryId);

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories ({categories.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Category Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="Category title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="category-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category (optional)</Label>
                <select
                  id="parentCategory"
                  value={formData.parentCategoryId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentCategoryId: e.target.value || null,
                    })
                  }
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  disabled={!!(editingCategory && rootCategories.some(c => c.parentCategoryId === editingCategory.id))}
                >
                  <option value="">None (Root category)</option>
                  {rootCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value || null })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                {imagePreview && (
                  <div className="mt-2 border rounded-lg p-2 bg-muted/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-24 object-contain mx-auto rounded"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
                {!imagePreview && formData.image && (
                  <div className="mt-2 border rounded-lg p-4 bg-muted/50 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {editingCategory ? "Update" : "Create"} Category
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
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No categories found. Add your first category!
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/40x40?text=No";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {category.parentCategoryId && "↳ "}
                    {category.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug || "-"}
                  </TableCell>
                  <TableCell>
                    {category.parentCategoryId
                      ? categories.find((c) => c.id === category.parentCategoryId)?.title
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(category.id)}
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
