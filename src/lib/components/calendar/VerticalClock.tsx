import {useRef, useState} from 'react';

import VerticalClockHourItem from '@/lib/components/calendar/VerticalClockHourItem';
import {useDidMountEffect} from '@/utils/hooks';
import {formatHour} from '@/utils/luxonHelper';

import type {TLuxonCalendarHourValues} from '@/lib/types/calendar';
import type {TInputChangeEventHandler} from '@/types/common';
import type {TDBHourString} from '@/types/db-schema';
import type {TLuxonValid} from '@/types/thirdParty';

const VERTICAL_CLOCK_ITEM_HEIGHT_DEFAULT = 24;

type TProps = {
  bookedHint?: string;
  bookedHourValues?: TLuxonCalendarHourValues;
  handleChange?: (hour: TDBHourString) => void;
  hourValues: TLuxonCalendarHourValues;
  itemHeight?: number;
  selectedHourLuxon?: TLuxonValid;
};

export default function VerticalClock(props: TProps) {
  const {
    bookedHint,
    bookedHourValues,
    handleChange: propHandleChange,
    hourValues,
    itemHeight = VERTICAL_CLOCK_ITEM_HEIGHT_DEFAULT,
    selectedHourLuxon,
  } = props;

  const refHtmlDivVerticalClock = useRef<HTMLDivElement>(null);
  const [optionChecked, setOptionChecked] = useState(() => selectedHourLuxon && formatHour(selectedHourLuxon));

  useDidMountEffect(() => {
    if (!refHtmlDivVerticalClock.current) return;
    const scrollToHour = optionChecked || '08:00';
    const optionsLength = hourValues.length;
    let scrollTop = 0;
    for (let i = 0; i < optionsLength; i++) {
      if (scrollToHour === hourValues[i]) break;
      scrollTop += itemHeight; // antes do break, pra ter sempre uma sobra em cima
    }
    refHtmlDivVerticalClock.current.scrollTop = scrollTop;
  });

  const handleChange: TInputChangeEventHandler = (e) => {
    if (e.target.value !== optionChecked) {
      const optionChecked = e.target.value;
      setOptionChecked(optionChecked);
      if (typeof propHandleChange === 'function') propHandleChange(optionChecked);
    }
  };

  const renderHourOptions = () => {
    return hourValues.map((hourDesc) => {
      const isBooked = bookedHourValues ? bookedHourValues.includes(hourDesc) : false;
      const isChecked = optionChecked === hourDesc;
      return (
        <VerticalClockHourItem
          bookedHint={bookedHint}
          handleChange={handleChange}
          height={itemHeight}
          hour={hourDesc}
          isBooked={isBooked}
          isChecked={isChecked}
          key={hourDesc}
        />
      );
    });
  };

  return (
    <div className={`h-40 overflow-auto`} ref={refHtmlDivVerticalClock}>
      {renderHourOptions()}
    </div>
  );
}
