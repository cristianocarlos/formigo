import {useRef, useState} from 'react';

import {ENTER, ESC} from '@/lib/utils/keyMap';
import {useDidUpdateEffect, useValueDebounce} from '@/utils/hooks';

import type {TQuickSearchDebounceParams} from './types';
import type {TInputKeyboardEventHandler} from '@/types/common';

function resolveUrl(url: string, term?: string) {
  const encodedTerm = encodeURIComponent(term || '');
  return url.includes('?') ? `${url}&term=${encodedTerm}` : `${url}?term=${encodedTerm}`;
}

export default function useQuickSearchDebounce<G>(params: TQuickSearchDebounceParams<G>, delay: number) {
  const {dataGet, handleAbort, handleEnd, handleStart, term, url} = params;
  const abortControllerRef = useRef(new AbortController());
  const [isLoading, setIsLoading] = useState(false);
  const debouncedTerm = useValueDebounce(term, delay);

  const handleQuickSearchKeyDown: TInputKeyboardEventHandler = (e) => {
    switch (e.keyCode) {
      case ENTER:
        e.preventDefault(); // bloqueia o sumbit no ENTER
        break;
      case ESC:
        if (abortControllerRef.current) {
          handleAbort();
          abortControllerRef.current.abort();
        }
        break;
      default:
    }
  };

  useDidUpdateEffect(() => {
    setIsLoading(true);
    handleStart();
    abortControllerRef.current = new AbortController();
    const fullUrl = resolveUrl(url, debouncedTerm);
    dataGet<G>(fullUrl, abortControllerRef.current.signal)
      .then((responseData) => {
        handleEnd(responseData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
    return () => {
      abortControllerRef.current?.abort();
    };
    // só interessa as alterações do debouncedQuickSearchTerm
  }, [debouncedTerm]);

  return {handleQuickSearchKeyDown, isLoading};
}
