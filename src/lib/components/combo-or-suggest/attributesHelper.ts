import {useMemo} from 'react';

import {immerMutatorAttrSetValueIn} from '@/lib/zustand/helper';

import type {
  TComboOrSuggestAuxAttributes,
  TComboOrSuggestPickedData,
  TComboOrSuggestValuesAttributes,
} from '@/lib/types/comboOrSuggest';
import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {TZustandFormigoFormProxyState} from '@/lib/zustand/types';

export const COMBO_OR_SUGGEST_ATTRIBUTE_KEYS = {
  attribute: 'attribute',
  comboOptionLabel: 'comboOptionLabelAttribute',
  dataListItemExtra: 'dataListItemExtraAttribute',
  dataListItemScreenId: 'dataListItemScreenIdAttribute',
  dataListItemTypeId: 'dataListItemTypeIdAttribute',
  suggestOptionId: 'suggestOptionIdAttribute',
} as const;

export const COMBO_OR_SUGGEST_VALUE_KEYS = {
  comboOptionLabel: 'comboOptionLabel',
  dataListItemExtra: 'dataListItemExtra',
  dataListItemScreenId: 'dataListItemScreenId',
  dataListItemTypeId: 'dataListItemTypeId',
  suggestOptionId: 'suggestOptionId',
  value: 'value',
} as const;

export function getValuesAttributes(
  attribute: TFormigoAttribute,
  auxAttributes: TComboOrSuggestAuxAttributes,
): TComboOrSuggestValuesAttributes {
  return {
    [COMBO_OR_SUGGEST_VALUE_KEYS.comboOptionLabel]: auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel],
    [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemExtra]: auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemExtra],
    [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemScreenId]:
      auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemScreenId],
    [COMBO_OR_SUGGEST_VALUE_KEYS.dataListItemTypeId]: auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemTypeId],
    [COMBO_OR_SUGGEST_VALUE_KEYS.suggestOptionId]: auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.suggestOptionId],
    [COMBO_OR_SUGGEST_VALUE_KEYS.value]: attribute,
  };
}

export function useAuxAttributes(attribute: TFormigoAttribute) {
  return useMemo(() => {
    const attributeDottedKey = attribute.join('.');
    const auxAttributes = {
      attribute,
      // Precisa estar declarado aqui, usa no blur e no pick, independente de ser enviado no form
      [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel]: (attributeDottedKey + '_desc').split('.'),
      [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemExtra]: (attributeDottedKey + '_extra').split('.'),
      [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemScreenId]: (attributeDottedKey + '_screen_id').split('.'),
      [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.dataListItemTypeId]: (attributeDottedKey + '_type_id').split('.'),
      [COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.suggestOptionId]: (attributeDottedKey + '_option_id').split('.'),
    };
    return auxAttributes;
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, []);
}

export function updateProxyStateValues(
  formProxyState: TZustandFormigoFormProxyState,
  valuesAttributes: TComboOrSuggestValuesAttributes,
  itemValues: TComboOrSuggestPickedData,
) {
  Object.keys(itemValues).forEach((itemKey) => {
    immerMutatorAttrSetValueIn(
      formProxyState,
      valuesAttributes[itemKey as keyof typeof itemValues],
      itemValues[itemKey as keyof typeof itemValues],
    );
  });
}
