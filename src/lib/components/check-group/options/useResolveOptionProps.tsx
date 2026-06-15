import {useCheckGroupContext} from '@/lib/components/check-group/CheckGroupContext';
import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooksGetterSlice';

import type {TCheckGroupValue} from '@/lib/types/checkGroup';

type TUseResolveOptionParams = {
  disabledOptions?: Array<string>;
  hiddenOptions?: Array<string>;
  readOnlyOptions?: Array<string>;
};

export default function useResolveOptionProps({
  disabledOptions,
  hiddenOptions,
  readOnlyOptions,
}: TUseResolveOptionParams) {
  const {attribute, disabled, inputId, inputName, printMode, readOnly} = useCheckGroupContext();
  const attrValue = useSelectorFormigoAttrValue<TCheckGroupValue>(attribute);
  return (dataId: string) => {
    const id = `${inputId}_${dataId}`;
    let resolvedInputName: string | undefined = `${inputName}[${dataId}]`;
    if (hiddenOptions?.includes(dataId)) {
      const hiddenOptionElement = (
        <input disabled={disabled || printMode} id={id} name={resolvedInputName} type="hidden" value={dataId} />
      );
      return {hiddenOptionElement: hiddenOptionElement};
    } else {
      // Quando for '' o checkedValue tem que virar undefined, caso contrário, se uma das options for 0, vai dar como checked '' == 0 true
      const checkedValue = attrValue?.[dataId];
      const optionDisabled = disabledOptions?.includes(dataId);
      const optionReadOnly = readOnlyOptions?.includes(dataId);
      const isChecked = checkedValue === dataId;
      const hasHiddenChecked = (readOnly || optionReadOnly) && isChecked;
      const hiddenCheckedElement = hasHiddenChecked ? (
        <input disabled={disabled || printMode} id={id} name={resolvedInputName} type="hidden" value={dataId} />
      ) : undefined;
      if (!attrValue || hasHiddenChecked) {
        // undefined pra não dar pau no node
        // Quando não tiver attrValue é criado um EmtyValueHidden e os checks não podem ter nome
        // Quando existir o hiddenChecked tira nome dos checks
        resolvedInputName = undefined;
      }
      return {
        checked: isChecked,
        disabled: disabled || printMode || readOnly || optionDisabled || optionReadOnly,
        hiddenCheckedElement: hiddenCheckedElement,
        id: id,
        name: resolvedInputName,
        value: dataId,
      };
    }
  };
}
