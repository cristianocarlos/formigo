import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';

import type {TCheckTableProps, TCheckTableValues} from '@/lib/types/checkTableOrRadioTable';

type TEmptyValueHiddenProps = Pick<TCheckTableProps, 'attribute' | 'disabled' | 'printMode'> & {
  inputName: string;
};

export default function EmptyValueHidden(props: TEmptyValueHiddenProps) {
  const {attribute, disabled, inputName, printMode} = props;
  const attrValue = useSelectorFormigoAttrValue<TCheckTableValues>(attribute);
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
