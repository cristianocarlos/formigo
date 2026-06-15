import {useRadioGroupContext} from '@/lib/components/radio-group/RadioGroupContext';
import {resolveInputValue} from '@/lib/utils/helper';
import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooksGetterSlice';

type TUseResolveOptionParams = {
  disabledOptions?: Array<string>;
};

export default function useResolveOptionProps({disabledOptions}: TUseResolveOptionParams) {
  const {attribute, disabled, inputId, inputName, printMode, readOnly} = useRadioGroupContext();
  const attrValue = useSelectorFormigoAttrValue(attribute);
  const inputValue = resolveInputValue(attrValue, undefined, 'RadioGroup', attribute);
  return (dataId: string) => {
    let resolvedInputName: string | undefined = inputName;
    const optionDisabled = disabledOptions?.includes(dataId);
    const isChecked = inputValue === dataId;
    const hasHidden = !attrValue || (readOnly && isChecked); // Lógica relacionada ao EmptyValueHidden
    if (hasHidden) resolvedInputName = undefined;
    return {
      checked: isChecked,
      disabled: disabled || printMode || readOnly || optionDisabled,
      id: inputId + '_' + dataId,
      name: resolvedInputName,
      value: dataId,
    };
  };
}
