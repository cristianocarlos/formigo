import {
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
  useStoreFormigoAttrGetValue,
} from '@/lib/zustand/hooks';

import type {TRadioGroupProps, TRadioGroupValue} from '@/lib/types/radioGroup';
import type {TInputChangeEventHandler, TInputMouseEventHandler} from '@/types/common';

type TUseRadioGroupHandlers = {
  attribute: TRadioGroupProps['attribute'];
  disabled: TRadioGroupProps['disabled'];
  handleChange: TRadioGroupProps['handleChange'];
  preventUncheck: TRadioGroupProps['preventUncheck'];
  readOnly: TRadioGroupProps['readOnly'];
  refComponent: TRadioGroupProps['refComponent'];
  validateOnlyOnSubmit: TRadioGroupProps['validateOnlyOnSubmit'];
};

export default function useRadioGroupHandlers(params: TUseRadioGroupHandlers) {
  const {attribute, disabled, handleChange, preventUncheck, readOnly, refComponent, validateOnlyOnSubmit} = params;

  const attrSetValue = useDispatchFormigoAttrSetValue(attribute);
  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);
  const attrGetValue = useStoreFormigoAttrGetValue(attribute);

  const replaceValue = (value?: TRadioGroupValue) => {
    attrSetValue(value);
  };

  const resetValue = () => {
    replaceValue(undefined);
  };

  const changeValue = (value?: TRadioGroupValue) => {
    attrSetValue(value);
    if (!validateOnlyOnSubmit) {
      inputResetErrors();
      inputValidate();
    }
    if (typeof handleChange === 'function') {
      handleChange(value);
    }
  };

  const handleInputChange: TInputChangeEventHandler = (e) => {
    if (disabled || readOnly) return;
    changeValue(e.target.value);
  };

  const handleInputClick: TInputMouseEventHandler = (e) => {
    if (disabled || readOnly) return;
    if (!preventUncheck && e.currentTarget.value === attrGetValue()) {
      changeValue(undefined);
    }
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
