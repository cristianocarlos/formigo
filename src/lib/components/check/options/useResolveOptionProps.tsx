import {useCheckContext} from '@/lib/components/check/CheckContext';
import {resolveInputValue} from '@/lib/utils/helper';
import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooksGetterSlice';

export default function useResolveOptionProps() {
  const {attribute, checkValue, disabled, inputId, inputName, printMode, readOnly, uncheckValue} = useCheckContext();
  const attrValue = useSelectorFormigoAttrValue(attribute);
  const inputValue = resolveInputValue(attrValue, uncheckValue, 'Check', attribute);
  const isChecked = checkValue === inputValue;
  let resolvedInputName: string | undefined = inputName;
  let hiddenElement;
  if (!isChecked || readOnly) {
    hiddenElement = (
      <input disabled={disabled || printMode} name={resolvedInputName} type="hidden" value={uncheckValue} />
    );
    resolvedInputName = undefined; // quando existir o hidden o Check não pode ter name [da pau no node]
  }
  return {
    checked: isChecked,
    disabled: disabled || printMode || readOnly,
    hiddenElement,
    id: inputId,
    name: resolvedInputName,
    value: inputValue,
  };
}
