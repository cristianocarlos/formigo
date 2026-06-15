import {addDays, formatDbDate, getDayOfMonth} from '@/utils/luxonHelper';

import DayOfMonth from './DayOfMonth';

import type {TWeekProps} from '@/lib/types/calendar';

export default function Week(props: TWeekProps) {
  const {
    bookedDateValues,
    bookedHint,
    dateRenderer,
    handleDateChange,
    mondayLuxon,
    preventSelectedDateHighlight,
    selectedDateLuxon,
    selectedMonthLuxon,
  } = props;

  let dateLuxon = mondayLuxon;
  const dates = [];
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const isBooked = bookedDateValues ? bookedDateValues.includes(formatDbDate(dateLuxon)) : false;
    dates.push(
      <DayOfMonth
        bookedHint={bookedHint}
        dateLuxon={dateLuxon}
        dateRenderer={dateRenderer}
        handleDateChange={handleDateChange}
        isBooked={isBooked}
        key={getDayOfMonth(dateLuxon)}
        preventSelectedDateHighlight={preventSelectedDateHighlight}
        selectedDateLuxon={selectedDateLuxon}
        selectedMonthLuxon={selectedMonthLuxon}
      />,
    );
    dateLuxon = addDays(dateLuxon, 1);
  }
  return <tr className="week">{dates}</tr>;
}
