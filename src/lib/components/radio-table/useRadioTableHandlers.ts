import {
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
  useDispatchFormigoProduceFormState,
} from '@/lib/zustand/hooks';

import type {TRadioTableProps, TRadioTableValues} from '@/lib/types/checkTableOrRadioTable';
import type {TInputChangeEventHandler} from '@/types/common';

type TUseRadioTableHandlers = Pick<
  TRadioTableProps,
  'attribute' | 'disabled' | 'handleChange' | 'readOnly' | 'refComponent' | 'validateOnlyOnSubmit'
>;

export default function useRadioTableHandlers(params: TUseRadioTableHandlers) {
  const {attribute, disabled, handleChange, readOnly, refComponent, validateOnlyOnSubmit} = params;

  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);
  const produceFormState = useDispatchFormigoProduceFormState();

  const changeState = (rowId: string, colValue?: string) => {
    produceFormState((proxyState, {attrGetValueIn, mutatorAttrSetValueIn}) => {
      const currentSelection = attrGetValueIn<TRadioTableValues>(proxyState, attribute);
      if (colValue) {
        const checkedItem = {[rowId]: colValue};
        mutatorAttrSetValueIn(proxyState, attribute, {...currentSelection, ...checkedItem});
      } else if (currentSelection && currentSelection[rowId]) {
        if (Object.keys(currentSelection).length === 1) {
          // Desmarcou última linha
          mutatorAttrSetValueIn(proxyState, attribute, undefined);
        } else {
          // Desmarcou alguma linha
          delete currentSelection[rowId];
        }
      }
    });
    if (!validateOnlyOnSubmit) {
      inputResetErrors();
      inputValidate();
    }
    if (typeof handleChange === 'function') {
      handleChange({colValue, rowId});
    }
  };

  const replaceValue = (value?: TRadioTableValues) => {
    produceFormState((proxyState, {mutatorAttrSetValueIn}) => {
      mutatorAttrSetValueIn(proxyState, attribute, value);
    });
  };

  const resetValue = () => {
    replaceValue(undefined);
  };

  const handleInputChange = (rowId: string): TInputChangeEventHandler => {
    return (e) => {
      if (disabled || readOnly) return;
      changeState(rowId, e.target.value || undefined);
    };
  };

  const handleInputClick = (rowId: string) => {
    return () => {
      if (disabled || readOnly) return;
      changeState(rowId, undefined);
    };
  };

  if (refComponent) {
    refComponent.current = {
      replaceValue,
      resetError: inputResetErrors,
      resetValue,
    };
  }

  return {
    handleInputChange,
    handleInputClick,
  };
}
