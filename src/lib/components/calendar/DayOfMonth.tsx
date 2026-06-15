import {getDayOfMonth, getLuxonNow, getMonth, isSameDay} from '@/utils/luxonHelper';

import type {TDayOfMonthProps} from '@/lib/types/calendar';

export default function DayOfMonth(props: TDayOfMonthProps) {
  const {
    bookedHint,
    dateLuxon,
    dateRenderer,
    handleDateChange,
    isBooked,
    preventSelectedDateHighlight,
    selectedDateLuxon,
    selectedMonthLuxon,
  } = props;

  const handleClick = () => {
    if (typeof handleDateChange === 'function') {
      handleDateChange(dateLuxon);
    }
  };

  const isSelectedMonth = getMonth(dateLuxon) === getMonth(selectedMonthLuxon);
  return (
    <td
      className={`size-9 text-sm ${isBooked ? 'line-through opacity-70' : ''} ${!preventSelectedDateHighlight && isSameDay(dateLuxon, selectedDateLuxon) ? 'bg-formigo--theme rounded-full text-white' : ''} ${!isSelectedMonth ? 'opacity-50' : ''} ${isSameDay(dateLuxon, getLuxonNow()) ? 'font-bold' : ''}`}
      onClick={handleClick}
      onKeyDown={() => null}
      role="button"
      tabIndex={0}
      title={isBooked ? bookedHint : undefined}
    >
      {typeof dateRenderer === 'function' ? dateRenderer(dateLuxon) : getDayOfMonth(dateLuxon)}
    </td>
  );
}
