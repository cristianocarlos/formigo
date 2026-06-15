import {createContext, use} from 'react';

import type {TCheckProps} from '@/lib/types/check';
import type {TInputChangeEventHandler} from '@/types/common';

type TCheckContext = TCheckProps & {
  handleInputChange: TInputChangeEventHandler;
  inputId: string;
  inputName: string;
};

export const CheckContext = createContext<TCheckContext | undefined>(undefined);

export function useCheckContext() {
  const context = use(CheckContext);
  if (!context) {
    throw Error('CheckContext must be used within a Check');
  }
  return context;
}
