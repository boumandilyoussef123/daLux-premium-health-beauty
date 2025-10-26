import { useState } from 'react';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/shared/types';
import { useCart } from '@/react-app/hooks/useCart';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    await addToCart(product.id);
    setIsLoading(false);
  };

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => onQuickView?.(product)}
            className="p-2 bg-white text-gray-600 hover:text-emerald-600 rounded-full shadow-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isLoading ? 'Adding...' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-sm text-emerald-600 font-medium mb-1">
          {product.category_name || 'Health'}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)} ({product.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          {product.original_price && (
            <span className="text-lg text-gray-500 line-through">
              ${product.original_price}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            product.stock_quantity > 10 
              ? 'text-green-600' 
              : product.stock_quantity > 0 
                ? 'text-yellow-600' 
                : 'text-red-600'
          }`}>
            {product.stock_quantity > 10 
              ? 'In Stock' 
              : product.stock_quantity > 0 
                ? `Only ${product.stock_quantity} left` 
                : 'Out of Stock'
            }
          </span>
          
          {product.is_featured === 1 && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
