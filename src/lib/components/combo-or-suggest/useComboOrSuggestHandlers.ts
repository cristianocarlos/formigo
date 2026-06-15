import {useCallback, useEffect, useState} from 'react';

import {ARROW_DOWN, ARROW_UP, BACKSPACE, COMMA, ENTER, ESC, TAB} from '@/lib/utils/keyMap';
import {
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
  useDispatchFormigoLoadingSetValue,
  useDispatchFormigoProduceFormState,
  useSelectorFormigoAttrValue,
} from '@/lib/zustand/hooks';
import {handleDoubleClick, valueAsString} from '@/utils/helper';
import {useDidMountEffect, useOutsideClickEffect} from '@/utils/hooks';

import {COMBO_OR_SUGGEST_VALUE_KEYS, updateProxyStateValues} from './attributesHelper';
import {COMBO_OR_SUGGEST_INTENT} from './helper';

import type {
  TComboOrSuggestBase,
  TComboOrSuggestBaseWithOptionData,
  TComboOrSuggestOptions,
  TComboOrSuggestPickedData,
  TComboOrSuggestValuesAttributes,
  TComboSelectProps,
  TSuggestSelectProps,
} from '@/lib/types/comboOrSuggest';
import type {
  TButtonMouseEventHandler,
  TInputChangeEventHandler,
  TInputFocusEventHandler,
  TInputKeyboardEventHandler,
  TLabelMouseEventHandler,
  TLiKeyboardEvent,
  TLiMouseEvent,
} from '@/types/common';
import type {RefObject} from 'react';

type TUseComboOrSuggestHandlers<GOptionData> = Pick<
  TComboOrSuggestBase,
  | 'attribute'
  | 'disabled'
  | 'handleBlur'
  | 'handleFocus'
  | 'handleOpen'
  | 'handlePick'
  | 'handleRemove'
  | 'isInitOpen'
  | 'notFoundOption'
  | 'readOnly'
  | 'resetValueOnPick'
  | 'validateOnlyOnSubmit'
> & {
  abortControllerRef?: RefObject<AbortController>; // Box
  getShouldSingleListItemPick?: TComboOrSuggestBaseWithOptionData<GOptionData>['getShouldSingleListItemPick'];
  handleKeyDown?: TSuggestSelectProps['handleKeyDown'];
  intent: keyof typeof COMBO_OR_SUGGEST_INTENT;
  isSelectedOnly?: TComboSelectProps['isSelectedOnly'];
  refComponent: TComboOrSuggestBaseWithOptionData<GOptionData>['refComponent'];
  refHtmlInput: NonNullable<TComboOrSuggestBase['refHtmlInput']>;
  refHtmlInputDiv: RefObject<HTMLDivElement | null>;
  renderAddButton: TComboOrSuggestBaseWithOptionData<GOptionData>['renderAddButton'];
  selectOptionsRef?: RefObject<Array<GOptionData>>; // Select
  valuesAttributes: TComboOrSuggestValuesAttributes;
};

