import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';

// Create a store with the auth reducer and any other reducers you need
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add any other reducers here
  }
});
