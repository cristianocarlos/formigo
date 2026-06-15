import {CalendarClockIcon, ChevronDownIcon} from 'lucide-react';
import {useRef} from 'react';

import DateHourPicker from '@/lib/components/calendar/DateHourPicker';
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
import {dateHourValidator} from '@/lib/utils/validators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';
import {MASKS} from '@/utils/masks';

import useDatePickerHandlers from './useDatePickerHandlers';

import type {TDateHourInputProps} from '@/lib/types/input';

export default function DateHourInput(props: TDateHourInputProps) {
  const {
    attribute,
    autoComplete = 'off',
    bookingDataLoad,
    className = '',
    dataType,
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    handlePick,
    hasPicker,
    iconElement = <CalendarClockIcon />,
    initValue,
    label,
    labelHint,
    maxLength = 16,
    pickerPosition,
    placeholder,
    readOnly,
    refComponent,
    refHtmlInput,
    required,
    resetValueOnPick,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const refHtmlDivDropdown = useRef<HTMLDivElement>(null);
  const refHtmlInputDefault = useRef<HTMLInputElement>(null);
  const refHtmlInputResolved = refHtmlInput || refHtmlInputDefault; // Quando vem nas props, tem preferência

  /**
   * HANDLERS
   */

  const {handleInputBlur, handleInputChange, handleInputFocus, handleInputKeyDown, resetValue} = useTextInputHandlers({
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
    mask: MASKS.dateHour,
    maxLength,
    readOnly,
  });

  const {
    handleDatePickerButtonMouseDown,
    handleDatePickerInputBlur,
    handleDatePickerInputClick,
    handleDatePickerInputKeyDown,
    handleDatePickerOutsideClick,
    handleDatePickerPick,
    isDatePickerOpen,
  } = useDatePickerHandlers({
    attribute,
    disabled,
    handleInputBlur: handleMaskInputBlur, // handleMaskInputBlur tem o handleInputBlur agragado
    handleInputKeyDown,
    handlePick,
    hasPicker,
    mask: MASKS.dateHour,
    readOnly,
    refHtmlInput: refHtmlInputResolved,
    resetValue,
    resetValueOnPick,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
    label,
    mask: MASKS.dateHour,
    placeholder,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue, MASKS.dateHour);
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
    (validators || []).concat([dateHourValidator({attribute})]),
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'DateHourInput', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={className}
      inputId={initProps.id}
      label={label}
      labelHint={labelHint}
    >
      <div className="relative" ref={refHtmlDivDropdown} style={heightStyle}>
        <HtmlElement.Input
          autoComplete={autoComplete}
          data-type={dataType}
          disabled={disabled}
          id={initProps.id}
          maxLength={maxLength}
          name={initProps.name}
          onBeforeInput={handleMaskInputBeforeInput}
          onBlur={handleDatePickerInputBlur}
          onChange={handleInputChange}
          onClick={handleDatePickerInputClick}
          onFocus={handleInputFocus}
          onKeyDown={handleDatePickerInputKeyDown}
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
        {hasPicker ? (
          <InputAppend style={appendStyle}>
            <button disabled={disabled} onMouseDown={handleDatePickerButtonMouseDown} tabIndex={-1} type="button">
              <ChevronDownIcon
                className={`transition-all duration-200 ease-in-out ${isDatePickerOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </InputAppend>
        ) : undefined}
        {hasPicker ? (
          <DateHourPicker
            bookingDataLoad={bookingDataLoad}
            handleOutsideClick={handleDatePickerOutsideClick}
            handlePick={handleDatePickerPick}
            isOpen={isDatePickerOpen}
            pickerPosition={pickerPosition}
            refHtmlDivDropdown={refHtmlDivDropdown}
            value={attrValue}
          />
        ) : undefined}
      </div>
    </InputWrapper>
  );
}
