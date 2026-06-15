import {useCheckContext} from '@/lib/components/check/CheckContext';

import SwitchOption from './SwitchOption';
import useResolveOptionProps from './useResolveOptionProps';

export default function Box() {
  const {handleInputChange, label} = useCheckContext();
  const {hiddenElement, ...htmlInputProps} = useResolveOptionProps();
  return (
    <SwitchOption
      {...htmlInputProps}
      dataType="check-box"
      hiddenElement={hiddenElement}
      label={label}
      onChange={handleInputChange}
    />
  );
}
