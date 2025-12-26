import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from '../types/auth';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false
};

interface LoginPayload {
  token: string;
  user: AuthUser;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      state.error = undefined;
    },
    logout: state => {
      state.token = null;
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    }
  }
});

export const { loginSuccess, logout, setLoading, setError } = authSlice.actions;
export const authReducer = authSlice.reducer;
