import {ChevronDownIcon, LoaderIcon} from 'lucide-react';

import {useSelectorFormigoLoadingValue} from '@/lib/zustand/hooks';

import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {TLabelMouseEventHandler} from '@/types/common';
import type {CSSProperties} from 'react';

type IPComboOrSuggestArrow = {
  attribute: TFormigoAttribute;
  handleClick: TLabelMouseEventHandler;
  isOpen?: boolean;
  style: CSSProperties;
};

export default function ComboOrSuggestArrow(props: IPComboOrSuggestArrow) {
  const {attribute, handleClick, isOpen, style} = props;

  const isLoading = useSelectorFormigoLoadingValue(attribute);

  return (
    <label data-test="combo-or-suggest-arrow" onMouseDown={handleClick} role="button" style={style}>
      <LoaderIcon className={`absolute ${isLoading ? 'animate-spin' : 'invisible'}`} />
      <ChevronDownIcon
        className={`${isOpen ? 'rotate-180 transition-all duration-200 ease-in-out' : ''} ${isLoading ? 'invisible' : ''}`}
      />
    </label>
  );
}
