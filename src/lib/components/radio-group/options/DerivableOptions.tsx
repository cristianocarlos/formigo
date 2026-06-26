import useResolveOptionProps from '@/lib/components/radio-group/options/useResolveOptionProps';
import {useRadioGroupContext} from '@/lib/components/radio-group/RadioGroupContext';
import {getIsOldBrowser} from '@/utils/globals';
import {valueAsString} from '@/utils/helper';

import RadioOption from './RadioOption';

import type {TCommonOptionsProps} from './DefaultOptions';
import type {TRadioGroupDerivableOptionsResolverParams} from '@/lib/types/radioGroup';
import type {ReactElement} from 'react';

type TProps<GOptionData> = TCommonOptionsProps & {
  resolver: (params: TRadioGroupDerivableOptionsResolverParams<GOptionData>) => Record<string, ReactElement>;
};

export default function DerivableOptions<GOptionData>(props: TProps<GOptionData>) {
  const {className = '', disabledOptions, resolver, wrapperClassName = ''} = props;
  const resolveOptionProps = useResolveOptionProps({disabledOptions});
  const {attribute, disabled, handleInputChange, handleInputClick, options, printMode, refComponent} =
    useRadioGroupContext();
  const derivedElements = resolver({
    attribute,
    disabled,
    options,
    printMode,
    refComponent,
  } as TRadioGroupDerivableOptionsResolverParams<GOptionData>);
  const isOldBrowser = getIsOldBrowser();
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {options.map((data) => {
        const dataId = valueAsString(data.id);
        const htmlInputProps = resolveOptionProps(dataId);
        const derivedElement = derivedElements?.[dataId];
        const optionElement = (
          <RadioOption
            key={dataId}
            {...htmlInputProps}
            className={className}
            isOldBrowser={isOldBrowser}
            label={data.label}
            onChange={handleInputChange}
            onClick={handleInputClick}
          />
        );
        if (!derivedElement) return optionElement;
        return (
          <div key={dataId}>
            {optionElement}
            <div className="ml-6 [&>.formigo--form-element]:mb-0!">{derivedElement}</div>
          </div>
        );
      })}
    </div>
  );
}
