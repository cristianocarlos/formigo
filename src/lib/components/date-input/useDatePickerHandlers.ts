import {useCallback, useState} from 'react';

import {ARROW_DOWN, ARROW_UP, ENTER, ESC, TAB} from '@/lib/utils/keyMap';
import {useDispatchFormigoAttrSetValue} from '@/lib/zustand/hooks';
import {handleDoubleClick} from '@/utils/helper';
import {formatDate, formatDateHour} from '@/utils/luxonHelper';
import {MASKS} from '@/utils/masks';

import type {TFormigoMasks, TFormigoRefComponent} from '@/lib/types/formigo';
import type {TDateInputProps} from '@/lib/types/input';
import type {TButtonMouseEventHandler, TInputFocusEventHandler, TInputKeyboardEventHandler} from '@/types/common';
import type {TLuxonValid} from '@/types/thirdParty';

type TUseDatePickerHandlers = Pick<
  TDateInputProps,
  'attribute' | 'disabled' | 'handlePick' | 'hasPicker' | 'readOnly' | 'refHtmlInput' | 'resetValueOnPick'
> & {
  handleInputBlur: TInputFocusEventHandler;
  handleInputKeyDown: TInputKeyboardEventHandler;
  mask: TFormigoMasks;
  refHtmlInput: NonNullable<TDateInputProps['refHtmlInput']>;
  resetValue: TFormigoRefComponent['resetValue'];
};

export default function useDatePickerHandlers(params: TUseDatePickerHandlers) {
  const {
    attribute,
    disabled,
    handleInputBlur,
    handleInputKeyDown,
    handlePick,
    hasPicker,
    mask,
    readOnly,
    refHtmlInput,
    resetValue,
    resetValueOnPick,
  } = params;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const attrSetValue = useDispatchFormigoAttrSetValue(attribute);

  const handleDatePickerInputBlur: TInputFocusEventHandler = (e) => {
    if (disabled || readOnly) return;
    if (!isDatePickerOpen) {
      // If pra não rodar o validate em duas situações:
      // - no momento do pick
      // - ao iniciar navegação no picker (próximo mês, por exemplo)
      handleInputBlur(e);
    }
  };

  const handleDatePickerInputClick = () => {
    if (disabled || readOnly) return;
    if (!hasPicker) return;
    handleDoubleClick(
      () => {
        if (!isDatePickerOpen) {
          // só aciona se estiver fechado
          setIsDatePickerOpen(true);
        }
      },
      () => {
        if (isDatePickerOpen) {
          setIsDatePickerOpen(false);
        }
      },
    );
  };

  const handleDatePickerInputKeyDown: TInputKeyboardEventHandler = (e) => {
    if (disabled || readOnly) return;
    if (!hasPicker) return;
    handleInputKeyDown(e);
    switch (e.keyCode) {
      case ARROW_DOWN:
        e.preventDefault(); // bloqueia a rolagem
        if (!isDatePickerOpen) {
          // só aciona se estiver fechado
          setIsDatePickerOpen(true);
        }
        break;
      case ARROW_UP:
      case ENTER:
      case ESC:
        e.preventDefault(); // bloqueia a rolagem no ARROW_UP e o sumbit no ENTER (o ENTER nem sei se precisa/deve, maaass)
        if (isDatePickerOpen) {
          // só aciona se estiver aberto
          setIsDatePickerOpen(false);
        }
        break;
      case TAB:
        if (isDatePickerOpen) {
          // só aciona pse estiver aberto
          setIsDatePickerOpen(false);
        }
        break;
      default:
    }
  };

  const handleDatePickerPick = (pickedLuxon: TLuxonValid) => {
    const newValue = mask === MASKS.dateHour ? formatDateHour(pickedLuxon) : formatDate(pickedLuxon);
    attrSetValue(newValue);
    refHtmlInput.current?.focus(); // Para acionar o validate no blur
    setIsDatePickerOpen(false);
    if (typeof handlePick === 'function') {
      handlePick(newValue);
    }
    if (resetValueOnPick) {
      resetValue();
    }
  };

  const handleDatePickerButtonMouseDown: TButtonMouseEventHandler = (e) => {
    if (disabled || readOnly) return;
    e.preventDefault(); // Previne acionar o validate
    e.stopPropagation(); // Previne acionar o handleDatePickerOutsideClick
    refHtmlInput.current?.focus(); // Para acionar o validate no blur
    setIsDatePickerOpen((prevDatePickerOpen) => !prevDatePickerOpen);
  };

  const handleDatePickerOutsideClick = useCallback(() => {
    // focus necessário no seguinte cenário:
    // Abre picker, clica em qualquer lugar (perde o foco), fecha picker
    refHtmlInput.current?.focus(); // Para acionar o blur
    setIsDatePickerOpen(false);
  }, [refHtmlInput]);

  return {
    handleDatePickerButtonMouseDown,
    handleDatePickerInputBlur,
    handleDatePickerInputClick,
    handleDatePickerInputKeyDown,
    handleDatePickerOutsideClick,
    handleDatePickerPick,
    isDatePickerOpen,
  };
}
