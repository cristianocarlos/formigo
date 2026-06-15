import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';

import {useRadioGroupContext} from './RadioGroupContext';

export default function EmptyValueHidden() {
  const {attribute, disabled, inputName, printMode, readOnly} = useRadioGroupContext();
  const attrValue = useSelectorFormigoAttrValue(attribute);
  if (attrValue && !readOnly) return;
  return (
    <input
      disabled={disabled || printMode}
      name={inputName}
      type="hidden"
      value={attrValue || ''} // não pode ser null ou undefined
    />
  );
}
