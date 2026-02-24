import { useEffect, useState } from 'react';
import useProducts from '../hooks/useProducts';
import { getCategories } from '../services/productsService';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/ui/Spinner';

const Products = () => {
  const { products, loading, fetchAll } = useProducts();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchAll({ active: true });
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleCategory = (id) => {
    setActiveCategory(id);
    fetchAll({ active: true, category_id: id || undefined });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-olive-900 mb-2">All Products</h1>
        <p className="text-olive-500">Premium stuffed olives, made to order.</p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-olive-600 text-white'
                : 'bg-cream-200 text-olive-700 hover:bg-cream-300'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-olive-600 text-white'
                  : 'bg-cream-200 text-olive-700 hover:bg-cream-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Spinner className="py-24" />
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-olive-400">
          <p className="text-4xl mb-3">🫒</p>
          <p>No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Products;
