import {SearchIcon} from 'lucide-react';
import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputAppend from '@/lib/components/InputAppend';
import InputPrepend from '@/lib/components/InputPrepend';
import InputWrapper from '@/lib/components/InputWrapper';
import {resolveInputValue} from '@/lib/utils/helper';
import {heightStyle, prependStyle} from '@/lib/utils/inlineStyles';
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
import {COMBO_OR_SUGGEST_INTENT, getAriaHtmlProps, XHR_LIMIT} from './helper';
import useBoxSearchDebounce from './useBoxSearchDebounce';
import useComboOrSuggestHandlers from './useComboOrSuggestHandlers';
import useComboOrSuggestInitProps from './useComboOrSuggestInitProps';

import type {TComboOrSuggestOptions, TSuggestBoxProps} from '@/lib/types/comboOrSuggest';

export default function SuggestBox<GOptionData extends TComboOrSuggestOptions[number]>(
  props: TSuggestBoxProps<GOptionData>,
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
    itemGroupTitles,
    label,
    labelHint,
    maxLength,
    notFoundOption,
    placeholder,
    printMode,
    readOnly,
    refComponent,
    refHtmlInput,
    renderAddButton,
    required,
    resetValueOnPick,
    validateOnlyOnSubmit,
    validators,
    xhrQueryString,
    xhrUrl,
    xhrWaitingMillis = 400,
  } = props;

  const abortControllerRef = useRef(new AbortController());
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
    handleSearchMerge,
    handleSearchStart,
    isOpen,
    resetDataList,
    resultOptions,
    searchTerm,
    shouldLoadDataList,
  } = useComboOrSuggestHandlers({
    abortControllerRef,
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
    validateOnlyOnSubmit,
    valuesAttributes,
  });

  /**
   * INIT
   */

  const initProps = useComboOrSuggestInitProps({
    attribute,
    auxAttributes,
    hasPrepend: true,
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

  const {handleComboBoxSearchDebounceKeyDown, loadMore} = useBoxSearchDebounce<GOptionData>(
    {
      abortControllerRef,
      handleEnd: handleSearchEnd,
      handleKeyDown: handleInputKeyDown,
      handleMerge: handleSearchMerge,
      handleStart: handleSearchStart,
      queryString: xhrQueryString,
      shouldLoadDataList,
      term: searchTerm,
      url: xhrUrl,
    },
    xhrWaitingMillis,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const ariaHtmlProps = getAriaHtmlProps(initProps.id, isOpen);

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'SuggesBox', attribute);

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
          <HtmlElement.ComboBoxInput
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
            onKeyDown={handleComboBoxSearchDebounceKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={initProps.placeholder}
            readOnly={readOnly}
            ref={refHtmlInputResolved}
            style={initProps.inputStyle}
            value={resolvedInputValue}
          />
          <InputPrepend iconElement={<SearchIcon />} style={prependStyle} />
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
            <ComboOrSuggestAddButton isOpen={isOpen} renderAddButton={renderAddButton} resetDataList={resetDataList} />
          ) : undefined}
          <ComboOrSuggestDataList<GOptionData>
            ariaActiveDescendantId={ariaHtmlProps.ariaActiveDescendantId}
            ariaOwnsId={ariaHtmlProps.ariaOwnsId}
            handlePick={handleDataListPick}
            handleRemove={handleDataListRemove}
            invalidItemType={invalidItemType}
            isOpen={isOpen}
            itemFormatter={itemFormatter}
            itemGroupTitles={itemGroupTitles}
            options={resultOptions}
            optionSelected={attrValue}
            resetDataList={resetDataList}
            scrollerLoadMore={loadMore}
            scrollerXhrLimit={XHR_LIMIT}
          />
        </div>
      )}
    </InputWrapper>
  );
}
