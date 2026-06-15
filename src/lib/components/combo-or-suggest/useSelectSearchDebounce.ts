import {searchRegExpExec, searchRegExpInstance} from '@/utils/diacriticsHelper';
import {useDidUpdateEffect, useValueDebounce} from '@/utils/hooks';

import type {TComboOrSuggestOptions} from '@/lib/types/comboOrSuggest';

type TUseSelectSearchDebounceParams<GOptionData> = {
  handleEnd: (responseData: Array<GOptionData>) => void;
  selectOptions: Array<GOptionData>;
  shouldLoadDataList?: boolean;
  term?: string;
};

export default function useSelectSearchDebounce<GOptionData extends TComboOrSuggestOptions[number]>(
  params: TUseSelectSearchDebounceParams<GOptionData>,
  delay?: number,
) {
  const {handleEnd, selectOptions, shouldLoadDataList, term} = params;
  const debouncedTerm = useValueDebounce(term, delay);

  useDidUpdateEffect(() => {
    if (shouldLoadDataList) {
      handleEnd(selectOptions);
    }
    // só interessa as alterações do debouncedQuickSearchTerm
  }, [shouldLoadDataList]);

  useDidUpdateEffect(() => {
    if (typeof debouncedTerm !== 'undefined') {
      // fica undefined após o pick, quando limpa o campo é string vazia
      let matchOptions = selectOptions;
      if (debouncedTerm) {
        const termRegExp = searchRegExpInstance(debouncedTerm);
        matchOptions = selectOptions.filter((data) => {
          return searchRegExpExec(termRegExp, data.label);
        });
      }
      handleEnd(matchOptions);
    }
    // só interessa as alterações do debouncedQuickSearchTerm
  }, [debouncedTerm]);
}
