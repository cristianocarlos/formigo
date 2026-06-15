import Hidden from '@/lib/components/Hidden';

import {useCheckGroupContext} from './CheckGroupContext';

import type {TCheckGroupOptionRows} from '@/lib/types/checkGroup';
import type {THiddenProps} from '@/lib/types/input';

export default function DescriptionsHidden(props: THiddenProps) {
  const {options} = useCheckGroupContext();
  const descriptions = options.reduce(
    (accumulator, data) => {
      accumulator[data.id] = data.label;
      return accumulator;
    },
    {} as Record<string, TCheckGroupOptionRows[number]['label']>,
  );
  return <Hidden {...props} dataType="check-group-descriptions" value={JSON.stringify(descriptions)} />;
}
