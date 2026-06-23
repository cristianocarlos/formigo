import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';
import {hasValue} from '@/utils/helper';

import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {CSSProperties} from 'react';

type IPComboScreenId = {
  attribute: TFormigoAttribute;
  className?: string;
  screenIdAttribute: TFormigoAttribute;
  style: CSSProperties;
};

export default function ComboScreenId({attribute, className = '', screenIdAttribute, style}: IPComboScreenId) {
  const id = useSelectorFormigoAttrValue(attribute);
  const screenId = useSelectorFormigoAttrValue(screenIdAttribute) || id;
  if (!hasValue(screenId)) return;
  return (
    <abbr
      className={`absolute top-px z-[var(--z-formigo--input-lateral)] flex h-[calc(100%-2px)] items-center pl-1 text-[0.72em] font-medium text-gray-400 ${className}`}
      style={style}
    >
      {screenId}
    </abbr>
  );
}
