import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryEntity } from '@/flow_1/CategoryEntity';

// Async thunk to create a category
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryName: string) => {
    const response = await fetch('http://localhost:3000/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: categoryName }),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    const data = await response.json();
    console.log(data.data);
    
    return data; // Assuming the response contains the created category
  }
);

interface CategoryState {
  categories: CategoryEntity[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryEntity[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload); // Add the newly created category to the list
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create category';
      });
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;
