import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as ordersService from '../../services/ordersService';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    return await ordersService.create(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to place order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
  try {
    return await ordersService.getMyOrders();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await ordersService.getAll(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await ordersService.updateStatus(id, status);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update order');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items:         [],
    currentOrder:  null,
    loading:       false,
    error:         null,
  },
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(createOrder.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyOrders.pending,   (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchMyOrders.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAllOrders.pending,   (state) => { state.loading = true; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchAllOrders.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

// Selectors
export const selectAllOrders    = (state) => state.orders.items;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError   = (state) => state.orders.error;
