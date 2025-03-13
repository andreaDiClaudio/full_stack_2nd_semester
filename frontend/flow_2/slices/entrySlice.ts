import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EntryState {
  entryTitle: string;
  entryAmount: string;
  selectedCategory: string | null;
}

const initialState: EntryState = {
  entryTitle: '',
  entryAmount: '',
  selectedCategory: null,
};

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
});

export const { setEntryTitle, setEntryAmount, setSelectedCategory, resetEntryForm } = entrySlice.actions;

export default entrySlice.reducer;
