import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryEntity } from '@/flow_1/CategoryEntity';

// Create async thunk to fetch categories
export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const response = await fetch('http://192.168.0.87:3000/category');
  const data = await response.json();
  return data.data; // Assuming 'data' contains the categories
});

// Async thunk to create a category
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryName: string) => {
    const response = await fetch('http://192.168.0.87:3000/category', {
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
    const response = await fetch(`http://192.168.0.87:3000/category/${id}`, {
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
    return data.data; // Return the updated category (assuming it contains `data`)
  }
);

// Async thunk to delete a category
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId: number) => {
    const response = await fetch(`http://192.168.0.87:3000/category/${categoryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.log(response);
      
      throw new Error('Failed to delete category');
    }

    return categoryId; // Return the ID of the deleted category
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
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update category';
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload); // Remove the deleted category by its ID
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete category';
      });
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;
