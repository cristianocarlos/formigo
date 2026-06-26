import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputPrepend from '@/lib/components/InputPrepend';
import InputWrapper from '@/lib/components/InputWrapper';
import useTextInputHandlers from '@/lib/components/text-input/useTextInputHandlers';
import {resolveInputValue} from '@/lib/utils/helper';
import {heightStyle, prependStyle, resolveInputStyle} from '@/lib/utils/inlineStyles';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {cnpjValidator} from '@/lib/utils/validators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';
import {MASKS} from '@/utils/masks';

import useMaskedInputHandlers from './useMaskedInputHandlers';

import type {TBaseInputProps} from '@/lib/types/input';

export default function CnpjInput(props: TBaseInputProps) {
  const {
    attribute,
    autoComplete = 'off',
    className = '',
    dataType,
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    iconElement,
    initValue,
    label,
    labelHint,
    maxLength = 18,
    placeholder,
    readOnly,
    refComponent,
    refHtmlInput,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const refHtmlInputDefault = useRef<HTMLInputElement>(null);
  const refHtmlInputResolved = refHtmlInput || refHtmlInputDefault; // Quando vem nas props, tem preferência

  /**
   * HANDLERS
   */

  const {handleInputBlur, handleInputChange, handleInputFocus, handleInputKeyDown} = useTextInputHandlers({
    attribute,
    disabled,
    handleBlur,
    handleFocus,
    readOnly,
    refComponent,
    refHtmlInput: refHtmlInputResolved,
    validateOnlyOnSubmit,
  });

  const {handleMaskInputBeforeInput, handleMaskInputBlur, handleMaskInputPaste} = useMaskedInputHandlers({
    attribute,
    disabled,
    handleInputBlur,
    mask: MASKS.cnpj,
    maxLength,
    readOnly,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
    label,
    mask: MASKS.cnpj,
    placeholder,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue, MASKS.cnpj);
  });

  /**
   * VALIDATORS
   */

  useValidators(
    {
      attribute,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.input,
    },
    (validators || []).concat([cnpjValidator({attribute})]),
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'CnpjInput', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={className}
      inputId={initProps.id}
      label={label}
      labelHint={labelHint}
    >
      <div className="relative" style={heightStyle}>
        <HtmlElement.Input
          autoComplete={autoComplete}
          data-type={dataType}
          disabled={disabled}
          id={initProps.id}
          maxLength={maxLength}
          name={initProps.name}
          onBeforeInput={handleMaskInputBeforeInput}
          onBlur={handleMaskInputBlur}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          onKeyPress={handleMaskInputBeforeInput} // __deprecated
          onPaste={handleMaskInputPaste}
          placeholder={initProps.placeholder}
          readOnly={readOnly}
          ref={refHtmlInputResolved}
          style={resolveInputStyle(!!iconElement, false)}
          type="text"
          value={resolvedInputValue}
        />
        <InputPrepend iconElement={iconElement} style={prependStyle} />
      </div>
    </InputWrapper>
  );
}
