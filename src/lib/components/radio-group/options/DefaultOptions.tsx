import useResolveOptionProps from '@/lib/components/radio-group/options/useResolveOptionProps';
import {useRadioGroupContext} from '@/lib/components/radio-group/RadioGroupContext';
import {valueAsString} from '@/utils/helper';

import RadioOption from './RadioOption';

import type {ReactElement} from 'react';

export type TCommonOptionsProps = {
  className?: string;
  disabledOptions?: Array<string>;
  wrapperClassName?: string;
};

type TDefaultOptionsProps<GOptionData> = TCommonOptionsProps & {
  formatter?: (data: GOptionData) => ReactElement;
};

export default function DefaultOptions<GOptionData>(props: TDefaultOptionsProps<GOptionData>) {
  const {className = '', disabledOptions, formatter, wrapperClassName = ''} = props;
  const resolveOptionProps = useResolveOptionProps({disabledOptions});
  const {handleInputChange, handleInputClick, options} = useRadioGroupContext();
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {options.map((data) => {
        const htmlInputProps = resolveOptionProps(valueAsString(data.id));
        return (
          <RadioOption
            key={htmlInputProps.value}
            {...htmlInputProps}
            className={className}
            label={formatter?.(data as GOptionData) || data.label}
            onChange={handleInputChange}
            onClick={handleInputClick}
          />
        );
      })}
    </div>
  );
}
