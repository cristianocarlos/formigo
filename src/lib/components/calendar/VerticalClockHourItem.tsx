import {uniqueId} from '@/utils/helper';

import type {TInputChangeEventHandler} from '@/types/common';

type TProps = {
  bookedHint?: string;
  handleChange?: TInputChangeEventHandler;
  height: number;
  hour: string;
  isBooked: boolean;
  isChecked: boolean;
};

export default function VerticalClockHourItem(props: TProps) {
  const {bookedHint, handleChange, height, hour, isBooked, isChecked} = props;
  const radioName = 'hour_picker_' + uniqueId();
  const radioId = radioName + '_' + hour;
  return (
    <>
      <input
        checked={isChecked}
        className="hidden"
        id={radioId}
        name={radioName}
        onChange={handleChange}
        type="radio"
        value={hour}
      />
      <label
        className={`flex w-10/12 cursor-pointer items-center justify-center rounded leading-none ${isBooked ? 'line-through opacity-70' : ''} ${isChecked ? 'bg-formigo--theme text-white' : ''}`}
        htmlFor={radioId}
        style={{height}}
        title={isBooked ? bookedHint : undefined}
      >
        {hour}
      </label>
    </>
  );
}
