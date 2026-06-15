import {useCheckGroupContext} from '@/lib/components/check-group/CheckGroupContext';
import {valueAsString} from '@/utils/helper';

import useResolveOptionProps from './useResolveOptionProps';

import type {TCommonOptionsProps} from './DefaultOptions';

export default function FilledOptions<GOptionData>(props: TCommonOptionsProps<GOptionData>) {
  const {className = '', disabledOptions, formatter, hiddenOptions, readOnlyOptions, wrapperClassName = ''} = props;
  const resolveOptionProps = useResolveOptionProps({disabledOptions, hiddenOptions, readOnlyOptions});
  const {handleInputChange, options} = useCheckGroupContext();
  return (
    <div className={`inline-flex gap-1 ${wrapperClassName}`}>
      {options.map((data) => {
        const dataId = valueAsString(data.id);
        const {hiddenCheckedElement, hiddenOptionElement, ...htmlInputProps} = resolveOptionProps(dataId);
        if (hiddenOptionElement) return hiddenOptionElement;
        return (
          <label
            className={`flex cursor-pointer items-center justify-center border border-gray-300 has-checked:bg-gray-300 ${className}`}
            data-type="check-group"
            key={dataId}
          >
            {hiddenCheckedElement}
            <input
              {...htmlInputProps}
              className="absolute -left-2499.75 opacity-0"
              onChange={handleInputChange}
              type="checkbox"
            />
            {formatter?.(data as GOptionData) || data.label}
          </label>
        );
      })}
    </div>
  );
}
