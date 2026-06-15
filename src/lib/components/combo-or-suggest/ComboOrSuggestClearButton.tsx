import XIconButton from '@/components/XIconButton';
import {hasValue} from '@/utils/helper';

import type {TButtonMouseEventHandler} from '@/types/common';

type IPComboOrSuggestClearButton = {
  attrValue?: string;
  handleClearClick?: TButtonMouseEventHandler;
};

export default function ComboOrSuggestClearButton({attrValue, handleClearClick}: IPComboOrSuggestClearButton) {
  if (!hasValue(attrValue)) return;
  // handleMouseDown para poder prevenir o blur com e.preventDefault() no handleClearClick
  return <XIconButton onMouseDown={handleClearClick} tabIndex={-1} />;
}
