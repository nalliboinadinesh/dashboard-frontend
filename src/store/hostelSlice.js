import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hostels: [],
  currentHostel: null,
  analytics: null,
  loading: false,
  error: null,
};

const hostelSlice = createSlice({
  name: 'hostels',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHostels: (state, action) => {
      state.hostels = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentHostel: (state, action) => {
      state.currentHostel = action.payload;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    addHostel: (state, action) => {
      state.hostels.push(action.payload);
    },
    updateHostel: (state, action) => {
      const index = state.hostels.findIndex((h) => h._id === action.payload._id);
      if (index !== -1) {
        state.hostels[index] = action.payload;
      }
    },
    deleteHostel: (state, action) => {
      state.hostels = state.hostels.filter((h) => h._id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setHostels,
  setCurrentHostel,
  setAnalytics,
  addHostel,
  updateHostel,
  deleteHostel,
  setError,
  clearError,
} = hostelSlice.actions;

export default hostelSlice.reducer;
