import {
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
} from '@/lib/zustand/hooks';

import type {TTextInputProps} from '@/lib/types/input';
import type {
  TInputChangeEventHandler,
  TInputOrTextAreaFocusEventHandler,
  TTextAreaChangeEventHandler,
} from '@/types/common';
import type {RefObject} from 'react';

type TUseTextInputHandlers = Pick<
  TTextInputProps,
  | 'attribute'
  | 'disabled'
  | 'handleBlur'
  | 'handleFocus'
  | 'handleKeyDown'
  | 'readOnly'
  | 'refComponent'
  | 'validateOnlyOnSubmit'
> & {
  refHtmlInput: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
};

export default function useTextInputHandlers(params: TUseTextInputHandlers) {
  const {
    attribute,
    disabled,
    handleBlur,
    handleFocus,
    handleKeyDown,
    readOnly,
    refComponent,
    refHtmlInput,
    validateOnlyOnSubmit,
  } = params;

  const attrSetValue = useDispatchFormigoAttrSetValue(attribute);
  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);

  const inputFocus = (focusOptions?: FocusOptions) => {
    window.setTimeout(() => {
      // Pra focar no F5, há um atrazo curioso no primeiro carregamento
      refHtmlInput.current && refHtmlInput.current.focus(focusOptions);
    });
  };

  const replaceValue = (value?: string) => {
    attrSetValue(value);
  };

  const resetValue = () => {
    replaceValue(undefined);
  };

  const handleInputBlur: TInputOrTextAreaFocusEventHandler = (e) => {
    if (disabled || readOnly) return;
    if (!validateOnlyOnSubmit) {
      inputValidate();
    }
    if (typeof handleBlur === 'function') {
      handleBlur(e.target.value || undefined); // vazio vira undefined
    }
  };

  const handleInputChange: TInputChangeEventHandler & TTextAreaChangeEventHandler = (e) => {
    if (disabled || readOnly) return;
    attrSetValue(e.target.value || undefined); // vazio vira undefined
  };

  const handleInputFocus: TInputOrTextAreaFocusEventHandler = (e) => {
    if (disabled || readOnly) return;
    inputResetErrors();
    if (typeof handleFocus === 'function') {
      handleFocus(e);
    }
  };

  const handleInputKeyDown: TTextInputProps['handleKeyDown'] = (e) => {
    if (disabled || readOnly) return;
    if (typeof handleKeyDown === 'function') {
      handleKeyDown(e);
    }
  };

  if (refComponent) {
    refComponent.current = {
      inputFocus,
      replaceValue,
      resetError: inputResetErrors,
      resetValue,
    };
  }

  return {
    handleInputBlur,
    handleInputChange,
    handleInputFocus,
    handleInputKeyDown,
    resetValue,
  };
}
