import {useRef, useState} from 'react';

import {valueAsNumber, zeroFill} from '@/utils/helper';
import {useDidMountEffect, useWillUnmountEffect} from '@/utils/hooks';
import {
  addMinutes,
  formatDate,
  formatDbDate,
  formatHour,
  getDayOfWeek,
  getHour,
  getLuxonNow,
  getMinute,
  getMonth,
  parseLuxon,
} from '@/utils/luxonHelper';
import YiiLang from '@/utils/yii-lang';

import Calendar from './Calendar';
import VerticalClock from './VerticalClock';

import type {
  TLuxonCalendarDateValues,
  TLuxonCalendarHourValues,
  TVerticalClockAppointments,
  TVerticalClockBaseExpedient,
  TVerticalClockBookingDataLoad,
  TVerticalClockCustomExpedient,
} from '@/lib/types/calendar';
import type {TDBDateString, TDBHourString} from '@/types/db-schema';
import type {TLuxonValid} from '@/types/thirdParty';

type IPVerticalClockCalendar = {
  bookingDataLoad?: TVerticalClockBookingDataLoad;
  className?: string;
  handlePick: (valueLuxon: TLuxonValid) => void;
  value?: string;
};

function resolveSelectedLuxonData(value?: string) {
  const selectedData = {
    date: getLuxonNow(),
    hour: undefined,
  } as {date: TLuxonValid; hour?: TLuxonValid};
  if (value) {
    const valueLuxon = parseLuxon(value);
    if (valueLuxon) {
      selectedData.date = valueLuxon;
      selectedData.hour = valueLuxon;
    }
  }
  return selectedData;
}

function getBookedDateValues(appointments: TVerticalClockAppointments | undefined, selectedHour: TDBHourString) {
  if (!appointments) return;
  const values = [] as Array<TDBDateString>;
  Object.keys(appointments).forEach((date) => {
    const hourRows = appointments[date];
    const hourRowsLength = hourRows.length;
    for (let i = 0; i < hourRowsLength; i++) {
      const selectedLuxon = parseLuxon(date + ' ' + selectedHour + ':00');
      const startLuxon = parseLuxon(hourRows[i].start_date_hour);
      const endLuxon = parseLuxon(hourRows[i].end_date_hour);
      if (selectedLuxon && startLuxon && endLuxon && selectedLuxon >= startLuxon && selectedLuxon < endLuxon) {
        // no final não pode ser <=, pq a hora fim vale como hora inicio
        values.push(date);
        break;
      }
    }
  });
  return values;
}

function getBookedHourValues(appointments: TVerticalClockAppointments | undefined, selectedDateLuxon: TLuxonValid) {
  if (!appointments) return;
  const dayAppointments = appointments[formatDbDate(selectedDateLuxon)];
  if (!dayAppointments) return;
  const values = [] as Array<TDBHourString>;
  dayAppointments.forEach((data) => {
    const startLuxon = parseLuxon(data.start_date_hour) as TLuxonValid;
    const endLuxon = parseLuxon(data.end_date_hour) as TLuxonValid;
    for (let hourLuxon = startLuxon; hourLuxon < endLuxon; hourLuxon = addMinutes(hourLuxon, 5)) {
      values.push(formatHour(hourLuxon));
    }
  });
  return values;
}

function getDefaulHourOptions() {
  const defaultHourOptions = [];
  for (let i = 0; i < 24; i++) {
    defaultHourOptions.push(zeroFill(i, 2) + ':00');
    defaultHourOptions.push(zeroFill(i, 2) + ':05');
    defaultHourOptions.push(zeroFill(i, 2) + ':10');
    defaultHourOptions.push(zeroFill(i, 2) + ':15');
    defaultHourOptions.push(zeroFill(i, 2) + ':20');
    defaultHourOptions.push(zeroFill(i, 2) + ':25');
    defaultHourOptions.push(zeroFill(i, 2) + ':30');
    defaultHourOptions.push(zeroFill(i, 2) + ':35');
    defaultHourOptions.push(zeroFill(i, 2) + ':40');
    defaultHourOptions.push(zeroFill(i, 2) + ':45');
    defaultHourOptions.push(zeroFill(i, 2) + ':50');
    defaultHourOptions.push(zeroFill(i, 2) + ':55');
  }
  return defaultHourOptions;
}

function getHourValues(
  dateLuxon: TLuxonValid,
  baseExpedient?: TVerticalClockBaseExpedient,
  customExpedient?: TVerticalClockCustomExpedient,
) {
  let hourValues;
  if (baseExpedient) {
    const dayExpedientData = customExpedient?.[formatDbDate(dateLuxon)];
    if (dayExpedientData?.hour_values) {
      hourValues = dayExpedientData.hour_values;
    } else {
      const weekDays = baseExpedient.week_days;
      const dayOfWeekData = weekDays[getDayOfWeek(dateLuxon) as keyof typeof weekDays];
      if (dayOfWeekData?.hour_values) {
        hourValues = dayOfWeekData.hour_values;
      }
    }
  }
  if (!hourValues) return getDefaulHourOptions();
  return hourValues;
}

