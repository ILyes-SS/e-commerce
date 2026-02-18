import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Layers, Tag, FolderTree, ImageIcon, TrendingUp, MapPin } from "lucide-react";
import ProductsTab from "./components/ProductsTab";
import VariantsTab from "./components/VariantsTab";
import BrandsTab from "./components/BrandsTab";
import CategoriesTab from "./components/CategoriesTab";
import CarouselTab from "./components/CarouselTab";
import TrendingTab from "./components/TrendingTab";
import WilayaTab from "./components/WilayaTab";

export default function ProductsManagementPage() {
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Products Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your products, variants, brands, categories, and more.
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="variants" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Variants</span>
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Brands</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="carousel" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Carousel</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="wilaya" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Wilaya</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="variants">
          <VariantsTab />
        </TabsContent>
        <TabsContent value="brands">
          <BrandsTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="carousel">
          <CarouselTab />
        </TabsContent>
        <TabsContent value="trending">
          <TrendingTab />
        </TabsContent>
        <TabsContent value="wilaya">
          <WilayaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
