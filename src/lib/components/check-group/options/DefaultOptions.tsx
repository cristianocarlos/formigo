import {useCheckGroupContext} from '@/lib/components/check-group/CheckGroupContext';
import BoxOption from '@/lib/components/check/options/BoxOption';
import {valueAsString} from '@/utils/helper';

import useResolveOptionProps from './useResolveOptionProps';

import type {ReactElement} from 'react';

export type TCommonOptionsProps<GOptionData> = {
  className?: string;
  disabledOptions?: Array<string>;
  formatter?: (data: GOptionData) => ReactElement;
  hiddenOptions?: Array<string>;
  readOnlyOptions?: Array<string>;
  wrapperClassName?: string;
};

export default function DefaultOptions<GOptionData>(props: TCommonOptionsProps<GOptionData>) {
  const {className = '', disabledOptions, formatter, hiddenOptions, readOnlyOptions, wrapperClassName = ''} = props;
  const resolveOptionProps = useResolveOptionProps({disabledOptions, hiddenOptions, readOnlyOptions});
  const {handleInputChange, options} = useCheckGroupContext();
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {options.map((data) => {
        const {hiddenCheckedElement, hiddenOptionElement, ...htmlInputProps} = resolveOptionProps(
          valueAsString(data.id),
        );
        if (hiddenOptionElement) return hiddenOptionElement;
        return (
          <BoxOption
            key={htmlInputProps.value}
            {...htmlInputProps}
            className={className}
            dataType="check-group"
            hiddenElement={hiddenCheckedElement}
            label={formatter?.(data as GOptionData) || data.label}
            onChange={handleInputChange}
          />
        );
      })}
    </div>
  );
}
