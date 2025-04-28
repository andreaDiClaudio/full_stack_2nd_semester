import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CreateUserDto } from './CreatedUsersDto'
import { UsersAPI } from './usersApi'
import * as SecureStore from 'expo-secure-store';


export const signup = createAsyncThunk(
    'auth/signup', 
    async (createUserDto: CreateUserDto, thunkAPI) => {
        // the returned value will be the content of action.payload

      return await UsersAPI.signup(createUserDto)
    },
  )

export const login = createAsyncThunk(
  'auth/login',
  async (createUserDto: CreateUserDto, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserDto),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);


interface UserState {
  token: string,
  errormessage: string
}

const initialState: UserState = {
  token: '',
  errormessage: ''
} 

// Then, handle actions in your reducers:
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reloadJwtFromStorage: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    logout: (state) => {
      state.token = '';
      SecureStore.deleteItemAsync('jwt');
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(signup.fulfilled, (state, action) => {
      // Add user to the state array
      console.log("payload", action.payload);
      state.errormessage = "";
    }),
    builder.addCase(signup.rejected, (state, action) => {
        // Add user to the state array
        console.log("payload", action.payload);
        
        state.errormessage = "Error signing up";
    })

    builder.addCase(login.fulfilled, (state, action) => {

        const token = action.payload.access_token;
      
        if (token) {
          SecureStore.setItemAsync('jwt', token);
          state.token = token; 
          state.errormessage = '';
        } else {
          state.errormessage = 'Invalid login response';
        }
      });
    builder.addCase(login.rejected, (state, action) => {
        console.log("payload", action.payload);
        
        state.errormessage = "Error logging in";
    })
  },
})

// Action creators are generated for each case reducer function
export const { reloadJwtFromStorage, logout } = userSlice.actions

export default userSlice.reducer