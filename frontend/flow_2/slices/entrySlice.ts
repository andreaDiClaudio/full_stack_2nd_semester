// entrySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface EntryState {
  entryTitle: string;
  entryAmount: string;
  selectedCategory: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // To handle loading state
  error: string | null;
}

const initialState: EntryState = {
  entryTitle: '',
  entryAmount: '',
  selectedCategory: null,
  status: 'idle',
  error: null,
};

// Define async thunk for creating an entry
export const createEntry = createAsyncThunk(
  'entry/createEntry',
  async (entryData: { title: string; amount: number; categoryId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create entr');
      }


      const data = await response.json();
      console.log(data.data);
      return data.data; // Return the created entry from the server
    } catch (error) {
      return rejectWithValue('Error creating entry');
    }
  }
);

const entrySlice = createSlice({
  name: 'entry',
  initialState,
  reducers: {
    setEntryTitle: (state, action: PayloadAction<string>) => {
      state.entryTitle = action.payload;
    },
    setEntryAmount: (state, action: PayloadAction<string>) => {
      state.entryAmount = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    resetEntryForm: (state) => {
      state.entryTitle = '';
      state.entryAmount = '';
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEntry.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEntry.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setEntryTitle, setEntryAmount, setSelectedCategory, resetEntryForm } = entrySlice.actions;

export default entrySlice.reducer;
