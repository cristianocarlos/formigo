import Check from './Check';

import type {TCheckProps} from '@/lib/types/check';

export default function CheckSwitch(props: Omit<TCheckProps, 'children'>) {
  return (
    <Check {...props}>
      <Check.Switch />
    </Check>
  );
}
