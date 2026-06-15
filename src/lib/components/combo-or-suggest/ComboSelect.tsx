import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputAppend from '@/lib/components/InputAppend';
import InputWrapper from '@/lib/components/InputWrapper';
import {resolveInputValue} from '@/lib/utils/helper';
import {heightStyle} from '@/lib/utils/inlineStyles';
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
import {COMBO_OR_SUGGEST_INTENT, getAriaHtmlProps} from './helper';
import useComboOrSuggestHandlers from './useComboOrSuggestHandlers';
import useComboOrSuggestInitProps from './useComboOrSuggestInitProps';
import useSelectSearchDebounce from './useSelectSearchDebounce';

import type {TComboOrSuggestOptions, TComboSelectProps} from '@/lib/types/comboOrSuggest';

export default function ComboSelect<GOptionData extends TComboOrSuggestOptions[number]>(
  props: TComboSelectProps<GOptionData>,
) {
  const {
    attribute,
    autoComplete = 'off',
    className = '',
    disabled,
    forceValidateOnSubmit,
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
  const attrValueDescription = useSelectorFormigoAttrValue(
    auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel],
  );

  if (!isReady) return;

  const ariaHtmlProps = getAriaHtmlProps(initProps.id, isOpen);

  const resolvedInputValue = resolveInputValue(attrValueDescription, undefined, 'ComboSelect', attribute);

  const emptyIdHint = hasEmptyId ? YiiLang.formigo('textFormComboBoxHasEmptyid') : undefined;
  const classNameSet = `${className} ${hasEmptyId ? 'has-empty-id' : ''}`;

  return (
    <InputWrapper
      attribute={attribute}
      className={classNameSet}
      data-test="form-element-combo-select"
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
          <HtmlElement.ComboSelectInput
            aria-activedescendant={ariaHtmlProps.ariaActiveDescendantId}
            aria-autocomplete={ariaHtmlProps.ariaAutoComplete}
            aria-owns={ariaHtmlProps.ariaOwnsId}
            aria-readonly={readOnly}
            autoComplete={autoComplete}
            className="focus:[&+abbr]:from-white focus:[&+abbr]:to-white"
            disabled={disabled}
            id={initProps.id}
            maxLength={maxLength}
            name={initProps.descriptionName}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            placeholder={initProps.placeholder}
            readOnly={preventSearch || readOnly}
            ref={refHtmlInputResolved}
            role="combobox"
            style={initProps.inputStyle}
            value={resolvedInputValue}
          />
          {hasScreenId ? (
            <ComboScreenId
              attribute={attribute}
              className="bg-linear-to-b from-gray-50 to-gray-100"
              screenIdAttribute={auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemScreenId]}
              style={initProps.screenIdStyle}
            />
          ) : undefined}
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
