import {BanIcon} from 'lucide-react';

import XIconButton from '@/components/XIconButton';
import {ARROW_DOWN, ARROW_UP, ENTER, ESC} from '@/lib/utils/keyMap';
import {valueAsNumber, valueAsString} from '@/utils/helper';

import type {TComboOrSuggestDataListProps} from './ComboOrSuggestDataList';
import type {TComboOrSuggestOptions} from '@/lib/types/comboOrSuggest';
import type {TButtonMouseEventHandler, TLiKeyboardEvent} from '@/types/common';

type ComboOrSuggestDataListItemProps<GOptionData> = {
  ariaActiveDescendantId: TComboOrSuggestDataListProps<GOptionData>['ariaActiveDescendantId'];
  ariaOwnsId: TComboOrSuggestDataListProps<GOptionData>['ariaOwnsId'];
  data: GOptionData;
  formatter?: TComboOrSuggestDataListProps<GOptionData>['itemFormatter'];
  handlePick: TComboOrSuggestDataListProps<GOptionData>['handlePick'];
  handleRemove?: TComboOrSuggestDataListProps<GOptionData>['handleRemove'];
  index: number;
  invalidType?: TComboOrSuggestDataListProps<GOptionData>['invalidItemType'];
  optionSelected?: string;
  resetDataList: TComboOrSuggestDataListProps<GOptionData>['resetDataList'];
};

function resolveNextItem(dom: HTMLLIElement): HTMLLIElement | null {
  const item = dom.nextSibling as HTMLLIElement | null;
  if (item && item.classList.contains('item-group-title')) {
    return item.nextSibling as HTMLLIElement;
  }
  return item;
}

function resolvePreviousItem(dom: HTMLLIElement): HTMLLIElement | null {
  const item = dom.previousSibling as HTMLLIElement | null;
  if (item && item.classList.contains('item-group-title')) {
    return item.previousSibling as HTMLLIElement;
  }
  return item;
}

export default function ComboOrSuggestDataListItem<GOptionData extends TComboOrSuggestOptions[number]>(
  props: ComboOrSuggestDataListItemProps<GOptionData>,
) {
  const {
    ariaActiveDescendantId,
    ariaOwnsId,
    data,
    formatter,
    handlePick,
    handleRemove,
    index,
    invalidType,
    optionSelected,
    resetDataList,
  } = props;

  /**
   * Trata as teclas especiais pressionadas
   */
  const handleKeyDown = (e: TLiKeyboardEvent) => {
    switch (e.keyCode) {
      case ARROW_DOWN: {
        e.preventDefault();
        const nextItem = resolveNextItem(e.currentTarget);
        if (nextItem) nextItem.focus();
        break;
      }
      case ARROW_UP: {
        e.preventDefault();
        const previousItem = resolvePreviousItem(e.currentTarget);
        if (previousItem) previousItem.focus();
        break;
      }
      case ENTER:
        e.preventDefault();
        handlePick(e);
        break;
      case ESC:
        resetDataList(true);
        break;
      default:
    }
  };

  const itemId = valueAsString(data.id);
  const itemLabel = data.label;
  const itemExtra = data.data_list_item_extra;
  const itemScreenId = data.data_list_item_screen_id;
  const itemTypeId = data.data_list_item_type_id;

  const handleRemoveMouseDown: TButtonMouseEventHandler = (e) => {
    e.stopPropagation();
    const itemIndex = valueAsNumber(e.currentTarget.dataset.index || 0);
    if (typeof handleRemove === 'function') handleRemove(itemIndex, itemId);
  };

  const id = itemId === optionSelected ? ariaActiveDescendantId : ariaOwnsId + '_' + itemId;

  const tabIndex = !itemId ? undefined : 1;
  const labelElement = formatter && !data.is_not_option ? formatter(data) : itemLabel;

  const invalidId = invalidType && invalidType.id;
  const invalidHint = invalidType && invalidType.hint;
  const isInvalidType = itemTypeId && invalidId && valueAsString(itemTypeId) === valueAsString(invalidId);
  const hint = isInvalidType ? invalidHint : undefined;
  // Para elementos não-clicáveis nativamente é necessário o onTouchStart ou role button
  return (
    <li
      className={`flex items-center border-t border-gray-100 from-gray-50 to-gray-100 px-4 py-2 text-sm leading-tight outline-0 first:border-t-0 hover:bg-linear-to-tl focus:border-b-2 focus:border-dotted focus:border-b-gray-200 focus:pb-1.5 [&>div]:flex-1 ${isInvalidType ? 'opacity-70' : ''} ${itemId === 'not-found' ? 'italic opacity-70' : ''}`}
      data-extra={itemExtra}
      data-label={itemLabel}
      data-screen-id={itemScreenId}
      data-type-id={itemTypeId}
      data-value={itemId}
      id={id}
      onKeyDown={handleKeyDown}
      onMouseDown={handlePick}
      role="button"
      tabIndex={tabIndex}
      title={hint}
    >
      <div>{labelElement}</div>
      {isInvalidType ? <BanIcon className="size-3! flex-none!" /> : undefined}
      {typeof handleRemove === 'function' ? (
        <XIconButton className="flex-none!" data-index={index} onMouseDown={handleRemoveMouseDown} />
      ) : undefined}
    </li>
  );
}
