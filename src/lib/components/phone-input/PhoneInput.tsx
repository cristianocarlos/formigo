import {PhoneIcon} from 'lucide-react';
import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputPrepend from '@/lib/components/InputPrepend';
import InputWrapper from '@/lib/components/InputWrapper';
import useTextInputHandlers from '@/lib/components/text-input/useTextInputHandlers';
import {resolveInputValue} from '@/lib/utils/helper';
import {heightStyle, prependStyle, resolvedPadding, resolveInputStyle} from '@/lib/utils/inlineStyles';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {phoneNumberValidator} from '@/lib/utils/validators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';
import {MASKS} from '@/utils/masks';

import InputPrint from '../InputPrint';
import useMaskedInputHandlers from '../masked-input/useMaskedInputHandlers';
import PhoneInputDialingCodePicker from './PhoneInputDialingCodePicker';
import PhoneInputDialingCodePrepend from './PhoneInputDialingCodePrepend';
import useDialingCodePickerHandlers from './useDialingCodePickerHandlers';

import type {TPhoneInputProps} from '@/lib/types/input';

export default function PhoneInput(props: TPhoneInputProps) {
  const {
    attribute,
    autoComplete = 'off',
    className = '',
    countryDataParams,
    dataType,
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    iconElement = <PhoneIcon />,
    initValue,
    label,
    labelHint,
    maxLength = 13,
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
    readOnly,
    refComponent,
    refHtmlInput: refHtmlInputResolved,
    validateOnlyOnSubmit,
  });

  const {
    dialingCodeCountryData,
    handleDialingCodePickerButtonMouseDown,
    handleDialingCodePickerInputBlur,
    handleDialingCodePickerOutsideClick,
    handleDialingCodePickerPick,
    isCountryHome,
    isDialingCodePickerOpen,
  } = useDialingCodePickerHandlers({
    countryDataAttribute: countryDataParams?.attribute,
    disabled,
    handleInputBlur, // handleMaskInputBlur tem o handleInputBlur agragado
    readOnly,
    refHtmlInput: refHtmlInputResolved,
  });

  const resolvedMask = isCountryHome ? MASKS.brPhoneNumber : undefined;

  const {handleMaskInputBeforeInput, handleMaskInputBlur, handleMaskInputPaste} = useMaskedInputHandlers({
    attribute,
    disabled,
    handleInputBlur: handleDialingCodePickerInputBlur,
    mask: resolvedMask,
    maxLength,
    readOnly,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
    label,
    mask: resolvedMask,
    placeholder,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue, resolvedMask);
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
      updateTriggerValue: isCountryHome,
      validationType: VALIDATION_TYPES.input,
    },
    (validators || []).concat([
      phoneNumberValidator({
        attribute,
        countryDataAttribute: countryDataParams?.attribute,
      }),
    ]),
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const inputStyle = countryDataParams ? {paddingLeft: 72} : resolveInputStyle(!!iconElement, false);

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'PhoneInput', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={className}
      data-test="form-element-phone-input"
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
            maxLength={maxLength}
            name={initProps.name}
            onBeforeInput={handleMaskInputBeforeInput}
            onBlur={handleMaskInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            onKeyPress={handleMaskInputBeforeInput} // __deprecated
            onPaste={handleMaskInputPaste}
            placeholder={isCountryHome ? initProps.placeholder : undefined}
            readOnly={readOnly}
            ref={refHtmlInputResolved}
            style={inputStyle}
            type="tel"
            value={resolvedInputValue}
          />
          {countryDataParams ? (
            <PhoneInputDialingCodePrepend
              countryData={dialingCodeCountryData}
              disabled={disabled}
              handleMouseDown={handleDialingCodePickerButtonMouseDown}
              style={{paddingLeft: resolvedPadding, width: inputStyle.paddingLeft}}
            />
          ) : undefined}
          {countryDataParams && isDialingCodePickerOpen ? (
            <PhoneInputDialingCodePicker
              countryDataParams={countryDataParams}
              handleOutsideClick={handleDialingCodePickerOutsideClick}
              handlePick={handleDialingCodePickerPick}
            />
          ) : undefined}
          {!countryDataParams && iconElement ? (
            <InputPrepend iconElement={iconElement} style={prependStyle} />
          ) : undefined}
        </div>
      )}
    </InputWrapper>
  );
}
