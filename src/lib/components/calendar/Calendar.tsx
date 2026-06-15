import {ChevronDownIcon} from 'lucide-react';
import {useState} from 'react';

import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  getDiffInWeeks,
  getShortWeekDayNames,
  getWeekOfYear,
  startOfMonth,
  startOfWeek,
} from '@/utils/luxonHelper';
import YiiLang from '@/utils/yii-lang';

import Week from './Week';

import type {TCalendarProps} from '@/lib/types/calendar';

export default function Calendar(props: TCalendarProps) {
  const {
    bookedDateValues,
    bookedHint,
    className = '',
    dateRenderer,
    handleDateChange,
    handleMonthNext: propHandleMonthNext,
    handleMonthPrevious: propHandleMonthPrevious,
    preventSelectedDateHighlight,
    renderVerticalClock,
    selectedDateLuxon,
  } = props;

  const [stateSelectedMonthLuxon, setStateSelectedMonthLuxon] = useState(selectedDateLuxon);

  const handleMonthNext = () => {
    setStateSelectedMonthLuxon((prevSelectedMonthLuxon) => {
      const newSelectedMonthLuxon = addMonths(prevSelectedMonthLuxon, 1);
      if (typeof propHandleMonthNext === 'function') {
        propHandleMonthNext(newSelectedMonthLuxon);
      }
      return newSelectedMonthLuxon;
    });
  };

  const handleMonthPrevious = () => {
    setStateSelectedMonthLuxon((prevSelectedMonthLuxon) => {
      const newSelectedMonthLuxon = addMonths(prevSelectedMonthLuxon, -1);
      if (typeof propHandleMonthPrevious === 'function') {
        propHandleMonthPrevious(newSelectedMonthLuxon);
      }
      return newSelectedMonthLuxon;
    });
  };

  const renderWeeks = () => {
    const firstDayOfMonthLuxon = startOfMonth(stateSelectedMonthLuxon); // primeiro dia do mês
    const lastDayOfMonthLuxon = endOfMonth(stateSelectedMonthLuxon); // último dia do mês
    const firstDayOnFrameLuxon = startOfWeek(firstDayOfMonthLuxon); // Primeiro dia da semana que contém o primeiro dia do, segunda
    const lastDayOnFrameLuxon = endOfWeek(lastDayOfMonthLuxon); // Último dia da semana que contém o último dia do mês, domingo
    const weeksOnFrameAmmount = getDiffInWeeks(firstDayOnFrameLuxon, lastDayOnFrameLuxon) || 0;
    let mondayLuxon = firstDayOnFrameLuxon;
    const weeks = [];
    for (let i = 0; i < weeksOnFrameAmmount; i++) {
      const weekOfYearIndex = getWeekOfYear(mondayLuxon);
      weeks.push(
        <Week
          bookedDateValues={bookedDateValues}
          bookedHint={bookedHint}
          dateRenderer={dateRenderer}
          handleDateChange={handleDateChange}
          key={weekOfYearIndex}
          mondayLuxon={mondayLuxon}
          preventSelectedDateHighlight={preventSelectedDateHighlight}
          selectedDateLuxon={selectedDateLuxon}
          selectedMonthLuxon={stateSelectedMonthLuxon}
        />,
      );
      mondayLuxon = addWeeks(mondayLuxon, 1);
    }
    return weeks;
  };

  const shortWeekDayNames = getShortWeekDayNames();
  return (
    <div className={`table overflow-hidden select-none ${className}`}>
      <div className="bg-formigo--theme flex h-12 items-center px-4 text-white">
        <button className="" onClick={handleMonthPrevious} type="button">
          <ChevronDownIcon className="size-5! rotate-90" />
        </button>
        <span className="flex-1 text-center text-lg capitalize">{format('MMMM yyyy', stateSelectedMonthLuxon)}</span>
        <button className="" onClick={handleMonthNext} type="button">
          <ChevronDownIcon className="size-5! -rotate-90" />
        </button>
      </div>
      <div className={`flex p-4 pb-3`}>
        <table className="max-w-72 min-w-64 table-fixed text-center text-gray-600">
          <thead>
            <tr className="text-[0.64em] uppercase [&>th]:w-9">
              <th className="py-2 font-medium">{shortWeekDayNames[1]}</th>
              <th className="py-2 font-medium">{shortWeekDayNames[2]}</th>
              <th className="py-2 font-medium">{shortWeekDayNames[3]}</th>
              <th className="py-2 font-medium">{shortWeekDayNames[4]}</th>
              <th className="py-2 font-medium">{shortWeekDayNames[5]}</th>
              <th className="py-2 font-medium">{shortWeekDayNames[6]}</th>
              <th className="py-2 font-medium">{shortWeekDayNames[7]}</th>
            </tr>
          </thead>
          <tbody>{renderWeeks()}</tbody>
        </table>
        {typeof renderVerticalClock === 'function' ? (
          <table className="ml-2 w-14 text-center text-gray-600">
            <thead>
              <tr className="text-[0.56em] uppercase">
                <th className="py-2 font-medium">{YiiLang.formigo('labelCalendarHourary')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm">{renderVerticalClock()}</td>
              </tr>
            </tbody>
          </table>
        ) : undefined}
      </div>
    </div>
  );
}
