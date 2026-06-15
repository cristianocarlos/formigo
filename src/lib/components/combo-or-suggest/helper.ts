import type {TComboOrSuggestAriaHtmlProps} from '@/lib/types/comboOrSuggest';

export const ARIA_AUTO_COMPLETE = {
  both: 'both',
  inline: 'inline',
  list: 'list',
  none: 'none',
} as const;

// keys as types: keyof typeof COMBO_OR_SUGGEST_INTENT
// values as types: typeof COMBO_OR_SUGGEST_INTENT[keyof typeof COMBO_OR_SUGGEST_INTENT]
export const COMBO_OR_SUGGEST_INTENT = {
  comboBox: 'comboBox',
  suggest: 'suggest',
} as const;

export const XHR_LIMIT = 40;

export function getAriaHtmlProps(id: string, isOpen: boolean): TComboOrSuggestAriaHtmlProps {
  return {
    ariaActiveDescendantId: isOpen ? id + '_selected' : undefined,
    ariaAutoComplete: ARIA_AUTO_COMPLETE.list,
    ariaOwnsId: isOpen ? id + '_data_list' : undefined,
  };
}
