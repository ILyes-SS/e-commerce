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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Products
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                {products.length} {products.length === 1 ? "product" : "products"} available
              </p>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="flex-1">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-6 sticky top-28 transition-all duration-200 hover:shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">
                  Filters
                </h2>
                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                <span className="text-sm text-slate-500 font-medium">
                  Refine results
                </span>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    Brands
                  </h3>
                  <div className="pt-2">
                    <BrandsFilter brandsList={brands} />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 px-4">
                <div className="text-center max-w-md">
                  <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100">
                    <svg
                      className="w-10 h-10 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-2">
                    No products found
                  </p>
                  <p className="text-base text-slate-500 leading-relaxed">
                    Try adjusting your filters or search criteria to find what you're looking for
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
