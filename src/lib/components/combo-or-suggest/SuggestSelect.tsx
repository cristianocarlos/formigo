import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputAppend from '@/lib/components/InputAppend';
import InputWrapper from '@/lib/components/InputWrapper';
import {resolveInputValue} from '@/lib/utils/helper';
import {heightStyle} from '@/lib/utils/inlineStyles';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import InputPrint from '../InputPrint';
import {getValuesAttributes, useAuxAttributes} from './attributesHelper';
import ComboOrSuggestAddButton from './ComboOrSuggestAddButton';
import ComboOrSuggestArrow from './ComboOrSuggestArrow';
import ComboOrSuggestClearButton from './ComboOrSuggestClearButton';
import ComboOrSuggestDataList from './ComboOrSuggestDataList';
import {COMBO_OR_SUGGEST_INTENT, getAriaHtmlProps} from './helper';
import useComboOrSuggestHandlers from './useComboOrSuggestHandlers';
import useComboOrSuggestInitProps from './useComboOrSuggestInitProps';
import useSelectSearchDebounce from './useSelectSearchDebounce';

import type {TComboOrSuggestOptions, TSuggestSelectProps} from '@/lib/types/comboOrSuggest';

export default function SuggestSelect<GOptionData extends TComboOrSuggestOptions[number]>(
  props: TSuggestSelectProps<GOptionData>,
) {
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
    handleOpen,
    handlePick,
    handleRemove,
    hideClearButton,
    initValue,
    invalidItemType,
    isInitOpen,
    itemFormatter,
    label,
    labelHint,
    maxLength,
    notFoundOption,
    options,
    placeholder,
    preventSearch,
    printMode,
    readOnly,
    refComponent,
    refHtmlInput,
    renderAddButton,
    required,
    resetValueOnPick,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const selectOptionsRef = useRef(options.slice());

  const refHtmlInputDiv = useRef<HTMLDivElement>(null);
  const refHtmlInputDefault = useRef<HTMLInputElement>(null);
  const refHtmlInputResolved = refHtmlInput || refHtmlInputDefault; // Quando vem nas props, tem preferência

  const auxAttributes = useAuxAttributes(attribute);
  const valuesAttributes = getValuesAttributes(attribute, auxAttributes);

  /**
   * HANDLERS
   */

  const {
    handleArrowClick,
    handleClearClick,
    handleDataListPick,
    handleDataListRemove,
    handleInputBlur,
    handleInputChange,
    handleInputClick,
    handleInputFocus,
    handleInputKeyDown,
    handleSearchEnd,
    isOpen,
    replaceOptions,
    resetDataList,
    resultOptions,
    searchTerm,
    shouldLoadDataList,
  } = useComboOrSuggestHandlers<GOptionData>({
    attribute,
    disabled,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handleOpen,
    handlePick,
    handleRemove,
    intent: COMBO_OR_SUGGEST_INTENT.suggest,
    isInitOpen,
    notFoundOption,
    readOnly,
    refComponent,
    refHtmlInput: refHtmlInputResolved,
    refHtmlInputDiv,
    renderAddButton,
    resetValueOnPick,
    selectOptionsRef,
    validateOnlyOnSubmit,
    valuesAttributes,
  });

  /**
   * INIT
   */

  const initProps = useComboOrSuggestInitProps({
    attribute,
    auxAttributes,
    hasPrepend: false, // Sem ícone
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
      validationType: VALIDATION_TYPES.suggest,
    },
    validators,
  );

  /**
   * SEARCH
   */

  useSelectSearchDebounce<GOptionData>({
    handleEnd: handleSearchEnd,
    selectOptions: selectOptionsRef.current,
    shouldLoadDataList,
    term: searchTerm,
  });

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const ariaHtmlProps = getAriaHtmlProps(initProps.id, isOpen);

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'SuggestSelect', attribute);

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
        <div className="relative" ref={refHtmlInputDiv} style={heightStyle}>
          <HtmlElement.ComboSelectInput
            aria-activedescendant={ariaHtmlProps.ariaActiveDescendantId}
            aria-autocomplete={ariaHtmlProps.ariaAutoComplete}
            aria-owns={ariaHtmlProps.ariaOwnsId}
            aria-readonly={readOnly}
            autoComplete={autoComplete}
            data-type={dataType}
            disabled={disabled}
            id={initProps.id}
            maxLength={initProps.maxLength}
            name={initProps.name}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={initProps.placeholder}
            readOnly={preventSearch || readOnly}
            ref={refHtmlInputResolved}
            role="combobox"
            style={initProps.inputStyle}
            value={resolvedInputValue}
          />
          <InputAppend className="justify-end" style={initProps.appendStyle}>
            {hideClearButton ? undefined : (
              <ComboOrSuggestClearButton attrValue={attrValue} handleClearClick={handleClearClick} />
            )}
            <ComboOrSuggestArrow
              attribute={attribute}
              handleClick={handleArrowClick}
              isOpen={isOpen}
              style={initProps.arrowStyle}
            />
          </InputAppend>
          {typeof renderAddButton === 'function' ? (
            <ComboOrSuggestAddButton
              isOpen={isOpen}
              renderAddButton={renderAddButton}
              replaceSelectOptions={replaceOptions}
              resetDataList={resetDataList}
            />
          ) : undefined}
          <ComboOrSuggestDataList<GOptionData>
            ariaActiveDescendantId={ariaHtmlProps.ariaActiveDescendantId}
            ariaOwnsId={ariaHtmlProps.ariaOwnsId}
            handlePick={handleDataListPick}
            handleRemove={handleDataListRemove}
            invalidItemType={invalidItemType}
            isOpen={isOpen}
            itemFormatter={itemFormatter}
            options={resultOptions}
            optionSelected={attrValue}
            resetDataList={resetDataList}
          />
        </div>
      )}
    </InputWrapper>
  );
}
