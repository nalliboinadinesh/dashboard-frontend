import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('ownerToken') || null,
  owner: JSON.parse(localStorage.getItem('ownerData')) || null,
  isAuthenticated: !!localStorage.getItem('ownerToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.owner = action.payload.owner;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      localStorage.setItem('ownerToken', action.payload.token);
      localStorage.setItem('ownerData', JSON.stringify(action.payload.owner));
    },
    loginError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.token = null;
      state.owner = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('ownerToken');
      localStorage.removeItem('ownerData');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, loginSuccess, loginError, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
