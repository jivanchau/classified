import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { authReducer, initialAuthState } from './authSlice';
import type { AuthState } from '../types/auth';

const hasSession = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const loadAuthState = () => {
  if (!hasSession()) return initialAuthState;
  try {
    const raw = sessionStorage.getItem('auth');
    if (!raw) return initialAuthState;
    return { ...initialAuthState, ...JSON.parse(raw) };
  } catch {
    return initialAuthState;
  }
};

const saveAuthState = (state: AuthState) => {
  if (!hasSession()) return;
  try {
    if (state.token) {
      sessionStorage.setItem('auth', JSON.stringify(state));
    } else {
      sessionStorage.removeItem('auth');
    }
  } catch {
    /* ignore persist errors */
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  preloadedState: {
    auth: loadAuthState()
  }
});

store.subscribe(() => saveAuthState(store.getState().auth));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
