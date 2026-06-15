import {useSelectorFormigoHandFillValue} from '@/lib/zustand/hooks';
import YiiLang from '@/utils/yii-lang';

import type {TFormigoAttribute} from '@/lib/types/formigo';

export default function BrazilAddressHandFillMessage({attribute}: {attribute: TFormigoAttribute}) {
  const handFillValue = useSelectorFormigoHandFillValue(attribute);
  if (!handFillValue) return;
  return (
    <div className="-mt-2 mb-4 rounded bg-blue-100 px-2 py-1 text-xs" title={handFillValue}>
      {YiiLang.formigo('textFormAddressManualFillInfo')}
    </div>
  );
}
