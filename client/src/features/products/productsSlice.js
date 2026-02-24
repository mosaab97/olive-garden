import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productsService from '../../services/productsService';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await productsService.getAll(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load products');
  }
});

export const fetchProductBySlug = createAsyncThunk('products/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    return await productsService.getBySlug(slug);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Product not found');
  }
});

export const createProduct = createAsyncThunk('products/create', async (data, { rejectWithValue }) => {
  try {
    return await productsService.create(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await productsService.update(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await productsService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:          [],
    selectedProduct: null,
    loading:         false,
    error:           null,
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProducts.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchProductBySlug.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload; })
      .addCase(fetchProductBySlug.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createProduct.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedProduct?.id === action.payload.id) state.selectedProduct = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;

// Selectors
export const selectAllProducts     = (state) => state.products.items;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError   = (state) => state.products.error;
