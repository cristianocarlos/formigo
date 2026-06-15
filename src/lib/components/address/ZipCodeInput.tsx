import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputAppend from '@/lib/components/InputAppend';
import InputPrepend from '@/lib/components/InputPrepend';
import InputWrapper from '@/lib/components/InputWrapper';
import useMaskedInputHandlers from '@/lib/components/masked-input/useMaskedInputHandlers';
import useTextInputHandlers from '@/lib/components/text-input/useTextInputHandlers';
import {resolveInputValue} from '@/lib/utils/helper';
import {appendStyle, heightStyle, prependStyle, resolveInputStyle} from '@/lib/utils/inlineStyles';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {zipCodeValidator} from '@/lib/utils/validators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';
import {MASKS} from '@/utils/masks';

import InputPrint from '../InputPrint';
import useZipCodeHandlers from './useZipCodeHandlers';
import ZipCodeSearchButton from './ZipCodeSearchButton';

import type {TZipCodeInputProps} from '@/lib/types/input';

export default function ZipCodeInput(props: TZipCodeInputProps) {
  const {
    attribute,
    autoComplete = 'off',
    className = '',
    dataType,
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    handleSearch,
    handleSearchCancel,
    iconElement,
    initValue,
    label,
    labelHint,
    maxLength = 9,
    placeholder,
    printMode,
    readOnly,
    refComponent,
    refHtmlInput,
    required,
    validateOnlyOnSubmit,
  } = props;

  const refHtmlButton = useRef<HTMLButtonElement>(null);
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

  const {handleZipCodeButtonClick, handleZipCodeInputKeyDown} = useZipCodeHandlers({
    disabled,
    handleInputKeyDown,
    handleSearch,
    handleSearchCancel,
    readOnly,
    refHtmlButton,
    refHtmlInput: refHtmlInputResolved,
  });

  const {handleMaskInputBeforeInput, handleMaskInputBlur, handleMaskInputPaste} = useMaskedInputHandlers({
    attribute,
    disabled,
    handleInputBlur,
    mask: MASKS.zipCode,
    maxLength,
    readOnly,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
    label,
    mask: MASKS.zipCode,
    placeholder,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue, MASKS.zipCode);
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
    [zipCodeValidator({attribute})],
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'ZipCodeInput', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={className}
      data-test="form-element-zip-code-input"
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
            onKeyDown={handleZipCodeInputKeyDown}
            onKeyPress={handleMaskInputBeforeInput} // __deprecated
            onPaste={handleMaskInputPaste}
            placeholder={initProps.placeholder}
            readOnly={readOnly}
            ref={refHtmlInputResolved}
            style={resolveInputStyle(!!iconElement, true)}
            type="text"
            value={resolvedInputValue}
          />
          <InputPrepend iconElement={iconElement} style={prependStyle} />
          <InputAppend style={appendStyle}>
            <ZipCodeSearchButton
              attribute={attribute}
              handleClick={handleZipCodeButtonClick}
              refHtmlButton={refHtmlButton}
            />
          </InputAppend>
        </div>
      )}
    </InputWrapper>
  );
}
