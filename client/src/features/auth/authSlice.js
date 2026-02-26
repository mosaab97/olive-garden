import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

const tokenFromStorage = localStorage.getItem('accessToken');
const userFromStorage  = JSON.parse(localStorage.getItem('user') || 'null');

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { return await authService.register(data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { return await authService.login(data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try { return await authService.updateMe(data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Update failed'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        userFromStorage,
    accessToken: tokenFromStorage,
    loading:     false,
    error:       null,
    successMsg:  null,
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
    clearMessages(state) {
      state.error      = null;
      state.successMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(login.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateProfile.pending,   (state) => { state.loading = true; state.error = null; state.successMsg = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading    = false;
        state.successMsg = 'Profile updated successfully';
        // Merge updated fields into stored user
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, setCredentials, clearMessages } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser  = (state) => state.auth.user;
export const selectAccessToken  = (state) => state.auth.accessToken;
export const selectIsAdmin      = (state) => state.auth.user?.role === 'admin';
export const selectAuthLoading  = (state) => state.auth.loading;
export const selectAuthError    = (state) => state.auth.error;
export const selectAuthSuccess  = (state) => state.auth.successMsg;
