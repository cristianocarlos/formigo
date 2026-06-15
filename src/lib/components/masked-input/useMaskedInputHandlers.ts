import {useDispatchFormigoAttrSetValue, useDispatchFormigoInputMask} from '@/lib/zustand/hooks';
import {getWindowLocationQueryString} from '@/utils/globals';
import {valueAsNumber} from '@/utils/helper';
import {getMaskFn, getPasteFn} from '@/utils/masks';

import type {TFormigoMasks} from '@/lib/types/formigo';
import type {TTextInputProps} from '@/lib/types/input';
import type {TInputBeforeInputEvent, TInputClipboardEventHandler, TInputFocusEventHandler} from '@/types/common';

const IS_CHROME_ON_ANDROID = navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Chrome/i);

function getMaskEventType() {
  // FIXME: masks. fritar quando estiver funcionando no Chrome-Android, eliminar também os eventos onKeyPress
  if (getWindowLocationQueryString() === '?forceBeforeInput') return 'beforeinput';
  return IS_CHROME_ON_ANDROID ? 'keypress' : 'beforeinput'; // Não funciona o keypress no Chrome-Android, mas vamos manter assim pra monitorar outros eventuais bugs
}

type TUseMaskedInputHandlers = Pick<TTextInputProps, 'attribute' | 'disabled' | 'maxLength' | 'readOnly'> & {
  handleInputBlur: TInputFocusEventHandler;
  mask?: TFormigoMasks;
};

export default function useMaskedInputHandlers(params: TUseMaskedInputHandlers) {
  const {attribute, disabled, handleInputBlur, mask, maxLength, readOnly} = params;

  const attrSetValue = useDispatchFormigoAttrSetValue(attribute);
  const inputMask = useDispatchFormigoInputMask(attribute);

  const handleMaskInputBlur: TInputFocusEventHandler = (e) => {
    if (disabled || readOnly) return;
    if (mask) inputMask(mask); // abroad phone doesn't have mask
    handleInputBlur(e);
  };

  const handleMaskInputBeforeInput = (e: TInputBeforeInputEvent) => {
    if (getMaskEventType() !== e.type) return;
    if (disabled || readOnly) return;
    const maskFn = getMaskFn(mask);
    if (typeof maskFn === 'function') {
      const maskedValue = maskFn(e, e.currentTarget.value);
      if (maskedValue) {
        e.currentTarget.value = maskedValue;
        attrSetValue(maskedValue);
      }
    }
  };

  const handleMaskInputPaste: TInputClipboardEventHandler = (e) => {
    e.preventDefault();
    const value = e.clipboardData.getData('text/plain');
    const {selectionEnd, selectionStart} = e.currentTarget;
    const resolvedSelectionEnd = valueAsNumber(selectionEnd || 0);
    const resolvedSelectionStart = valueAsNumber(selectionStart || 0);
    const resolvedMaxLength = valueAsNumber(maxLength || 0);
    const selectionLength = resolvedSelectionEnd - resolvedSelectionStart;
    const addedValue = (
      e.currentTarget.value.slice(0, resolvedSelectionStart) +
      // e.target.value.length - selectionLength = comprimento do valor depois de removido a seleção
      value.slice(0, resolvedMaxLength - (e.currentTarget.value.length - selectionLength)) +
      e.currentTarget.value.slice(resolvedSelectionEnd)
    ).slice(0, resolvedMaxLength);
    const pasteFn = getPasteFn(mask);
    if (typeof pasteFn === 'function') {
      const pastedValue = pasteFn(value);
      if (pastedValue) {
        attrSetValue(pastedValue);
      } else {
        attrSetValue(addedValue);
      }
    } else {
      attrSetValue(addedValue);
    }
    return true;
  };

  return {
    handleMaskInputBeforeInput,
    handleMaskInputBlur,
    handleMaskInputPaste,
  };
}
