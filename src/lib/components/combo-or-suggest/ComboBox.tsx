import {SearchIcon} from 'lucide-react';
import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputAppend from '@/lib/components/InputAppend';
import InputPrepend from '@/lib/components/InputPrepend';
import InputWrapper from '@/lib/components/InputWrapper';
import {resolveInputValue} from '@/lib/utils/helper';
import {heightStyle, prependStyle} from '@/lib/utils/inlineStyles';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {comboBoxSelectedOnlyValidator} from '@/lib/utils/validators';
import {
  useDispatchFormigoProduceFormState,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';
import YiiLang from '@/utils/yii-lang';

import InputPrint from '../InputPrint';
import {
  COMBO_OR_SUGGEST_ATTRIBUTE_KEYS,
  getValuesAttributes,
  updateProxyStateValues,
  useAuxAttributes,
} from './attributesHelper';
import ComboOrSuggestAddButton from './ComboOrSuggestAddButton';
import ComboOrSuggestArrow from './ComboOrSuggestArrow';
import ComboOrSuggestClearButton from './ComboOrSuggestClearButton';
import ComboOrSuggestDataList from './ComboOrSuggestDataList';
import ComboScreenId from './ComboScreenId';
import ComboValueHidden from './ComboValueHidden';
import {COMBO_OR_SUGGEST_INTENT, getAriaHtmlProps, XHR_LIMIT} from './helper';
import useBoxSearchDebounce from './useBoxSearchDebounce';
import useComboOrSuggestHandlers from './useComboOrSuggestHandlers';
import useComboOrSuggestInitProps from './useComboOrSuggestInitProps';

import type {TComboBoxProps, TComboOrSuggestOptions} from '@/lib/types/comboOrSuggest';

export default function ComboBox<GOptionData extends TComboOrSuggestOptions[number]>(
  props: TComboBoxProps<GOptionData>,
) {
  const {
    attribute,
    autoComplete = 'off',
    className = '',
    disabled,
    forceValidateOnSubmit,
    getShouldSingleListItemPick,
    handleBlur,
    handleFocus,
    handleOpen,
    handlePick,
    handleRemove,
    hasEmptyId,
    hasExtra,
    hasScreenId,
    hideClearButton,
    initValue,
    invalidItemType,
    isInitOpen,
    isSelectedOnly = true,
    itemFormatter,
    itemGroupTitles,
    label,
    labelHint,
    maxLength,
    notFoundOption = YiiLang.formigo('textFormComboBoxNotFound'),
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
    getShouldSingleListItemPick,
    handleBlur,
    handleFocus,
    handleOpen,
    handlePick,
    handleRemove,
    intent: COMBO_OR_SUGGEST_INTENT.comboBox,
    isInitOpen,
    isSelectedOnly,
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
    placeholder,
  });

  const produceFormState = useDispatchFormigoProduceFormState();
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    produceFormState((proxyState, {attrGetValueIn, mutatorInputReadySetValue}) => {
      if (initValue) {
        const currentAttrValue = attrGetValueIn(proxyState, attribute);
        if (!currentAttrValue) {
          updateProxyStateValues(proxyState, valuesAttributes, initValue);
        }
      }
      mutatorInputReadySetValue(proxyState, attribute, true);
    });
  });

  /**
   * VALIDATORS
   */

  const initValidators = isSelectedOnly
    ? [
        comboBoxSelectedOnlyValidator({
          attribute,
          comboOptionLabelAttribute: auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel],
        }),
      ]
    : [];
  useValidators(
    {
      attribute,
      comboOptionLabelAttribute: auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel],
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.combo,
    },
    (validators || []).concat(initValidators),
  );

  /**
   * SEARCH
   */

  const {handleComboBoxSearchDebounceKeyDown, loadMore} = useBoxSearchDebounce(
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
  const attrValueDescription = useSelectorFormigoAttrValue(
    auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel],
  );

  if (!isReady) return;

  const ariaHtmlProps = getAriaHtmlProps(initProps.id, isOpen);

  const resolvedInputValue = resolveInputValue(attrValueDescription, undefined, 'ComboBox', attribute);

  const emptyIdHint = hasEmptyId ? YiiLang.formigo('textFormComboBoxHasEmptyid') : undefined;

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
        <div className="relative" ref={refHtmlInputDiv} style={heightStyle} title={emptyIdHint}>
          <ComboValueHidden
            attribute={attribute}
            disabled={disabled}
            extraAttribute={hasExtra ? auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemExtra] : undefined}
            screenIdAttribute={
              hasScreenId ? auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemScreenId] : undefined
            }
          />
          <HtmlElement.ComboBoxInput
            aria-activedescendant={ariaHtmlProps.ariaActiveDescendantId}
            aria-autocomplete={ariaHtmlProps.ariaAutoComplete}
            aria-owns={ariaHtmlProps.ariaOwnsId}
            aria-readonly={readOnly}
            autoComplete={autoComplete}
            className={`${hasEmptyId ? 'text-red-400' : ''}`}
            disabled={disabled}
            id={initProps.id}
            maxLength={maxLength}
            name={initProps.descriptionName}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
            onKeyDown={handleComboBoxSearchDebounceKeyDown}
            placeholder={initProps.placeholder}
            readOnly={readOnly}
            ref={refHtmlInputResolved}
            style={initProps.inputStyle}
            value={resolvedInputValue}
          />
          {hasScreenId ? (
            <ComboScreenId
              attribute={attribute}
              className="bg-white"
              screenIdAttribute={auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemScreenId]}
              style={initProps.screenIdStyle}
            />
          ) : undefined}
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
