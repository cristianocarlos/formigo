import type {TDBDateHourString, TDBDateString, TDBHourString} from '@/types/db-schema';
import type {TLuxonValid} from '@/types/thirdParty';
import type {ReactElement} from 'react';

type TDBScheduleExpedientDataWeekDaysItemDataHourRowsItemData = {duration: number; hour_desc: TDBHourString};
type TDBScheduleExpedientDataWeekDaysItemData = {
  am_appointment_duration?: number;
  am_end?: TDBHourString;
  am_start?: TDBHourString;
  hour_rows?: Array<TDBScheduleExpedientDataWeekDaysItemDataHourRowsItemData>;
  hour_values?: Array<TDBHourString>;
  pm_appointment_duration?: number;
  pm_end?: TDBHourString;
  pm_start?: TDBHourString;
};
type TDBScheduleExpedientDataWeekDays = {
  1?: TDBScheduleExpedientDataWeekDaysItemData;
  2?: TDBScheduleExpedientDataWeekDaysItemData;
  3?: TDBScheduleExpedientDataWeekDaysItemData;
  4?: TDBScheduleExpedientDataWeekDaysItemData;
  5?: TDBScheduleExpedientDataWeekDaysItemData;
  6?: TDBScheduleExpedientDataWeekDaysItemData;
};

type TScheduleBaseExpedient = {
  custom_max_hour?: number;
  custom_min_hour?: number;
  max_hour?: number;
  min_hour?: number;
  week_days: TDBScheduleExpedientDataWeekDays;
};

type TScheduleCustomExpedient = {
  [dbDate: TDBDateString]: {
    hour_rows: Array<TDBScheduleExpedientDataWeekDaysItemDataHourRowsItemData>;
    hour_values: Array<TDBHourString>;
    is_locked: boolean;
  };
};

export type TVerticalClockBaseExpedient = TScheduleBaseExpedient;
export type TVerticalClockCustomExpedient = TScheduleCustomExpedient;
export type TLuxonCalendarDateValues = Array<TDBDateString>;
export type TLuxonCalendarHourValues = Array<TDBHourString>;

export type TVerticalClockAppointments = {
  [dbDate: string]: Array<{
    end_date_hour: TDBDateHourString;
    start_date_hour: TDBDateHourString;
  }>;
};

export type TVerticalClockBookingDataLoad = (
  valueLuxon: TLuxonValid,
  abortSignal: AbortSignal,
) => Promise<{
  appointments?: TVerticalClockAppointments;
  baseExpedient?: TScheduleBaseExpedient;
  customExpedient?: TScheduleCustomExpedient;
}>;

//

export type TDayOfMonthProps = {
  bookedHint?: string;
  dateLuxon: TLuxonValid;
  dateRenderer?: (date: TLuxonValid) => ReactElement;
  handleDateChange?: (date: TLuxonValid) => void;
  isBooked: boolean;
  preventSelectedDateHighlight?: boolean;
  selectedDateLuxon: TLuxonValid;
  selectedMonthLuxon: TLuxonValid;
};

export type TWeekProps = Pick<
  TDayOfMonthProps,
  'dateRenderer' | 'handleDateChange' | 'preventSelectedDateHighlight' | 'selectedDateLuxon' | 'selectedMonthLuxon'
> & {
  bookedDateValues?: TLuxonCalendarDateValues;
  bookedHint?: string;
  mondayLuxon: TLuxonValid;
};

export type TCalendarProps = Pick<
  TWeekProps,
  'bookedDateValues' | 'bookedHint' | 'dateRenderer' | 'handleDateChange' | 'preventSelectedDateHighlight'
> & {
  className?: string;
  handleMonthNext?: (monthLuxon: TLuxonValid) => void;
  handleMonthPrevious?: (monthLuxon: TLuxonValid) => void;
  renderVerticalClock?: () => ReactElement;
  selectedDateLuxon: TLuxonValid;
};
