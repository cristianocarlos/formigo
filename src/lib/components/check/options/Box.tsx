import {useCheckContext} from '@/lib/components/check/CheckContext';

import BoxOption from './BoxOption';
import useResolveOptionProps from './useResolveOptionProps';

export default function Box() {
  const {handleInputChange, label} = useCheckContext();
  const {hiddenElement, ...htmlInputProps} = useResolveOptionProps();
  return (
    <BoxOption
      {...htmlInputProps}
      dataType="check-box"
      hiddenElement={hiddenElement}
      label={label}
      onChange={handleInputChange}
    />
  );
}
