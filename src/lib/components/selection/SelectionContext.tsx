import {createContext, use} from 'react';

import type {TSelectionContext} from '@/lib/types/selection';

export const SelectionContext = createContext<TSelectionContext | undefined>(undefined);

export function useSelectionContext() {
  const context = use(SelectionContext);
  if (!context) {
    throw Error('SelectionContext must be used within a Selection');
  }
  return context;
}
