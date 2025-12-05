import { Product, ProductVariant } from "@/app/generated/prisma";
import ProductCard from "./ProductCard";
import PriceFilter from "./PriceFilter";
import SortProducts from "./SortProducts";
import BrandsFilter from "./BrandsFilter";
import prisma from "@/lib/prisma";

const ProductsDisplay = async ({
  products,
}: {
  products: (Product & { variants: ProductVariant[] })[];
}) => {
  const brands = await prisma.brand.findMany({
    // where: {
    //   id: {
    //     in: products.map((p) => p.brandId),
    //   },
    // },
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Products</h1>

          {/* Controls Row */}
          <div className="flex flex-col w-full sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="flex-1 ">
                <PriceFilter />
              </div>
              <div className="flex-1 sm:flex-none">
                <SortProducts />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Filters
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">
                    Brands
                  </h3>
                  <BrandsFilter brandsList={brands} />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-lg text-slate-500 font-medium">
                    No products found
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsDisplay;
