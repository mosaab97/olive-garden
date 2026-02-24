import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/ui/Button';

const CartItem = ({ item, updateItemQty, removeItem }) => (
  <div className="flex items-center gap-4 py-5 border-b border-cream-200">
    <div className="h-20 w-20 rounded-lg bg-cream-100 overflow-hidden shrink-0">
      {item.image
        ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-3xl">🫒</div>
      }
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-olive-900 truncate">{item.productName}</p>
      <p className="text-sm text-olive-500">{item.variantLabel}</p>
      <p className="text-sm font-semibold text-olive-700 mt-1">{formatCurrency(item.price)}</p>
    </div>
    <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden">
      <button onClick={() => updateItemQty(item.variantId, item.quantity - 1)}
        className="px-2 py-1 text-olive-600 hover:bg-cream-100 transition-colors">−</button>
      <span className="px-3 py-1 text-sm">{item.quantity}</span>
      <button onClick={() => updateItemQty(item.variantId, item.quantity + 1)}
        className="px-2 py-1 text-olive-600 hover:bg-cream-100 transition-colors">+</button>
    </div>
    <p className="w-20 text-right font-semibold text-olive-800">
      {formatCurrency(item.price * item.quantity)}
    </p>
    <button onClick={() => removeItem(item.variantId)} className="text-olive-300 hover:text-red-500 transition-colors ml-2">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

const Cart = () => {
  const { items, subtotal, updateItemQty, removeItem, clear } = useCart();

  if (items.length === 0) return (
    <div className="text-center py-32">
      <p className="text-5xl mb-4">🛒</p>
      <h2 className="font-serif text-2xl text-olive-800 mb-2">Your cart is empty</h2>
      <p className="text-olive-400 mb-6">Add some olives to get started.</p>
      <Link to="/products"><Button>Shop Now</Button></Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-olive-900">Your Cart</h1>
        <button onClick={clear} className="text-sm text-olive-400 hover:text-red-500 transition-colors">
          Clear cart
        </button>
      </div>

      <div className="card p-6 mb-6">
        {items.map((item) => (
          <CartItem key={item.variantId} item={item} updateItemQty={updateItemQty} removeItem={removeItem} />
        ))}
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex justify-between text-sm text-olive-600 mb-2">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-olive-400 mb-4">
          <span>Shipping &amp; taxes</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between font-semibold text-olive-900 text-lg border-t border-cream-200 pt-4 mb-6">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <Link to="/checkout" className="block">
          <Button className="w-full" size="lg">Proceed to Checkout</Button>
        </Link>
        <Link to="/products" className="block text-center text-sm text-olive-400 hover:text-olive-700 mt-3 transition-colors">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
