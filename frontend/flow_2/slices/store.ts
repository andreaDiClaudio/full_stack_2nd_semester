import { configureStore } from '@reduxjs/toolkit';
import entryReducer from './entrySlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    entry: entryReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
