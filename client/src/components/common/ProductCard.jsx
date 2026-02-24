import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import Button from '../ui/Button';
import useCart from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const primaryImage  = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const lowestVariant = product.variants?.reduce((min, v) =>
    v.price < (min?.price ?? Infinity) ? v : min, null);

  const handleQuickAdd = (e) => {
    e.preventDefault(); // don't navigate
    if (!lowestVariant) return;
    addItem({
      variantId:    lowestVariant.id,
      productName:  product.name,
      variantLabel: lowestVariant.label,
      price:        lowestVariant.price,
      image:        primaryImage?.url,
    });
  };

  return (
    <Link to={`/products/${product.slug}`} className="card group flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-cream-100">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-olive-300 text-4xl">🫒</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.category_name && (
          <p className="text-xs text-olive-400 uppercase tracking-wide mb-1">{product.category_name}</p>
        )}
        <h3 className="font-medium text-olive-900 mb-1 group-hover:text-olive-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-olive-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          {lowestVariant && (
            <p className="text-olive-700 font-semibold">
              From {formatCurrency(lowestVariant.price)}
            </p>
          )}
          <Button
            size="sm"
            onClick={handleQuickAdd}
            className="shrink-0"
          >
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
