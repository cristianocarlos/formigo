import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';

import type {TRadioTableProps, TRadioTableValues} from '@/lib/types/checkTableOrRadioTable';

type TEmptyValueHiddenProps = Pick<TRadioTableProps, 'attribute' | 'disabled' | 'printMode'> & {
  inputName: string;
};

export default function EmptyValueHidden(props: TEmptyValueHiddenProps) {
  const {attribute, disabled, inputName, printMode} = props;
  const attrValue = useSelectorFormigoAttrValue<TRadioTableValues>(attribute);
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
