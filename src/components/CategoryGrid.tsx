import { useEffect, useState } from 'react';
import { Category } from '@/shared/types';

interface CategoryGridProps {
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategory: number | null;
}

export default function CategoryGrid({ onCategorySelect, selectedCategory }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-32 mb-3"></div>
            <div className="bg-gray-200 rounded h-4 w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Find exactly what you need for your health and wellness journey
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <button
            onClick={() => onCategorySelect(null)}
            className={`group p-6 rounded-2xl transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white shadow-xl'
                : 'bg-white hover:bg-emerald-50 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
                selectedCategory === null
                  ? 'bg-white/20'
                  : 'bg-emerald-100 group-hover:bg-emerald-200'
              }`}>
                <span className="text-2xl">🏪</span>
              </div>
              <span className="font-semibold text-sm">All Products</span>
            </div>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`group p-6 rounded-2xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white shadow-xl'
                  : 'bg-white hover:bg-emerald-50 hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden mb-3 ${
                  selectedCategory === category.id
                    ? 'ring-4 ring-white/30'
                    : 'group-hover:ring-4 group-hover:ring-emerald-200'
                }`}>
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100'}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-sm text-center leading-tight">
                  {category.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
