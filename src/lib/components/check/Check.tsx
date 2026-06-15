import InputWrapper from '@/lib/components/InputWrapper';
import {CHECK_BOOL_FALSE, CHECK_BOOL_TRUE} from '@/lib/utils/checkOrRadio';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {useDispatchFormigoInputPrepare, useSelectorFormigoInputReadyValue} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import {CheckContext} from './CheckContext';
import Box from './options/Box';
import Switch from './options/Switch';
import useCheckHandlers from './useCheckHandlers';

import type {TCheckProps} from '@/lib/types/check';

Check.Box = Box;
Check.Switch = Switch;

export default function Check(props: TCheckProps) {
  const {
    attribute,
    checkValue = CHECK_BOOL_TRUE,
    children,
    className = '',
    disabled,
    forceValidateOnSubmit,
    handleChange,
    initValue,
    printMode,
    readOnly,
    refComponent,
    required,
    uncheckValue = CHECK_BOOL_FALSE,
    validateOnlyOnSubmit,
    validators,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange} = useCheckHandlers({
    attribute,
    checkValue,
    disabled,
    handleChange,
    readOnly,
    refComponent,
    uncheckValue,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({attribute});

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue);
  });

  /**
   * VALIDATORS
   */

  useValidators(
    {
      attribute,
      checkValue,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.checkBox,
    },
    validators,
  );

  /**
   * COMPONENT
   */

  if (!isReady) return;

  return (
    <CheckContext
      value={{
        ...props,
        checkValue, // Precisa se enviado aqui pra considerar default
        handleInputChange,
        inputId: initProps.id,
        inputName: initProps.name,
        uncheckValue, // Precisa se enviado aqui pra considerar default
      }}
    >
      <InputWrapper attribute={attribute} className={`${className} ${printMode ? 'print-mode' : ''}`} role="checkbox">
        {children}
      </InputWrapper>
    </CheckContext>
  );
}
