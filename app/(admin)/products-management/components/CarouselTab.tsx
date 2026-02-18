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
import { Plus, Pencil, Trash2, ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import {
  getCarouselSlides,
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
  type CarouselSlideData,
} from "@/actions/admin/carousel";

type CarouselSlide = {
  id: string;
  imageUrl: string;
  title: string | null;
  linkUrl: string | null;
  sortOrder: number;
};

export default function CarouselTab() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<CarouselSlideData>({
    imageUrl: "",
    title: null,
    linkUrl: null,
    sortOrder: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setImagePreview(formData.imageUrl);
  }, [formData.imageUrl]);

  async function loadData() {
    setLoading(true);
    const result = await getCarouselSlides();
    if (result.success && result.data) {
      setSlides(result.data);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      imageUrl: "",
      title: null,
      linkUrl: null,
      sortOrder: slides.length,
    });
    setEditingSlide(null);
    setImagePreview("");
  }

  function openEditDialog(slide: CarouselSlide) {
    setEditingSlide(slide);
    setFormData({
      imageUrl: slide.imageUrl,
      title: slide.title,
      linkUrl: slide.linkUrl,
      sortOrder: slide.sortOrder,
    });
    setImagePreview(slide.imageUrl);
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.imageUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    if (editingSlide) {
      const result = await updateCarouselSlide(editingSlide.id, formData);
      if (result.success) {
        toast.success("Slide updated successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to update slide");
      }
    } else {
      const result = await createCarouselSlide({
        ...formData,
        sortOrder: slides.length,
      });
      if (result.success) {
        toast.success("Slide created successfully");
        loadData();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create slide");
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    const result = await deleteCarouselSlide(id);
    if (result.success) {
      toast.success("Slide deleted successfully");
      loadData();
    } else {
      toast.error(result.error || "Failed to delete slide");
    }
  }

  async function moveSlide(slide: CarouselSlide, direction: "up" | "down") {
    const currentIndex = slides.findIndex((s) => s.id === slide.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const targetSlide = slides[targetIndex];

    // Swap sort orders
    await Promise.all([
      updateCarouselSlide(slide.id, { ...slide, sortOrder: targetSlide.sortOrder }),
      updateCarouselSlide(targetSlide.id, { ...targetSlide, sortOrder: slide.sortOrder }),
    ]);

    toast.success("Slide order updated");
    loadData();
  }

  if (loading) {
    return <div className="text-center py-8">Loading carousel slides...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Carousel Slides ({slides.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? "Edit Slide" : "Add New Slide"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/slide.jpg"
                  required
                />
                {imagePreview && (
                  <div className="mt-2 border rounded-lg p-2 bg-muted/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 w-full object-cover mx-auto rounded"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
                {!imagePreview && formData.imageUrl && (
                  <div className="mt-2 border rounded-lg p-8 bg-muted/50 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value || null })
                  }
                  placeholder="Slide title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL (optional)</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value || null })
                  }
                  placeholder="https://example.com/destination"
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {editingSlide ? "Update" : "Create"} Slide
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
              <TableHead className="w-16">Order</TableHead>
              <TableHead className="w-40">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No carousel slides found. Add your first slide!
                </TableCell>
              </TableRow>
            ) : (
              slides.map((slide, index) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveSlide(slide, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <span className="w-4 text-center text-muted-foreground">
                        {slide.sortOrder}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveSlide(slide, "down")}
                        disabled={index === slides.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || "Slide"}
                      className="w-32 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/128x64?text=No+Image";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {slide.title || <span className="text-muted-foreground">No title</span>}
                  </TableCell>
                  <TableCell>
                    {slide.linkUrl ? (
                      <a
                        href={slide.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate block max-w-48"
                      >
                        {slide.linkUrl}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No link</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(slide)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(slide.id)}
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
