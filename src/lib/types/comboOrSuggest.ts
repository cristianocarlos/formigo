import type {
  COMBO_OR_SUGGEST_ATTRIBUTE_KEYS,
  COMBO_OR_SUGGEST_VALUE_KEYS,
} from '@/lib/components/combo-or-suggest/attributesHelper';
import type {ARIA_AUTO_COMPLETE} from '@/lib/components/combo-or-suggest/helper';
import type {
  TFormigoAttribute,
  TFormigoElementBase1,
  TFormigoElementBase2,
  TFormigoRefComponent,
} from '@/lib/types/formigo';
import type {TTextInputProps} from '@/lib/types/input';
import type {TInputFocusEventHandler} from '@/types/common';
import type {TDBJsonString} from '@/types/db-schema';
import type {ReactNode, RefObject} from 'react';

export type TComboOrSuggestAriaHtmlProps = {
  ariaActiveDescendantId?: string;
  ariaAutoComplete?: keyof typeof ARIA_AUTO_COMPLETE;
  ariaOwnsId?: string;
};

export type TComboOrSuggestAuxAttributes = {
  [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemExtra]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemScreenId]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemTypeId]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.suggestOptionId]: TFormigoAttribute;
  attribute: TFormigoAttribute;
};

export type TComboOrSuggestValuesAttributes = {
  [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]: TFormigoAttribute;
  [COMBO_OR_SUGGEST_VALUE_KEYS.value]: TFormigoAttribute;
};

export type TComboOrSuggestPickedData = {
  [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]?: string;
  [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]?: TDBJsonString;
  [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]?: string;
  [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]?: string;
  [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]?: string;
  [COMBO_OR_SUGGEST_VALUE_KEYS.value]?: string;
};

type TComboOrSuggestPickHandler = (pickedData: TComboOrSuggestPickedData) => void;

type TComboOrSuggestRefComponent<GOptionData = TComboOrSuggestOptions[number]> = Omit<
  TFormigoRefComponent,
  'resetValue'
> & {
  inputFocus: (focusOptions?: FocusOptions) => void;
  replaceOptions: (newOptions: Array<GOptionData>) => void;
  replaceValue: (
    values: TComboOrSuggestPickedData,
    shouldFocus?: boolean,
    shouldRunAdditionalHandlePick?: boolean,
  ) => void;
  resetValue: (shouldFocus?: boolean, shouldRunAdditionalHandlePick?: boolean) => void;
};

export type TComboOrSuggestOptions = Array<{
  data_list_item_extra?: TDBJsonString;
  data_list_item_group?: string;
  data_list_item_screen_id?: null | number | string;
  data_list_item_type_id?: null | number | string;
  error_message?: string;
  id: number | string;
  is_not_option?: boolean;
  label: string;
}>;

export type TComboOrSuggestRenderAddButton<GOptionData> = (params: {
  replaceSelectOptions?: TComboOrSuggestReplaceOptionsHandler<GOptionData>;
  resetDataList: TComboOrSuggestResetDataListHandler;
}) => ReactNode;

export type TComboOrSuggestReplaceOptionsHandler<GOptionData> = (newOptions: Array<GOptionData>) => void;
export type TComboOrSuggestResetDataListHandler = (shouldFocus?: boolean) => void;

export type TComboOrSuggestBase = TFormigoElementBase1 &
  TFormigoElementBase2 & {
    autoComplete?: TTextInputProps['autoComplete']; // Atributo autoComplete
    handleBlur?: TComboOrSuggestPickHandler; // handle adicional
    handleFocus?: TInputFocusEventHandler; // handle adicional
    handleOpen?: () => void; // handle para a quando abre o datalist
    handlePick?: TComboOrSuggestPickHandler; // handle adicional
    handleRemove?: (itemId: string) => void; // handle para remover item do datalist
    hideClearButton?: boolean; // Se deve aparecer o botão clear
    invalidItemType?: {hint: string; id: number | string}; // Apresenta a opção como registro inválido
    isInitOpen?: boolean; // Se é pra carregar com datalist aberto
    notFoundOption?: null | string; // Texto para a opção de not found
    refHtmlInput?: RefObject<HTMLInputElement | null>; // Expõe o elemento input
    resetValueOnPick?: boolean; // Reseta o valor do campo logo após o pick
  };

