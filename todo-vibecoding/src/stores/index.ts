/**
 * Store exports
 * Centralizes all store-related exports
 */

// Store configuration
export { default as store, persistor, getState, dispatch } from "./store";
export type { RootState, AppDispatch, AppStore } from "./store";

// Typed hooks
export {
  useAppDispatch,
  useAppSelector,
  useRedux,
  useStoreState,
} from "./hooks";

// Slices (will be added as they are created)
// export { default as authSlice } from './slices/authSlice';
// export { default as todoSlice } from './slices/todoSlice';
