import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';

import {useCheckGroupContext} from './CheckGroupContext';

import type {TCheckGroupValue} from '@/lib/types/checkGroup';

export default function EmptyValueHidden() {
  const {attribute, disabled, inputName, printMode} = useCheckGroupContext();
  const attrValue = useSelectorFormigoAttrValue<TCheckGroupValue>(attribute);
  if (attrValue) return;
  return (
    <input
      disabled={disabled || printMode}
      name={inputName}
      type="hidden"
      value="" // não pode ser null ou undefined
    />
  );
}
