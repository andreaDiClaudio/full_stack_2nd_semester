import { configureStore } from '@reduxjs/toolkit';
import entryReducer from './entrySlice';
import categoryReducer from './categorySlice';
import userReducer from "./../../flow_3/users/usersSlice";

export const store = configureStore({
  reducer: {
    entry: entryReducer,
    category: categoryReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;