import {
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
  useDispatchFormigoProduceFormState,
  useStoreFormigoAttrGetValue,
} from '@/lib/zustand/hooks';

import type {TCheckTableProps, TCheckTableValues} from '@/lib/types/checkTableOrRadioTable';
import type {TInputChangeEventHandler} from '@/types/common';

type TUseCheckTableHandlers = Pick<
  TCheckTableProps,
  'attribute' | 'disabled' | 'handleChange' | 'readOnly' | 'refComponent' | 'validateOnlyOnSubmit'
>;

export default function useCheckTableHandlers(params: TUseCheckTableHandlers) {
  const {attribute, disabled, handleChange, readOnly, refComponent, validateOnlyOnSubmit} = params;

  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);
  const produceFormState = useDispatchFormigoProduceFormState();
  const attrGetValue = useStoreFormigoAttrGetValue<TCheckTableValues>(attribute);

  const changeState = (rowId: string, colId: string, checkValue: string, isChecked: boolean) => {
    produceFormState((proxyState, {attrGetValueIn, mutatorAttrSetValueIn}) => {
      const currentSelection = attrGetValueIn<TCheckTableValues>(proxyState, attribute);
      let newSelection = currentSelection;
      if (isChecked) {
        if (newSelection) {
          if (!newSelection[rowId]) newSelection[rowId] = {};
          newSelection[rowId][colId] = checkValue;
        } else {
          newSelection = {[rowId]: {[colId]: checkValue}};
        }
        mutatorAttrSetValueIn(proxyState, attribute, newSelection);
      } else if (currentSelection) {
        delete currentSelection[rowId][colId];
        if (Object.keys(currentSelection[rowId]).length === 0) {
          delete currentSelection[rowId];
        }
        if (Object.keys(currentSelection).length === 0) {
          mutatorAttrSetValueIn(proxyState, attribute, undefined);
        }
      }
    });
    if (!validateOnlyOnSubmit) {
      inputResetErrors();
      inputValidate();
    }
    if (typeof handleChange === 'function') {
      handleChange({
        checkedValues: attrGetValue(),
        checkValue,
        colId,
        isChecked,
        rowId,
      });
    }
  };

  const replaceValue = (value?: TCheckTableValues) => {
    produceFormState((proxyState, {mutatorAttrSetValueIn}) => {
      mutatorAttrSetValueIn(proxyState, attribute, value);
    });
  };

  const resetValue = () => {
    replaceValue(undefined);
  };

  const handleInputChange = (rowId: string, colId: string): TInputChangeEventHandler => {
    return (e) => {
      if (disabled || readOnly) return;
      changeState(rowId, colId, e.target.value, e.target.checked);
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
  };
}
