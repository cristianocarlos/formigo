import {LoaderIcon, SearchIcon} from 'lucide-react';

import {useSelectorFormigoLoadingValue} from '@/lib/zustand/hooks';

import type {TInputRefHtmlButton, TZipCodeInputProps} from '@/lib/types/input';

type IPZipCodeSearchButton = {
  attribute: TZipCodeInputProps['attribute'];
  handleClick: () => void;
  refHtmlButton: TInputRefHtmlButton;
};

export default function ZipCodeSearchButton(props: IPZipCodeSearchButton) {
  const {attribute, handleClick, refHtmlButton} = props;
  const isLoading = useSelectorFormigoLoadingValue(attribute);
  return (
    <button className="items-center" onClick={handleClick} ref={refHtmlButton} type="button">
      <LoaderIcon className={`absolute ${isLoading ? 'animate-spin' : 'invisible'}`} />
      <SearchIcon className={`rotate-90 ${isLoading ? 'invisible' : ''}`} />
    </button>
  );
}
