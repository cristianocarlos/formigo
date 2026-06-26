import {AlertTriangleIcon} from 'lucide-react';

import ComboOrSuggestDataListScroller from '@/lib/components/combo-or-suggest/ComboOrSuggestDataListScroller';

import ComboOrSuggestDataListItem from './ComboOrSuggestDataListItem';

import type {
  TComboOrSuggestAriaHtmlProps,
  TComboOrSuggestBase,
  TComboOrSuggestBaseWithOptionData,
  TComboOrSuggestOptions,
  TComboOrSuggestResetDataListHandler,
  TSuggestBoxProps,
  TSuggestSelectProps,
} from '@/lib/types/comboOrSuggest';
import type {TLiKeyboardEvent, TLiMouseEvent} from '@/types/common';

export type TComboOrSuggestDataListProps<GOptionData> = {
  ariaActiveDescendantId?: TComboOrSuggestAriaHtmlProps['ariaActiveDescendantId'];
  ariaOwnsId?: TComboOrSuggestAriaHtmlProps['ariaOwnsId'];
  handlePick: (e: TLiKeyboardEvent | TLiMouseEvent) => void; // atualiza o state do combo com o valor selecionado
  handleRemove?: (itemIndex: number, itemId: string) => void;
  invalidItemType?: TComboOrSuggestBase['invalidItemType'];
  isOpen?: boolean;
  itemFormatter?: TComboOrSuggestBaseWithOptionData<GOptionData>['itemFormatter'];
  itemGroupTitles?: TSuggestBoxProps<GOptionData>['itemGroupTitles']; // Título para os separadores de grupo quando houver
  options: TSuggestSelectProps<GOptionData>['options'];
  optionSelected?: string;
  resetDataList: TComboOrSuggestResetDataListHandler;
  scrollerLoadMore?: (offset: number) => void; // para o scroller
  scrollerXhrLimit?: number; // para o scroller, quando for optimistic não há paginação por isso não é obrigatório
};

export default function ComboOrSuggestDataList<GOptionData extends TComboOrSuggestOptions[number]>(
  props: TComboOrSuggestDataListProps<GOptionData>,
) {
  const {
    ariaActiveDescendantId,
    ariaOwnsId,
    handlePick,
    handleRemove,
    invalidItemType,
    isOpen,
    itemFormatter,
    itemGroupTitles,
    options,
    optionSelected,
    resetDataList,
    scrollerLoadMore,
    scrollerXhrLimit,
  } = props;

  const renderOptions = () => {
    const optionsLength = options.length;
    const optionList = [];
    let itemGroup = undefined;
    for (let i = 0; i < optionsLength; i++) {
      // o for é mais veloz que o forEach
      const data = options[i];
      if (data.error_message !== undefined) {
        optionList.push(
          <li
            className="flex items-center gap-2 bg-red-400 px-4 py-2 text-white"
            key={data.label}
            title={data.error_message}
          >
            <AlertTriangleIcon className="size-6! flex-none! stroke-1" />
            <div className="text-xs!">Não foi possível carregar as opções: {data.label}</div>
          </li>,
        );
        break;
      }
      if (data.data_list_item_group && itemGroup !== data.data_list_item_group) {
        const itemGroupTitle = itemGroupTitles?.[data.data_list_item_group];
        if (typeof itemGroupTitle !== 'undefined') {
          // Pode ser null
          optionList.push(
            <li
              className="my-4 block border-t border-solid border-t-gray-200 p-0 text-center leading-0 tracking-wide uppercase [&+li]:border-none"
              key={data.data_list_item_group}
            >
              {itemGroupTitle ? (
                <abbr className="relative -top-px bg-white px-2 text-[0.72em] leading-0 text-gray-400">
                  {itemGroupTitle}
                </abbr>
              ) : undefined}
            </li>,
          );
        }
      }
      optionList.push(
        <ComboOrSuggestDataListItem<GOptionData>
          ariaActiveDescendantId={ariaActiveDescendantId}
          ariaOwnsId={ariaOwnsId}
          data={data}
          formatter={itemFormatter}
          handlePick={handlePick}
          handleRemove={handleRemove}
          index={i}
          invalidType={invalidItemType}
          key={data.id + '-' + i}
          optionSelected={optionSelected}
          resetDataList={resetDataList}
        />,
      );
      itemGroup = data.data_list_item_group;
    }
    return optionList;
  };

  const maxHeight = 200;
  const wrapperStyle = {
    maxHeight: isOpen ? maxHeight : 0,
  };
  const scrollerStyle = {
    maxHeight,
  };
  return (
    <div
      className={`combo-or-suggest-data-list text-formigo--readable absolute z-[var(--z-formigo--input-picker)] w-full overflow-hidden rounded-sm bg-white shadow-md transition-all duration-200 ease-in-out`}
      id={ariaOwnsId}
      role="listbox"
      style={wrapperStyle}
    >
      {isOpen ? (
        <ComboOrSuggestDataListScroller limit={scrollerXhrLimit} loadMoreData={scrollerLoadMore} style={scrollerStyle}>
          <ul data-test="formigo-test--combo-or-suggest-data-list-items">{renderOptions()}</ul>
        </ComboOrSuggestDataListScroller>
      ) : undefined}
    </div>
  );
}
