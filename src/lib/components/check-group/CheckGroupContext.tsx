import {createContext, use} from 'react';

import type {TCheckGroupProps} from '@/lib/types/checkGroup';
import type {TInputChangeEventHandler} from '@/types/common';

type TCheckGroupContext = TCheckGroupProps & {
  handleInputChange: TInputChangeEventHandler;
  inputId: string;
  inputName: string;
};

export const CheckGroupContext = createContext<TCheckGroupContext | undefined>(undefined);

export function useCheckGroupContext() {
  const context = use(CheckGroupContext);
  if (!context) {
    throw Error('CheckGroupContext must be used within a CheckGroup');
  }
  return context;
}
