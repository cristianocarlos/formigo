import Check from './Check';

import type {TCheckProps} from '@/lib/types/check';

export default function CheckBox(props: Omit<TCheckProps, 'children'>) {
  return (
    <Check {...props}>
      <Check.Box />
    </Check>
  );
}
