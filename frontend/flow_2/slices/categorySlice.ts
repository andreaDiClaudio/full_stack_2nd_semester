import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryEntity } from '@/flow_1/CategoryEntity';

interface CategoryState {
  categories: CategoryEntity[];
}

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryEntity[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;
