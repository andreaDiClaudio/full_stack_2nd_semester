import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryEntity } from '@/flow_1/CategoryEntity';

// Create async thunk to fetch categories
export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const response = await fetch('http://localhost:3000/category');
  const data = await response.json();
  return data.data; // Assuming 'data' contains the categories
});

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
    return data.data; // Return the created category (assuming it contains `data`)
  }
);

// Async thunk to update a category
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, title }: { id: string; title: string }) => {
    const response = await fetch(`http://localhost:3000/category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error('Failed to update category');
    }

    const data = await response.json();
    return data.data;
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
    updateCategoryInList: (state, action: PayloadAction<CategoryEntity>) => {
      const updatedCategory = action.payload;
      const index = state.categories.findIndex(category => category.id === updatedCategory.id);
      if (index !== -1) {
        state.categories[index] = updatedCategory; // Replace the category with the updated one
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload; // Replace categories with the fetched data
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
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
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update category';
      });
      ;
  },
});

export const { setCategories, updateCategoryInList} = categorySlice.actions;

export default categorySlice.reducer;
