import { createSlice, createAsyncThunk, PayloadAction,GetDispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import {AxiosInstance} from '../lib/axios';
import { io, Socket} from "socket.io-client";
import toast from "react-hot-toast";

// Define a type for the user state
interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic: string | null;
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  isSigningUp: boolean,
  isLoggingIn: boolean,
  onlineUsers: string[],
  socket: Socket |null,
  isUpdatingProfile: boolean
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  isSigningUp: false,
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,
  isUpdatingProfile: false
};

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const authCheck = createAsyncThunk(
    'user/checkAuth',
    async (_,{rejectWithValue}) => {
        try {
            const response = await AxiosInstance.get('/auth/check');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create async thunks for user operations
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('/auth/login', credentials);
      const data = response.data;
      await connectToSockect(data);
      return data;
    } catch (error) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const signUp = createAsyncThunk(
  'user/register',
  async (userData: { fullName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/uploadProfilePic',
  async(data: any, {rejectWithValue}) => {
    try {
      const response = await axios.post('/auth/update-profile', data);
      return response.data;
    }
    catch(error) {
      return rejectWithValue('Failed to update profile');
    }
  }
);

const connectToSockect = createAsyncThunk(
  'user/socketConnect',
  async (data: any, { dispatch }) => {
  const currentUser = data;
  if (currentUser) {
    //const user = JSON.parse(currentUser);
    const socket = io(BASE_URL, {
      query: {
        userid : currentUser.id
      }
    });

    socket.connect();
    dispatch(setSocket(socket));

    socket.on('getOnlineUsers', (userIds: string[]) => {
      dispatch(setOnlineUsers(userIds));
    });
    socket.emit('join', currentUser.id);

  }  
});

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Synchronous actions
    logout: (state) => {
      state.currentUser = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setSocket(state, action: PayloadAction<any>) {
      state.socket = action.payload;
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle async actions
    builder
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isLoggingIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register user
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isSigningUp = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(authCheck.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authCheck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(authCheck.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // .addCase(connectToSockect.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(connectToSockect.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.currentUser = action.payload;
      // })
      // .addCase(connectToSockect.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string;
      // });
  },
});

// Export actions and reducer
export const { logout, updateUserProfile , setSocket, setOnlineUsers} = userSlice.actions;
export default userSlice.reducer;