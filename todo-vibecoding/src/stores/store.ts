/**
 * Redux Store Configuration
 * Configures Redux Toolkit store with persistence and middleware
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { appConfig } from '@/config';

// Import slices
import authSlice from './slices/authSlice';
import todoSlice from './slices/todoSlice';

/**
 * Root reducer combining all slices
 */
const rootReducer = combineReducers({
  auth: authSlice,
  todos: todoSlice,
  // Add more slices here as needed
});

/**
 * Redux Persist configuration
 */
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Whitelist: specify which slices to persist
  whitelist: ['auth', 'todos'], // Persist auth and todos state
  // Blacklist: specify which slices NOT to persist
  blacklist: [], // Don't blacklist anything for now
};

/**
 * Persisted reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Redux store with middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // Enable Redux DevTools only in development
  devTools: appConfig.isDevelopment,
});

/**
 * Configure persistor for Redux Persist
 */
export const persistor = persistStore(store);

/**
 * Type definitions for TypeScript
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Typed hooks for use throughout the app
 */
export type AppStore = typeof store;

/**
 * Store utilities
 */
export const getState = () => store.getState();
export const dispatch = store.dispatch;

/**
 * Development utilities
 */
if (appConfig.isDevelopment) {
  // Make store available in window for debugging
  interface WindowWithReduxStore extends Window {
    __REDUX_STORE__?: typeof store;
  }
  (window as WindowWithReduxStore).__REDUX_STORE__ = store;
  
  // Log store state changes in development
  store.subscribe(() => {
    console.log('🔄 Store state updated:', store.getState());
  });
}

export default store;