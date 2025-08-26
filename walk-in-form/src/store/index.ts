
import { configureStore } from '@reduxjs/toolkit';
import walkInFormReducer from './slices/walkInFormSlice';

export const store = configureStore({
  reducer: {
    walkInForm: walkInFormReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
