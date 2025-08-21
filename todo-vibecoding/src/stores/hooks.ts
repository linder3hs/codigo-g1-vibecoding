/**
 * Redux Typed Hooks
 * Pre-typed versions of useDispatch and useSelector for TypeScript
 */

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed version of useDispatch hook
 * Use this instead of plain useDispatch
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of useSelector hook
 * Use this instead of plain useSelector
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Custom hook to get both dispatch and selector
 * Convenience hook for components that need both
 */
export const useRedux = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  
  return { dispatch, selector };
};

/**
 * Hook to get the entire store state (use sparingly)
 * Only use when you need the entire state tree
 */
export const useStoreState = () => useAppSelector((state) => state);