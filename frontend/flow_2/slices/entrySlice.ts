// entrySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { EntryEntity } from '../entity/EntryEntity';
import { CategoryEntity } from '@/flow_1/CategoryEntity';

interface EntryState {
  entryTitle: string;
  entryAmount: string;
  selectedCategory: string | null;
  entries: EntryEntity[];  // Add entries here
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EntryState = {
  entryTitle: '',
  entryAmount: '',
  selectedCategory: null,
  entries: [],  // Initialize entries as an empty array
  status: 'idle',
  error: null,
};

export const fetchEntries = createAsyncThunk('entries/fetchEntries', async () => {
  try {
    const response = await fetch('http://localhost:3000/entry');
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    const data = await response.json();

    return data.data; // Return the fetched entries
  } catch (error) {
    return ('Error fetching entries');
  }
}
);

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
      return data; // Return the created entry from the server
    } catch (error) {
      return rejectWithValue('Error creating entry');
    }
  }
);
// Define async thunk for updating an entry
export const updateEntry = createAsyncThunk(
  'entry/updateEntry',
  async (
    { id, title, amount, categoryId }: { id: number; title: string; amount: number; categoryId: number },
    { rejectWithValue }
  ) => {
    try {
      console.log(categoryId);

      const response = await fetch(`http://localhost:3000/entry/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          amount,
          categoryId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      const data = await response.json();
      return data; // Return the updated entry from the server
    } catch (error) {
      return rejectWithValue('Error updating entry');
    }
  }
);

// Async thunk to delete a category
export const deleteEntry = createAsyncThunk(
  'entry/deleteEntry',
  async (entryId: number) => {
    const response = await fetch(`http://localhost:3000/entry/${entryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.log(response);

      throw new Error('Failed to delete category');
    }

    return entryId; // Return the ID of the deleted entry
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
      // Handling createEntry async thunk
      .addCase(createEntry.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEntry.fulfilled, (state, action: PayloadAction<EntryEntity>) => {
        state.status = 'succeeded';
        // Optionally, add the new entry to the entries list if needed
        state.entries.push(action.payload);
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Handling fetchEntries async thunk
      .addCase(fetchEntries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEntries.fulfilled, (state, action: PayloadAction<EntryEntity[]>) => {
        state.status = 'succeeded';
        state.entries = action.payload; // Update the entries with the fetched data
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Handling updateEntry async thunk
      .addCase(updateEntry.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEntry.fulfilled, (state, action: PayloadAction<EntryEntity>) => {
        state.status = 'succeeded';
        // Update the entry in the state
        const updatedEntry = action.payload;
        const index = state.entries.findIndex((entry) => entry.id === updatedEntry.id);
        if (index !== -1) {
          state.entries[index] = updatedEntry;
        }
      })
      .addCase(updateEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter((entry) => entry.id !== action.payload); // Remove the deleted category by its ID
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete entry';
      });


  },
});

export const { setEntryTitle, setEntryAmount, setSelectedCategory, resetEntryForm } = entrySlice.actions;

export default entrySlice.reducer;
