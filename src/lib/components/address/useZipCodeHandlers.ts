import {ENTER, ESC} from '@/lib/utils/keyMap';
import {isValidZipCode} from '@/utils/validators';

import type {TInputRefHtmlButton, TZipCodeInputProps} from '@/lib/types/input';
import type {TInputKeyboardEventHandler} from '@/types/common';

type TUseZipCodeHandlers = Pick<TZipCodeInputProps, 'disabled' | 'handleSearch' | 'handleSearchCancel' | 'readOnly'> & {
  handleInputKeyDown: TInputKeyboardEventHandler;
  refHtmlButton: TInputRefHtmlButton;
  refHtmlInput: NonNullable<TZipCodeInputProps['refHtmlInput']>;
};

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export default function useZipCodeHandlers(params: TUseZipCodeHandlers) {
  const {disabled, handleInputKeyDown, handleSearch, handleSearchCancel, readOnly, refHtmlButton, refHtmlInput} =
    params;

  const search = (value?: string) => {
    if (isValidZipCode(value)) {
      handleSearch(value);
      refHtmlInput.current?.focus(); // Traz o foco devolta pro input pra poder cancelar com ESC
    }
  };

  const handleZipCodeButtonClick = () => {
    search(refHtmlInput.current?.value);
  };

  const handleZipCodeInputKeyDown: TInputKeyboardEventHandler = (e) => {
    if (disabled || readOnly) return;
    handleInputKeyDown(e);
    switch (e.keyCode) {
      case ENTER:
        e.preventDefault();
        refHtmlButton.current?.focus(); // Foca no botão, para rodar o blur que formata e roda o validate
        search(e.currentTarget.value);
        break;
      case ESC:
        e.preventDefault();
        handleSearchCancel();
        break;
      default:
    }
  };

  return {
    handleZipCodeButtonClick,
    handleZipCodeInputKeyDown,
  };
}