export default function VerticalClockCalendar(props: IPVerticalClockCalendar) {
  const {bookingDataLoad, className = '', handlePick: propHandlePick, value} = props;

  const abortControllerRef = useRef(new AbortController());

  const selectedLuxonData = resolveSelectedLuxonData(value);
  const [appointments, setAppointments] = useState<TVerticalClockAppointments>();
  const [bookedDateValues, setBookedDateValues] = useState<TLuxonCalendarDateValues>();
  const [bookedHourValues, setBookedHourValues] = useState<TLuxonCalendarHourValues>();
  const [customExpedient, setCustomExpedient] = useState<TVerticalClockCustomExpedient>();
  const [dateLuxon, setDateLuxon] = useState(selectedLuxonData.date);
  const [hourLuxon, setHourLuxon] = useState<TLuxonValid | undefined>(selectedLuxonData.hour);
  const [hourValues, setHourValues] = useState<TLuxonCalendarHourValues>(() => getDefaulHourOptions());
  const [monthLuxon, setMonthLuxon] = useState(selectedLuxonData.date);
  const [baseExpedient, setBaseExpedient] = useState<TVerticalClockBaseExpedient>();

  useDidMountEffect(() => {
    bookingDataLoader(dateLuxon);
  });

  useWillUnmountEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  });

  const getSelectedDate = () => {
    if (dateLuxon) {
      if (getMonth(monthLuxon) === getMonth(dateLuxon)) {
        return formatDate(dateLuxon);
      }
    }
    return;
  };

  /**
   * A hora selecionada só é valida se existir nas options do dia
   */
  const getSelectedHour = () => {
    if (hourLuxon) {
      const selectedHour = formatHour(hourLuxon);
      const hourValuesLength = hourValues.length;
      for (let i = 0; i < hourValuesLength; i++) {
        if (hourValues[i] === selectedHour) {
          return selectedHour;
        }
      }
    }
    return;
  };

  const bookingDataLoader = (newDateLuxon: TLuxonValid) => {
    if (bookingDataLoad) {
      abortControllerRef.current = new AbortController();
      bookingDataLoad(newDateLuxon, abortControllerRef.current.signal).then((bookingData) => {
        setAppointments(bookingData.appointments);
        setBookedHourValues(getBookedHourValues(bookingData.appointments, newDateLuxon));
        setCustomExpedient(bookingData.customExpedient);
        setHourValues(getHourValues(newDateLuxon, bookingData.baseExpedient, bookingData.customExpedient));
        setBaseExpedient(bookingData.baseExpedient);
      });
    }
  };

  const handleDateChange = (newDateLuxon: TLuxonValid) => {
    setBookedHourValues(getBookedHourValues(appointments, newDateLuxon));
    setDateLuxon(newDateLuxon);
    setHourValues(getHourValues(newDateLuxon, baseExpedient, customExpedient));
  };

  const handleHourChange = (newValue: TDBHourString) => {
    const hourParts = newValue.split(':');
    setBookedDateValues(getBookedDateValues(appointments, newValue));
    setHourLuxon(
      parseLuxon(dateLuxon, {
        hour: valueAsNumber(hourParts[0]),
        minute: valueAsNumber(hourParts[1]),
      }),
    );
  };

  const handleMonthNext = (newMonthLuxon: TLuxonValid) => {
    setMonthLuxon(newMonthLuxon);
    bookingDataLoader(newMonthLuxon);
  };

  const handlePick = () => {
    const newDateHourLuxon = parseLuxon(dateLuxon, {
      hour: getHour(hourLuxon),
      minute: getMinute(hourLuxon),
    });
    propHandlePick(newDateHourLuxon);
  };

  const handleMonthPrevious = (newMonthLuxon: TLuxonValid) => {
    setMonthLuxon(newMonthLuxon);
    bookingDataLoader(newMonthLuxon);
  };

  // pt_br
  const selectedDate = getSelectedDate();
  const selectedHour = getSelectedHour();
  const disabledButton = !(selectedDate && selectedHour);
  return (
    <div className={className}>
      <Calendar
        bookedDateValues={bookedDateValues}
        bookedHint={YiiLang.formigo('hintCalendarDateUnavailable')}
        handleDateChange={handleDateChange}
        handleMonthNext={handleMonthNext}
        handleMonthPrevious={handleMonthPrevious}
        renderVerticalClock={() => {
          return (
            <VerticalClock
              bookedHint={YiiLang.formigo('hintCalendarDateUnavailable')}
              bookedHourValues={bookedHourValues}
              handleChange={handleHourChange}
              hourValues={hourValues}
              selectedHourLuxon={hourLuxon}
            />
          );
        }}
        selectedDateLuxon={dateLuxon}
      />
      <div className="flex px-6 pb-4 text-sm">
        <div className="flex w-36 gap-1">
          <span>{selectedDate || '__/__/____'}</span>
          <span>{selectedHour || '__:__'}</span>
        </div>
        <button className="text-formigo--theme" disabled={disabledButton} onClick={handlePick} type="button">
          {YiiLang.formigo('labelCalendarPickButton')}
        </button>
      </div>
    </div>
  );
}
