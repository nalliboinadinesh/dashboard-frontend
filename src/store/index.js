import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import hostelReducer from './hostelSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    hostels: hostelReducer,
  },
});

export default store;
