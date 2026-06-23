import type {
  TComboOrSuggestRenderAddButton,
  TComboOrSuggestReplaceOptionsHandler,
  TComboOrSuggestResetDataListHandler,
} from '@/lib/types/comboOrSuggest';

type IComboOrSuggestAddButtonProps<GOptionData> = {
  isOpen?: boolean;
  renderAddButton: TComboOrSuggestRenderAddButton<GOptionData>;
  replaceSelectOptions?: TComboOrSuggestReplaceOptionsHandler<GOptionData>;
  resetDataList: TComboOrSuggestResetDataListHandler;
};

export default function ComboOrSuggestAddButton<GOptionData>(props: IComboOrSuggestAddButtonProps<GOptionData>) {
  const {isOpen, renderAddButton, replaceSelectOptions, resetDataList} = props;
  return (
    <div
      className={`z-[var(--z-formigo--input-picker)] -mb-1 rounded-sm bg-gray-50 p-2 shadow-md ${isOpen ? '' : 'hidden'}`}
    >
      {renderAddButton({replaceSelectOptions, resetDataList})}
    </div>
  );
}
