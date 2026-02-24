import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

// Persist tokens in localStorage
const tokenFromStorage = localStorage.getItem('accessToken');
const userFromStorage  = JSON.parse(localStorage.getItem('user') || 'null');

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    return await authService.register(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    return await authService.login(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        userFromStorage,
    accessToken: tokenFromStorage,
    loading:     false,
    error:       null,
  },
  reducers: {
    logout(state) {
      state.user        = null;
      state.accessToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    setCredentials(state, action) {
      state.user        = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading     = false;
        state.user        = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(login.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading     = false;
        state.user        = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser  = (state) => state.auth.user;
export const selectAccessToken  = (state) => state.auth.accessToken;
export const selectIsAdmin      = (state) => state.auth.user?.role === 'admin';
export const selectAuthLoading  = (state) => state.auth.loading;
export const selectAuthError    = (state) => state.auth.error;
