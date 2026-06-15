import {useCheckGroupContext} from '@/lib/components/check-group/CheckGroupContext';
import BoxOption from '@/lib/components/check/options/BoxOption';
import {getIsOldBrowser} from '@/utils/globals';
import {valueAsString} from '@/utils/helper';

import useResolveOptionProps from './useResolveOptionProps';

import type {TCommonOptionsProps} from './DefaultOptions';
import type {TCheckGroupDerivableOptionsResolverParams} from '@/lib/types/checkGroup';
import type {ReactElement} from 'react';

type TProps<GOptionData> = TCommonOptionsProps<GOptionData> & {
  resolver: (params: TCheckGroupDerivableOptionsResolverParams<GOptionData>) => Record<string, ReactElement>;
};

export default function DerivableOptions<GOptionData>(props: TProps<GOptionData>) {
  const {
    className = '',
    disabledOptions,
    formatter,
    hiddenOptions,
    readOnlyOptions,
    resolver,
    wrapperClassName = '',
  } = props;
  const resolveOptionProps = useResolveOptionProps({disabledOptions, hiddenOptions, readOnlyOptions});
  const {attribute, disabled, handleInputChange, options, printMode, refComponent} = useCheckGroupContext();

  const derivedElements = resolver({
    attribute,
    disabled,
    isCheckGroup: true,
    options,
    printMode,
    refComponent,
  } as TCheckGroupDerivableOptionsResolverParams<GOptionData>);
  const isOldBrowser = getIsOldBrowser();
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {options.map((data) => {
        const dataId = valueAsString(data.id);
        const {hiddenCheckedElement, hiddenOptionElement, ...htmlInputProps} = resolveOptionProps(dataId);
        if (hiddenOptionElement) return hiddenOptionElement;
        const derivedElement = derivedElements?.[dataId];
        const optionElement = (
          <BoxOption
            key={dataId}
            {...htmlInputProps}
            className={className}
            dataType="check-group"
            hiddenElement={hiddenCheckedElement}
            isOldBrowser={isOldBrowser}
            label={formatter?.(data as GOptionData) || data.label}
            onChange={handleInputChange}
          />
        );
        if (!derivedElement) return optionElement;
        return (
          <div key={dataId}>
            {optionElement}
            <div className="ml-6 [&>.formigo--element]:mb-0!">{derivedElement}</div>
          </div>
        );
      })}
    </div>
  );
}