function getEmptyValues(): TComboOrSuggestPickedData {
  return {
    [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]: undefined,
    [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: undefined,
    [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]: undefined,
    [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]: undefined,
    [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]: undefined,
    [COMBO_OR_SUGGEST_VALUE_KEYS.value]: undefined,
  };
}

export default function useComboOrSuggestHandlers<GOptionData extends TComboOrSuggestOptions[number]>(
  params: TUseComboOrSuggestHandlers<GOptionData>,
) {
  const {
    abortControllerRef, // Box
    attribute,
    disabled,
    getShouldSingleListItemPick,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handleOpen,
    handlePick,
    handleRemove,
    intent,
    isInitOpen,
    isSelectedOnly,
    notFoundOption,
    readOnly,
    refComponent,
    refHtmlInput,
    refHtmlInputDiv,
    renderAddButton,
    resetValueOnPick,
    selectOptionsRef, // Select
    validateOnlyOnSubmit,
    valuesAttributes,
  } = params;

  const [arrowDownFocusingOnFirstItem, setArrowDownFocusingOnFirstItem] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldLoadDataList, setShouldLoadDataList] = useState(false);
  const [resultOptions, setResultOptions] = useState((selectOptionsRef && selectOptionsRef.current) || []);

  // O debounce usa o searchTerm e não o valor presente no campo
  // É alimentado no onChange e zerado no pick
  // Caso contrário, ao acionar o pick ou limpar o campo a busca seria acionada
  const [searchTerm, setSearchTerm] = useState<string>(); // Não

  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);
  const setLoadingValue = useDispatchFormigoLoadingSetValue(attribute);
  const produceFormState = useDispatchFormigoProduceFormState();
  const attrValue = useSelectorFormigoAttrValue(attribute);
  const attrValueDescription = useSelectorFormigoAttrValue(
    valuesAttributes[COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel],
  );
  const attrValueExtra = useSelectorFormigoAttrValue(valuesAttributes[COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]);
  const attrValueOptionId = useSelectorFormigoAttrValue(valuesAttributes[COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]);
  const attrValueTypeId = useSelectorFormigoAttrValue(valuesAttributes[COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]);

  useDidMountEffect(() => {
    if (isInitOpen) {
      setShouldLoadDataList(true);
    }
  });

  useEffect(() => {
    if (isOpen && typeof handleOpen === 'function') {
      handleOpen();
    }
    // só interessa as alterações das propriedades declaradas
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [isOpen]);

  const inputFocus = useCallback(
    (focusOptions?: FocusOptions) => {
      window.setTimeout(() => {
        // Pra focar no F5, há um atrazo curioso no primeiro carregamento
        refHtmlInput.current && refHtmlInput.current.focus(focusOptions);
      });
    },
    [refHtmlInput],
  );

  const pickDataListItem = (
    itemValues: TComboOrSuggestPickedData,
    shouldFocus = true,
    shouldRunAdditionalHandlePick = true,
  ) => {
    resetDataList(shouldFocus);
    setSearchTerm(undefined);
    produceFormState((proxyState) => {
      updateProxyStateValues(proxyState, valuesAttributes, itemValues);
    });
    if (shouldRunAdditionalHandlePick && typeof handlePick === 'function') {
      const pickedData = {
        [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]: itemValues[COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel], // Combo
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: itemValues[COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra], // Combo/Suggest (somente picker, sem input)
        // [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]: itemValues[COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId], // Combo / Não precisa ser enviado ao handlePick
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]: itemValues[COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId], // Combo/Suggest (somente picker, sem input)
        [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]: itemValues[COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId], // Suggest (somente picker, sem input)
        [COMBO_OR_SUGGEST_VALUE_KEYS.value]: itemValues[COMBO_OR_SUGGEST_VALUE_KEYS.value], // Combo/Suggest
      };
      if (intent === 'suggest') {
        delete pickedData[COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel];
      } else {
        delete pickedData[COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId];
      }
      handlePick(pickedData);
    }
  };

  const replaceOptions = (newOptions: Array<GOptionData>) => {
    if (selectOptionsRef) {
      selectOptionsRef.current = newOptions;
    }
  };

  const replaceValue = (
    values: TComboOrSuggestPickedData,
    shouldFocus = false,
    shouldRunAdditionalHandlePick = false,
  ) => {
    // Aciona o pick pra rodar o handlePick existente
    pickDataListItem(values, shouldFocus, shouldRunAdditionalHandlePick);
  };

  const resetDataList = useCallback(
    (shouldFocus?: boolean) => {
      setResultOptions([]);
      setIsOpen(false);
      setShouldLoadDataList(false);
      if (shouldFocus) {
        // No data list, ao selecionar com ENTER
        // No data list, ao fechar com ESC
        inputFocus();
      }
    },
    [inputFocus],
  );

  useOutsideClickEffect(
    refHtmlInputDiv,
    'mousedown',
    useCallback(() => {
      // Não da pra implementar no blur por um único cenário:
      // Lista aberta, seta pra baixo pra navegar na lista. Já deu blur no campo ao iniciar navegação na lista
      if (isOpen) resetDataList(false);
    }, [resetDataList, isOpen]),
  );

  const resetValue = (shouldFocus = false, shouldRunAdditionalHandlePick = false) => {
    replaceValue(getEmptyValues(), shouldFocus, shouldRunAdditionalHandlePick);
  };

  const handleArrowClick: TLabelMouseEventHandler = (e) => {
    if (disabled || readOnly) return;
    e.preventDefault();
    const targetStyle = e.currentTarget.style;
    targetStyle.pointerEvents = 'none'; // Previne que o duplo clique no input seja acionado, de brinde previne o blink abre/fecha
    setTimeout(() => (targetStyle.pointerEvents = 'auto'), 400);
    if (isOpen) {
      resetDataList(false);
    } else {
      inputFocus();
    }
    setShouldLoadDataList(!isOpen);
  };

  const handleClearClick: TButtonMouseEventHandler = (e) => {
    if (disabled || readOnly) return;
    e.preventDefault(); // usando handleMouseDown no ComboOrSuggestClearButton prevene o blur
    resetValue(true, true);
  };

  const handleDataListPick = (e: TLiKeyboardEvent | TLiMouseEvent) => {
    e.preventDefault(); // para o foco voltar pro campo ao selecionar uma opção com clique
    const {dataset} = e.currentTarget;
    const optionSelected = dataset.value;
    if (optionSelected !== 'error' && optionSelected !== 'not-found') {
      pickDataListItem({
        [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]:
          intent === COMBO_OR_SUGGEST_INTENT.suggest ? undefined : dataset.label,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: dataset.extra,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]:
          intent === COMBO_OR_SUGGEST_INTENT.suggest ? undefined : dataset.screenId,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]: dataset.typeId,
        [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]:
          intent === COMBO_OR_SUGGEST_INTENT.suggest ? optionSelected : undefined,
        [COMBO_OR_SUGGEST_VALUE_KEYS.value]:
          intent === COMBO_OR_SUGGEST_INTENT.suggest ? dataset.label : optionSelected,
      });
    }
    if (resetValueOnPick) {
      resetValue(false, false);
    }
  };

  const handleDataListRemove =
    typeof handleRemove === 'function'
      ? (itemIndex: number, itemId: string) => {
          handleRemove(itemId);
          const newResultOptions = resultOptions.slice(); // Clona
          newResultOptions.splice(itemIndex, 1);
          setResultOptions(newResultOptions);
        }
      : undefined;

  const handleInputBlur = () => {
    if (disabled || readOnly) return;
    if (!isOpen && !validateOnlyOnSubmit) inputValidate();
    if (isOpen) {
      if (arrowDownFocusingOnFirstItem) {
        setArrowDownFocusingOnFirstItem(false);
      }
      // Reseta lista no useOutsideClickEffect
    }
    // Requisição pode estar aberta. Não testa o shouldLoadDataList porque pode estar aberta também pela digitação
    // Mesmo open pode estar requisitando pela digitação// Mesmo open pode estar requisitando pela digitação
    handleSearchAbort();
    if (typeof handleBlur === 'function') {
      const pickedData = {
        [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]: attrValueDescription,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: attrValueExtra,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]: attrValueTypeId,
        // [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]: attrValueScreenId, // Não precisa ser enviado ao handleBlur
        [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]: attrValueOptionId,
        [COMBO_OR_SUGGEST_VALUE_KEYS.value]: attrValue,
      };
      if (intent === 'suggest') {
        delete pickedData[COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel];
      } else {
        delete pickedData[COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId];
      }
      handleBlur(pickedData);
    }
  };

  const handleInputChange: TInputChangeEventHandler = (e) => {
    if (disabled || readOnly) return;
    const targetValue = e.target.value || undefined; // vazio vira undefined
    produceFormState((proxyState) => {
      // Precisa resetar o id e os demais auxiliares sempre que inicia a digitação, para não salvar um id indesejado
      updateProxyStateValues(proxyState, valuesAttributes, {
        [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]:
          intent === COMBO_OR_SUGGEST_INTENT.suggest ? undefined : targetValue,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: undefined,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]: undefined,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]: undefined,
        [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]: undefined,
        [COMBO_OR_SUGGEST_VALUE_KEYS.value]: intent === COMBO_OR_SUGGEST_INTENT.suggest ? targetValue : undefined,
      });
    });
    setSearchTerm(targetValue);
  };

  const handleInputClick = () => {
    if (disabled || readOnly) return;
    if (!selectOptionsRef) {
      handleDoubleClick(() => {
        if (isOpen) {
          resetDataList(false);
        } else {
          inputFocus();
          if (shouldLoadDataList) {
            // Requisição está aberta. Só pode rodar em caso de shouldLoadDataList já ter sido ativo
            handleSearchAbort();
          } else {
            setShouldLoadDataList(true);
          }
        }
      });
    } else {
      if (isOpen) {
        resetDataList(false);
      } else {
        inputFocus();
      }
      setShouldLoadDataList(!isOpen);
    }
  };

  const handleInputFocus: TInputFocusEventHandler = (e) => {
    if (disabled || readOnly) return;
    inputResetErrors();
    if (typeof handleFocus === 'function') {
      handleFocus(e);
    }
  };

  const handleInputKeyDown: TInputKeyboardEventHandler = (e) => {
    if (disabled || readOnly) return;
    switch (e.keyCode) {
      case ARROW_DOWN: {
        e.preventDefault(); // bloqueia a rolagem
        // só quando ainda não tem nada carregado
        if (!isOpen) setShouldLoadDataList(true);
        // vai ficar aqui mesmo, pq só quero pular pra lista caso haja interesse nisso no mouseouver ou arrowup/arrowdown
        // e também pq daria muito trabalho fazer do outro jeito, não daria pra usar o focus na lista pq o foco
        // precisa estar no campo durante a busca
        const firstItemDom = e.currentTarget.parentNode?.querySelector<HTMLLIElement>('li.item');
        if (firstItemDom) {
          // Avisa ao blur que não é pra fechar a lista
          if (isOpen) setArrowDownFocusingOnFirstItem(true);
          // setTimeout da tempo ao blur pra receber a informação
          window.setTimeout(() => firstItemDom.focus());
        }
        break;
      }
      case ARROW_UP:
      case ENTER:
      case ESC:
        e.preventDefault(); // bloqueia a rolagem no ARROW_UP e o sumbit no ENTER (o ENTER nem sei se precisa/deve, maaass)
        if (isOpen) {
          resetDataList(false);
        }
        handleSearchAbort(); // Mesmo open pode estar requisitando pela digitação
        break;
      case BACKSPACE:
        if (isSelectedOnly && attrValue) {
          resetValue(true, true);
        }
        break;
      case COMMA: // A vírgula é usada como caracter especial de acionamento do TagSuggest
      case TAB: // É o outsideClick que reseta, não o blur, é necessário monitorar o TAB
        if (isOpen) resetDataList(false);
        break;
      default:
    }
    if (typeof handleKeyDown === 'function') {
      handleKeyDown(e);
    }
  };

  const handleSearchStart = () => {
    setLoadingValue(true);
  };

  const handleSearchAbort = () => {
    if (selectOptionsRef) return;
    if (!isOpen) setShouldLoadDataList(false); // Quando ta isOpen que se encarrega disso é o resetValue
    if (abortControllerRef?.current) {
      setLoadingValue(false);
      abortControllerRef.current.abort();
    }
  };

  const handleSearchEnd = (responseData: Array<GOptionData>) => {
    let newIsOpen = true;
    const newResultOptions = responseData;
    let shouldSingleListItemPick = false;
    if (
      intent === COMBO_OR_SUGGEST_INTENT.comboBox &&
      typeof getShouldSingleListItemPick === 'function' &&
      newResultOptions.length === 1
    ) {
      shouldSingleListItemPick = getShouldSingleListItemPick(newResultOptions[0], attrValueDescription);
    }
    if (shouldSingleListItemPick) {
      const singleItemData = newResultOptions[0];
      pickDataListItem({
        [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]: singleItemData.label,
        [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: singleItemData.data_list_item_extra,
        [COMBO_OR_SUGGEST_VALUE_KEYS.value]: valueAsString(singleItemData.id),
      });
    } else {
      if (newResultOptions.length === 0) {
        // Aberto pra mostrar notFoundOption ou addButton
        newIsOpen = notFoundOption !== null || typeof renderAddButton === 'function';
        if (notFoundOption) {
          newResultOptions.push({
            id: 'not-found',
            is_not_option: true,
            label: notFoundOption,
          } as GOptionData);
        }
      }
      setIsOpen(newIsOpen);
      setResultOptions(newResultOptions);
    }
    setLoadingValue(false);
  };

  const handleSearchMerge = (responseData: Array<GOptionData>) => {
    setResultOptions(resultOptions.concat(responseData));
  };

  if (refComponent) {
    refComponent.current = {
      inputFocus,
      replaceOptions,
      replaceValue,
      resetError: inputResetErrors,
      resetValue,
    };
  }

  return {
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
    replaceOptions,
    resetDataList,
    resultOptions,
    searchTerm,
    shouldLoadDataList,
  };
}
