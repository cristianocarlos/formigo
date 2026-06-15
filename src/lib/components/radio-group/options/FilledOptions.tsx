import useResolveOptionProps from '@/lib/components/radio-group/options/useResolveOptionProps';
import {useRadioGroupContext} from '@/lib/components/radio-group/RadioGroupContext';
import {getIsOldBrowser} from '@/utils/globals';
import {valueAsString} from '@/utils/helper';

import type {TCommonOptionsProps} from './DefaultOptions';

export default function FilledOptions({className = '', disabledOptions, wrapperClassName = ''}: TCommonOptionsProps) {
  const resolveOptionProps = useResolveOptionProps({disabledOptions});
  const {handleInputChange, handleInputClick, options, refHtmlOptionList} = useRadioGroupContext();
  const isOldBrowser = getIsOldBrowser();
  return (
    <div className={`inline-flex gap-1 ${wrapperClassName}`} ref={refHtmlOptionList}>
      {options.map((data) => {
        const htmlInputProps = resolveOptionProps(valueAsString(data.id));
        return (
          <label
            className={`has-checked:bg-formigo--theme flex cursor-pointer items-center justify-center border border-gray-300 has-checked:border-transparent has-checked:text-white ${className}`}
            key={htmlInputProps.value}
            style={
              isOldBrowser ? (htmlInputProps.checked ? {background: '#155dfc', color: 'white'} : undefined) : undefined
            }
          >
            <input
              {...htmlInputProps}
              className="absolute -left-2499.75 opacity-0"
              onChange={handleInputChange}
              onClick={handleInputClick}
              type="radio"
            />
            {data.label}
          </label>
        );
      })}
    </div>
  );
}