export type TComboOrSuggestBaseWithOptionData<GOptionData = TComboOrSuggestOptions[number]> = TComboOrSuggestBase & {
  getShouldSingleListItemPick?: (itemData: GOptionData, attrValueDescription?: string) => boolean; // handle pick para o primeiro item
  itemFormatter?: (data: GOptionData) => ReactNode; // Formatter para o label de cada option
  refComponent?: RefObject<TComboOrSuggestRefComponent<GOptionData> | undefined>; // Expõe algumas funções do componente para uso externo
  renderAddButton?: TComboOrSuggestRenderAddButton<GOptionData>; // Redeniza botão para adicionar opção
};

export type TComboSelectProps<GOptionData = TComboOrSuggestOptions[number]> =
  TComboOrSuggestBaseWithOptionData<GOptionData> & {
    hasEmptyId?: boolean; // Rotina externa que verifica se o nome foi selecionado da lista ou não (useSelectorFormigoComboHasEmptyId)
    hasExtra?: boolean; // Se deve aparecer o hidden extra
    hasScreenId?: boolean; // Se deve aparecer o hidden screen_id e o id no combo
    initValue?: {
      [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]: string;
      [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]?: string;
      [COMBO_OR_SUGGEST_VALUE_KEYS.value]: string;
    }; // Valor inicial
    isSelectedOnly?: boolean; // Validator
    options: Array<GOptionData>; // Opções / label precisa ser string, number da ruim na busca
    preventSearch?: boolean; // Previne a busca, sendo possível apenas seleção
  };

export type TComboBoxProps<GOptionData = TComboOrSuggestOptions[number]> = Omit<
  TComboSelectProps<GOptionData>,
  'options' | 'preventSearch'
> & {
  itemGroupTitles?: {[groupFlag: string]: null | string}; // Título para os separadores de grupo, null inclui apenas uma linha
  xhrQueryString?: string; // fetch quert string, string para monitoramento de mudança do effect
  xhrUrl: string; // fetch url
  xhrWaitingMillis?: number; // fetch tempo de espera para a requisição, usa diferente no cadastro de pessoa
};

export type TSuggestSelectProps<GOptionData = TComboOrSuggestOptions[number]> =
  TComboOrSuggestBaseWithOptionData<GOptionData> & {
    dataType?: TTextInputProps['dataType'];
    handleKeyDown?: TTextInputProps['handleKeyDown']; // handle adicional
    handleKeyUp?: TTextInputProps['handleKeyUp']; // handle para o evento keyUp do input
    initValue?: TTextInputProps['initValue']; // Valor inicial
    options: Array<GOptionData>; // Opções / label precisa ser string, number da ruim na busca
    preventSearch?: TComboSelectProps['preventSearch']; // Previne a busca, sendo possível apenas seleção
  };

export type TSuggestBoxProps<GOptionData = TComboOrSuggestOptions[number]> = Omit<
  TSuggestSelectProps<GOptionData>,
  'options' | 'preventSearch'
> & {
  itemGroupTitles?: TComboBoxProps['itemGroupTitles']; // Título para os separadores de grupo
  xhrQueryString?: TComboBoxProps['xhrQueryString']; // fetch quert string, string para monitoramento de mudança do effect
  xhrUrl: TComboBoxProps['xhrUrl']; // fetch url
  xhrWaitingMillis?: TComboBoxProps['xhrWaitingMillis']; // fetch tempo de espera para a requisição, usa diferente no cadastro de pessoa
};
