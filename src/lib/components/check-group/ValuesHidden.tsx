import Hidden from '@/lib/components/Hidden';
import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooksGetterSlice';

import type {TCheckGroupCheckValue} from '@/lib/types/checkGroup';
import type {THiddenProps} from '@/lib/types/input';

export default function ValuesHidden(props: THiddenProps) {
  const attrValue = useSelectorFormigoAttrValue(props.attribute);
  const attrValueValues = attrValue ? Object.values(attrValue) : [];
  const flatValues = attrValueValues.reduce((accumulator, data) => {
    accumulator.push(data);
    return accumulator;
  }, [] as Array<TCheckGroupCheckValue>);
  return (
    <Hidden
      {...props}
      dataType="check-group-values"
      value={flatValues.length === 0 ? undefined : JSON.stringify(flatValues)}
    />
  );
}
