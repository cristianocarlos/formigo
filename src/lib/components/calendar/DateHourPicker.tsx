import {useCallback} from 'react';

import {useOutsideClickEffect} from '@/utils/hooks';

import VerticalClockCalendar from './VerticalClockCalendar';

import type {TDateHourInputProps} from '@/lib/types/input';
import type {TLuxonValid} from '@/types/thirdParty';
import type {RefObject} from 'react';

type IPDateHourPicker = {
  bookingDataLoad?: TDateHourInputProps['bookingDataLoad'];
  className?: string;
  handleOutsideClick?: () => void;
  handlePick: (valueLuxon: TLuxonValid) => void;
  isOpen?: boolean;
  pickerPosition?: 'left' | 'right';
  refHtmlDivDropdown: RefObject<HTMLDivElement | null>;
  value?: string;
};

export default function DateHourPicker(props: IPDateHourPicker) {
  const {
    bookingDataLoad,
    className,
    handleOutsideClick,
    handlePick,
    isOpen,
    pickerPosition = 'left',
    refHtmlDivDropdown,
    value,
  } = props;

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
      className={`formigo--z-input-picker absolute left-0 origin-top-left -translate-y-1 scale-95 overflow-hidden rounded bg-white opacity-0 shadow-2xl transition-all duration-200 ease-in-out max-sm:left-1/2 max-sm:-translate-x-1/2 ${isOpen ? 'translate-y-0 scale-100 opacity-100' : ''} ${pickerPosition === 'right' ? 'right-0' : ''}`}
    >
      {isOpen ? (
        <VerticalClockCalendar
          bookingDataLoad={bookingDataLoad}
          className={className}
          handlePick={handlePick}
          value={value}
        />
      ) : undefined}
    </div>
  );
}
