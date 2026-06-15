import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputPrepend from '@/lib/components/InputPrepend';
import InputWrapper from '@/lib/components/InputWrapper';
import useTextInputHandlers from '@/lib/components/text-input/useTextInputHandlers';
import {heightStyle, prependStyle, resolveInputStyle} from '@/lib/utils/inlineStyles';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';

import {strongPasswordValidator} from './helper';
import PasswordStrenghtMeter from './PasswordStrenghtMeter';

import type {TPasswordInputProps} from '@/lib/types/input';

export default function PasswordInput(props: TPasswordInputProps) {
  const {
    allowSavingCredentials,
    attribute,
    autoComplete = 'off', // uniqueId() bloqueia o autofill de endereço, mas não o autocomplete, e vice-versa
    className = '',
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    hasStrenghtMeter,
    iconElement,
    label,
    labelHint,
    maxLength = 40,
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

  const {handleInputBlur, handleInputChange, handleInputFocus} = useTextInputHandlers({
    attribute,
    disabled,
    handleBlur,
    handleFocus,
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

  /**
   * VALIDATORS
   */

  const initValidators = hasStrenghtMeter ? [strongPasswordValidator({attribute})] : [];

  useValidators(
    {
      attribute,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.input,
    },
    (validators || []).concat(initValidators),
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  // preventAskForSavingPassword inclui um input text antes da senha
  // pq navegador automáticamente entende o campo de cima como login
  return (
    <InputWrapper
      attribute={attribute}
      className={className}
      inputId={initProps.id}
      label={label}
      labelHint={labelHint}
    >
      <div className="relative" style={heightStyle}>
        {allowSavingCredentials ? undefined : <input style={{display: 'none'}} type="text" />}
        <HtmlElement.Input
          autoComplete={autoComplete}
          disabled={disabled}
          id={initProps.id}
          maxLength={initProps.maxLength}
          name={initProps.name}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={initProps.placeholder}
          readOnly={readOnly}
          ref={refHtmlInputResolved}
          style={resolveInputStyle(!!iconElement, false)}
          type="password"
        />
        <InputPrepend iconElement={iconElement} style={prependStyle} />
      </div>
      {hasStrenghtMeter ? <PasswordStrenghtMeter value={attrValue} /> : undefined}
    </InputWrapper>
  );
}
