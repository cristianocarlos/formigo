import {useRef} from 'react';

import {useFormigoContext} from '@/lib/utils/withContext';
import {useDidUpdateEffect, useValueDebounce} from '@/utils/hooks';

import {XHR_LIMIT} from './helper';

import type {TInputKeyboardEventHandler} from '@/types/common';
import type {RefObject} from 'react';

// resetDataList é usado em:
// pickDataListItem shouldFocus
//   replaceValue
//   handleDataListPick
// handleArrowClick false
// handleInputBlur false + abort (incorporou useOutsideClickEffect e TAB)
// handleInputClick false + abort
// handleInputKeyDown ARROW_UP false + abort
// handleInputKeyDown COMMA false
// handleInputKeyDown ENTER false + abort
// handleInputKeyDown ESC false + abort

type TUseBoxSearchDebounceParams<GOptionData> = {
  abortControllerRef: RefObject<AbortController>;
  handleEnd: (responseData: Array<GOptionData>) => void;
  handleKeyDown: TInputKeyboardEventHandler;
  handleMerge: (responseData: Array<GOptionData>) => void;
  handleStart: () => void;
  queryString?: string;
  shouldLoadDataList?: boolean;
  term?: string;
  url: string;
};

function resolveQueryString(term: string | undefined, offset: number, queryString?: string) {
  const qs = `?offset=${offset}&limit=${XHR_LIMIT}${term ? `&term=${encodeURIComponent(term)}` : ``}`;
  return qs + (queryString ? queryString.replace('?', '&') : '');
}

export default function useBoxSearchDebounce<GOptionData>(
  params: TUseBoxSearchDebounceParams<GOptionData>,
  delay?: number,
) {
  const {
    abortControllerRef,
    handleEnd,
    handleKeyDown,
    handleMerge,
    handleStart,
    queryString,
    shouldLoadDataList,
    term,
    url,
  } = params;

  const initTermRef = useRef(term);

  const debouncedTerm = useValueDebounce(term, delay);
  const {xhrActions} = useFormigoContext();

  const handleComboBoxSearchDebounceKeyDown: TInputKeyboardEventHandler = (e) => {
    handleKeyDown(e);
  };

  const loadMore = (offset: number) => {
    abortControllerRef.current = new AbortController();
    const resolvedQueryString = resolveQueryString(debouncedTerm, offset, queryString);
    xhrActions
      .dataGet<Array<GOptionData>>(url + resolvedQueryString, abortControllerRef.current.signal, 'combo-box')
      .then((responseContent) => {
        handleMerge(responseContent);
      });
  };

  useDidUpdateEffect(() => {
    if (shouldLoadDataList) {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      // Antes de mudar qualquer informação no campo, carrega tudo, a partir da primeira edição se baseia no que ta escrito
      const loadTerm = initTermRef.current === debouncedTerm ? undefined : debouncedTerm;
      const resolvedQueryString = resolveQueryString(loadTerm, 0, queryString);
      handleStart();
      xhrActions
        .dataGet<Array<GOptionData>>(url + resolvedQueryString, abortControllerRef.current.signal, 'combo-box')
        .then((responseContent) => {
          handleEnd(responseContent);
        });
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [shouldLoadDataList]);

  useDidUpdateEffect(() => {
    if (typeof debouncedTerm !== 'undefined') {
      // fica undefined após o pick, quando limpa o campo é string vazia
      abortControllerRef.current = new AbortController();
      const resolvedQueryString = resolveQueryString(debouncedTerm, 0, queryString);
      handleStart();
      xhrActions
        .dataGet<Array<GOptionData>>(url + resolvedQueryString, abortControllerRef.current.signal, 'combo-box')
        .then((responseContent) => {
          handleEnd(responseContent);
        });
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // só interessa as alterações das props declaradas
  }, [debouncedTerm]);

  return {handleComboBoxSearchDebounceKeyDown, loadMore};
}
