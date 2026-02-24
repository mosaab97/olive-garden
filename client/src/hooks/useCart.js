import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../features/cart/cartSlice';

const useCart = () => {
  const dispatch  = useDispatch();
  const items     = useSelector(selectCartItems);
  const count     = useSelector(selectCartCount);
  const subtotal  = useSelector(selectCartSubtotal);

  return {
    items,
    count,
    subtotal,
    addItem:        (item)                => dispatch(addToCart(item)),
    removeItem:     (variantId)           => dispatch(removeFromCart(variantId)),
    updateItemQty:  (variantId, quantity) => dispatch(updateQuantity({ variantId, quantity })),
    clear:          ()                    => dispatch(clearCart()),
  };
};

export default useCart;
