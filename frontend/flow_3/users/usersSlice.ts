// In your usersSlice.ts or wherever your slice is defined

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateUserDto } from './CreatedUsersDto';
import { UsersAPI } from './usersApi';
import * as SecureStore from 'expo-secure-store';

export const login = createAsyncThunk(
  'auth/login',
  async (createUserDto: CreateUserDto, thunkAPI) => {
    try {
      const response = await fetch(`http://192.168.0.87:3000/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserDto),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message); // Pass the error message to rejectWithValue
      }

      // Fallback if the error is not an instance of Error
      return thunkAPI.rejectWithValue('Unknown error');
    }
  }

);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    token: '',
    errormessage: ''
  },
  reducers: {
    reloadJwtFromStorage: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = '';
      SecureStore.deleteItemAsync('jwt');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const token = action.payload.access_token;
      if (token) {
        SecureStore.setItemAsync('jwt', token);
        state.token = token;
        state.errormessage = ''; // Clear any previous error
      } else {
        state.errormessage = 'Invalid login response';
      }
    });

    builder.addCase(login.rejected, (state, action) => {
      // Ensure action.payload is a string before assigning to state.errormessage
      state.errormessage = typeof action.payload === 'string' ? action.payload : 'Error logging in';
    });
  },
});

export const { reloadJwtFromStorage, logout } = userSlice.actions;

export default userSlice.reducer;