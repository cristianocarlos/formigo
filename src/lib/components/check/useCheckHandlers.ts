import {
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
  useSelectorFormigoAttrValue,
} from '@/lib/zustand/hooks';

import type {TCheckProps} from '@/lib/types/check';
import type {TInputChangeEventHandler} from '@/types/common';

type TUseCheckHandlers = {
  attribute: TCheckProps['attribute'];
  checkValue: TCheckProps['checkValue'];
  disabled: TCheckProps['disabled'];
  handleChange: TCheckProps['handleChange'];
  readOnly: TCheckProps['readOnly'];
  refComponent: TCheckProps['refComponent'];
  uncheckValue: TCheckProps['uncheckValue'];
  validateOnlyOnSubmit?: TCheckProps['validateOnlyOnSubmit'];
};

export default function useCheckHandlers(params: TUseCheckHandlers) {
  const {attribute, checkValue, disabled, handleChange, readOnly, refComponent, uncheckValue, validateOnlyOnSubmit} =
    params;

  const attrSetValue = useDispatchFormigoAttrSetValue(attribute);
  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);
  const attrValue = useSelectorFormigoAttrValue(attribute);

  const replaceValue = (value: boolean) => {
    attrSetValue(value ? checkValue : uncheckValue);
  };

  const resetValue = () => {
    if (attrValue === checkValue) {
      attrSetValue(uncheckValue);
    }
  };

  const handleInputChange: TInputChangeEventHandler = (e) => {
    if (disabled || readOnly) return;
    attrSetValue(e.target.checked ? checkValue : uncheckValue);
    if (!validateOnlyOnSubmit) {
      inputResetErrors();
      inputValidate();
    }
    if (typeof handleChange === 'function') {
      handleChange({checkValue: e.target.value, isChecked: e.target.checked});
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
  };
}
