import {createContext, use} from 'react';

import type {TRadioGroupProps} from '@/lib/types/radioGroup';
import type {TInputChangeEventHandler, TInputMouseEventHandler} from '@/types/common';
import type {RefObject} from 'react';

type TRadioGroupContext = TRadioGroupProps & {
  handleInputChange: TInputChangeEventHandler;
  handleInputClick: TInputMouseEventHandler;
  inputId: string;
  inputName: string;
  refHtmlOptionList: RefObject<HTMLDivElement | null>;
};

export const RadioGroupContext = createContext<TRadioGroupContext | undefined>(undefined);

export function useRadioGroupContext() {
  const context = use(RadioGroupContext);
  if (!context) {
    throw Error('RadioGroupContext must be used within a RadioGroup');
  }
  return context;
}
