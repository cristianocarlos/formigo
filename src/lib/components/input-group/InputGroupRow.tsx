import InputGroupRemoveButton from './InputGroupRemoveButton';

import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {TInputGroupProps} from '@/lib/types/inputGroup';
import type {TButtonMouseEventHandler} from '@/types/common';

type IPInputGroupRow = Pick<TInputGroupProps, 'children' | 'disabled' | 'printMode' | 'readOnly'> & {
  handleRemove: TButtonMouseEventHandler;
  index: number;
  itemAttribute: TFormigoAttribute;
  preventRemove?: boolean;
};

export default function InputGroupRow(props: IPInputGroupRow) {
  const {children, disabled, handleRemove, index, itemAttribute, preventRemove, printMode, readOnly} = props;
  return (
    <div className="flex items-center gap-2 border-t-2 border-dotted border-gray-200 pt-4 first:border-0 first:pt-0">
      <div className="-mb-4 basis-full">{children({index, itemAttribute})}</div>
      {disabled || readOnly || printMode || preventRemove ? undefined : (
        <InputGroupRemoveButton handleRemove={handleRemove} index={index} />
      )}
    </div>
  );
}
