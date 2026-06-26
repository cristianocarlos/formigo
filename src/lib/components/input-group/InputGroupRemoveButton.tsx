import XIconButton from '@/components/XIconButton';

import type {TButtonMouseEventHandler} from '@/types/common';

export default function InputGroupRemoveButton({
  className = '',
  handleRemove,
  index,
}: {
  className?: string;
  handleRemove: TButtonMouseEventHandler;
  index: number;
}) {
  return (
    <div className={className}>
      <XIconButton data-index={index} onClick={handleRemove} tabIndex={-1} />
    </div>
  );
}
