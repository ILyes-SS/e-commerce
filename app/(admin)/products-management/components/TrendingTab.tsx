"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  getTrendingProducts,
  getAvailableProductsForTrending,
  addTrending,
  removeTrending,
} from "@/actions/admin/trending";

type TrendingItem = {
  id: string;
  prodId: string;
  product: {
    id: string;
    name: string;
    image: string;
    category: { title: string };
    brand: { title: string };
    variants: Array<{
      price: number;
      stock: { qty: number } | null;
    }>;
  };
};

type AvailableProduct = {
  id: string;
  name: string;
  image: string;
};

export default function TrendingTab() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [trendingRes, availableRes] = await Promise.all([
      getTrendingProducts(),
      getAvailableProductsForTrending(),
    ]);

    if (trendingRes.success && trendingRes.data) {
      setTrending(trendingRes.data as TrendingItem[]);
    }
    if (availableRes.success && availableRes.data) {
      setAvailableProducts(availableRes.data);
    }
    setLoading(false);
  }

  async function handleAddTrending(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    const result = await addTrending(selectedProductId);
    if (result.success) {
      toast.success("Product added to trending");
      loadData();
      setIsDialogOpen(false);
      setSelectedProductId("");
    } else {
      toast.error(result.error || "Failed to add to trending");
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Are you sure you want to remove this product from trending?")) return;

    const result = await removeTrending(id);
    if (result.success) {
      toast.success("Product removed from trending");
      loadData();
    } else {
      toast.error(result.error || "Failed to remove from trending");
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-DZ", {
      style: "currency",
      currency: "DZD",
    }).format(price);
  }

  if (loading) {
    return <div className="text-center py-8">Loading trending products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Products ({trending.length})</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableProducts.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Trending
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Product to Trending</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTrending} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Select Product *</Label>
                <select
                  id="product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  required
                >
                  <option value="">Choose a product...</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div className="border rounded-lg p-3 bg-muted/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={availableProducts.find(p => p.id === selectedProductId)?.image || ""}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/48x48?text=No";
                      }}
                    />
                    <span className="font-medium">
                      {availableProducts.find(p => p.id === selectedProductId)?.name}
                    </span>
                  </div>
                </div>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Add to Trending</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {availableProducts.length === 0 && trending.length > 0 && (
        <div className="bg-muted/50 border rounded-lg p-3 text-sm text-muted-foreground">
          All products are already in trending. Create more products to add them here.
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trending.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No trending products. Add products to showcase them!
                </TableCell>
              </TableRow>
            ) : (
              trending.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/48x48?text=No";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell>{item.product.category.title}</TableCell>
                  <TableCell>{item.product.brand.title}</TableCell>
                  <TableCell>
                    {item.product.variants[0]
                      ? formatPrice(item.product.variants[0].price)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {item.product.variants[0]?.stock ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.product.variants[0].stock.qty === 0
                            ? "bg-destructive/10 text-destructive"
                            : item.product.variants[0].stock.qty < 10
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.product.variants[0].stock.qty}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
