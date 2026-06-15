import {FunnelIcon, LoaderIcon} from 'lucide-react';
import {useState} from 'react';

import YiiLang from '@/utils/yii-lang';

import useQuickSearchDebounce from './useQuickSearchDebounce';

import type {TQuickSearchProps} from './types';
import type {TInputKeyboardEventHandler} from '@/types/common';

export default function QuickSearch<G>(props: TQuickSearchProps<G>) {
  const {dataGet, handleAbort, handleEnd, handleStart, placeholder, url} = props;

  const [term, setTerm] = useState<string>();

  const {handleQuickSearchKeyDown, isLoading} = useQuickSearchDebounce(
    {
      dataGet,
      handleAbort,
      handleEnd,
      handleStart,
      term,
      url,
    },
    400,
  );

  const handleKeyDown: TInputKeyboardEventHandler = (e) => {
    handleQuickSearchKeyDown(e);
  };

  const handleKeyUp: TInputKeyboardEventHandler = (e) => {
    setTerm(e.currentTarget.value);
  };

  return (
    <div className="relative flex items-center rounded border border-gray-300 bg-white">
      <div className="relative px-3 opacity-30">
        <LoaderIcon className={`absolute animate-spin ${isLoading ? '' : 'invisible'}`} />
        <FunnelIcon className={`${isLoading ? 'invisible' : ''}`} />
      </div>
      <input
        className="flex-1 py-2 text-sm outline-none"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder={YiiLang.formigo('placeholderQuickSearch') + (placeholder ? `: ${placeholder}` : '')}
        type="text"
      />
    </div>
  );
}
