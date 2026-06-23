import {useCallback} from 'react';

import {useOutsideClickEffect} from '@/utils/hooks';
import {getLuxonNow, parseLuxon} from '@/utils/luxonHelper';

import Calendar from './Calendar';

import type {TLuxonValid} from '@/types/thirdParty';
import type {RefObject} from 'react';

type TProps = {
  className?: string;
  handleOutsideClick?: () => void;
  handlePick: (valueLuxon: TLuxonValid) => void;
  isOpen?: boolean;
  pickerPosition?: 'left' | 'right';
  refHtmlDivDropdown: RefObject<HTMLDivElement | null>;
  value?: string;
};

function resolveSelectedValueLuxon(value?: string) {
  let selectedValue = getLuxonNow();
  if (value) {
    const valueLuxon = parseLuxon(value);
    if (valueLuxon) {
      selectedValue = valueLuxon;
    }
  }
  return selectedValue;
}

export default function DatePicker(props: TProps) {
  const {className, handleOutsideClick, handlePick, isOpen, pickerPosition = 'left', refHtmlDivDropdown, value} = props;

  useOutsideClickEffect(
    refHtmlDivDropdown,
    'mousedown',
    useCallback(() => {
      // IMPORTANTE: o evento do clique no botão também PRECISA ser mousedown
      if (typeof handleOutsideClick === 'function' && isOpen) {
        handleOutsideClick();
      }
    }, [handleOutsideClick, isOpen]),
  );

  return (
    <div
      className={`absolute left-0 z-[var(--z-formigo--input-picker)] origin-top-left -translate-y-1 scale-95 overflow-hidden rounded bg-white opacity-0 shadow-2xl transition-all duration-200 ease-in-out ${isOpen ? 'translate-y-0 scale-100 opacity-100' : ''} ${pickerPosition === 'right' ? 'right-0' : ''}`}
    >
      {isOpen ? (
        <Calendar
          className={className}
          handleDateChange={handlePick}
          selectedDateLuxon={resolveSelectedValueLuxon(value)}
        />
      ) : undefined}
    </div>
  );
}
