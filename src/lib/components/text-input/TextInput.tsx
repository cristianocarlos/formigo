import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputPrepend from '@/lib/components/InputPrepend';
import InputPrint from '@/lib/components/InputPrint';
import InputWrapper from '@/lib/components/InputWrapper';
import {resolveInputValue} from '@/lib/utils/helper';
import {heightStyle, prependStyle, resolveInputStyle} from '@/lib/utils/inlineStyles';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import useTextInputHandlers from './useTextInputHandlers';

import type {TTextInputProps} from '@/lib/types/input';

export default function TextInput(props: TTextInputProps) {
  const {
    attribute,
    autoComplete = 'off',
    className = '',
    dataType,
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handleKeyUp,
    iconElement,
    initValue,
    label,
    labelHint,
    maxLength,
    placeholder,
    printMode,
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
    handleKeyDown,
    readOnly,
    refComponent,
    refHtmlInput: refHtmlInputResolved,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
    label,
    maxLength,
    placeholder,
  });

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
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.input,
    },
    validators,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'TextInput', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={className}
      inputId={initProps.id}
      label={label}
      labelHint={labelHint}
    >
      {printMode ? (
        <InputPrint value={resolvedInputValue} />
      ) : (
        <div className="relative" style={heightStyle}>
          <HtmlElement.Input
            autoComplete={autoComplete}
            data-type={dataType}
            disabled={disabled}
            id={initProps.id}
            maxLength={initProps.maxLength}
            name={initProps.name}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={initProps.placeholder}
            readOnly={readOnly}
            ref={refHtmlInputResolved}
            style={resolveInputStyle(!!iconElement, false)}
            type="text"
            value={resolvedInputValue}
          />
          <InputPrepend iconElement={iconElement} style={prependStyle} />
        </div>
      )}
    </InputWrapper>
  );
}
