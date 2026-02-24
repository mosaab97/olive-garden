import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useCart from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const ProductDetail = () => {
  const { slug } = useParams();
  const { selectedProduct: product, loading, fetchBySlug } = useProducts();
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => { fetchBySlug(slug); }, [slug]);
  useEffect(() => {
    if (product?.variants?.length) setSelectedVariant(product.variants[0]);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const primaryImage = product.images?.find((i) => i.is_primary) || product.images?.[0];
    addItem({
      variantId:    selectedVariant.id,
      productName:  product.name,
      variantLabel: selectedVariant.label,
      price:        selectedVariant.price,
      quantity:     qty,
      image:        primaryImage?.url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Spinner className="py-32" />;
  if (!product) return <p className="text-center py-32 text-olive-400">Product not found.</p>;

  const primaryImage = product.images?.find((i) => i.is_primary) || product.images?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-6">
      {/* Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100">
        {primaryImage ? (
          <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🫒</div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        {product.category_name && (
          <p className="text-xs text-olive-400 uppercase tracking-widest mb-2">{product.category_name}</p>
        )}
        <h1 className="font-serif text-4xl text-olive-900 mb-3">{product.name}</h1>
        <p className="text-olive-500 mb-6">{product.description}</p>

        {/* Variant selector */}
        {product.variants?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-olive-700 mb-2">Select Size / Filling</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  disabled={v.stock_qty === 0}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors
                    ${selectedVariant?.id === v.id
                      ? 'border-olive-600 bg-olive-600 text-white'
                      : 'border-cream-300 text-olive-700 hover:border-olive-400'
                    }
                    ${v.stock_qty === 0 ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  {v.label}
                  {v.stock_qty === 0 && ' — sold out'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        {selectedVariant && (
          <p className="text-2xl font-semibold text-olive-800 mb-6">
            {formatCurrency(selectedVariant.price)}
          </p>
        )}

        {/* Qty + Add */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-olive-600 hover:bg-cream-100 transition-colors"
            >−</button>
            <span className="px-4 py-2 text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-2 text-olive-600 hover:bg-cream-100 transition-colors"
            >+</button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock_qty === 0}
            className="flex-1"
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </Button>
        </div>

        {/* Ingredients */}
        {product.ingredients && (
          <div className="border-t border-cream-200 pt-5">
            <p className="text-sm font-medium text-olive-700 mb-1">Ingredients</p>
            <p className="text-sm text-olive-500">{product.ingredients}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
