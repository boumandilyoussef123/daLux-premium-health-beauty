import { useState } from 'react';
import Header from '@/react-app/components/Header';
import Hero from '@/react-app/components/Hero';
import CategoryGrid from '@/react-app/components/CategoryGrid';
import ProductGrid from '@/react-app/components/ProductGrid';
import CartSidebar from '@/react-app/components/CartSidebar';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category filter when searching
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when selecting category
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onSearch={handleSearch}
        onToggleCart={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero />
        
        <CategoryGrid 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
        
        <ProductGrid 
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </main>
      
      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
