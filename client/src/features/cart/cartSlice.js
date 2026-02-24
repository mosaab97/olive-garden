import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '[]');

const persist = (items) => localStorage.setItem('cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage, // [{ variantId, productName, variantLabel, price, quantity, image }]
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((i) => i.variantId === action.payload.variantId);
      if (existing) {
        existing.quantity += action.payload.quantity ?? 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 });
      }
      persist(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.variantId !== action.payload);
      persist(state.items);
    },
    updateQuantity(state, action) {
      const { variantId, quantity } = action.payload;
      const item = state.items.find((i) => i.variantId === variantId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.variantId !== variantId);
        }
      }
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems    = (state) => state.cart.items;
export const selectCartCount    = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
