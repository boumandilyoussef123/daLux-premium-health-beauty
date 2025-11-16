import { useMemo, useState } from "react";
import { Product } from "@/shared/types";
import ProductCard from "./ProductCard";
import { products as staticProducts } from "@/shared/staticData";

interface ProductGridProps {
  selectedCategory: number | null;
  searchQuery: string;
}

export default function ProductGrid({
  selectedCategory,
  searchQuery,
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let filtered = staticProducts;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const products = filteredProducts;

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or browse our categories
        </p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategory
                ? "Category Products"
                : "All Products"}
            </h2>
            <p className="text-gray-600 mt-1">
              {products.length} products found
            </p>
          </div>

          <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Customer Rating</option>
            <option>Newest First</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleQuickView}
            />
          ))}
        </div>

        {/* Featured Products Section */}
        {!selectedCategory && !searchQuery && <FeaturedProducts />}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

function FeaturedProducts() {
  const featuredProducts = staticProducts
    .filter((p) => p.is_featured === 1)
    .slice(0, 4);

  if (featuredProducts.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-gray-200">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Featured Products
        </h3>
        <p className="text-lg text-gray-600">
          Our most popular and highly-rated products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Quick View</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="sr-only">Close</span>✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"
              }
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl"
            />

            <div className="space-y-4">
              <div>
                <p className="text-emerald-600 font-medium">
                  {product.category_name}
                </p>
                <h4 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h4>
              </div>

              <p className="text-gray-600">{product.description}</p>

              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
