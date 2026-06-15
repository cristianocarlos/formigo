import {useState} from 'react';

import {useRadioGroupContext} from '@/lib/components/radio-group/RadioGroupContext';
import {useDidMountEffect} from '@/utils/hooks';
import YiiLang from '@/utils/yii-lang';

export default function RatingOptionsGuide({
  className = '',
  maxLabel,
  minLabel,
}: {
  className?: string;
  maxLabel?: string;
  minLabel?: string;
}) {
  const {refHtmlOptionList} = useRadioGroupContext();
  const [width, setWidth] = useState<number>();
  useDidMountEffect(() => {
    setWidth(refHtmlOptionList.current?.offsetWidth);
  });
  return (
    <div className={className} style={{width}}>
      <div className="flex items-center px-6">
        <div className="mf__formigo__rating-options-guide-bullet size-1 rounded-full bg-black"></div>
        <hr className="mf__formigo__rating-options-guide-line flex-1"></hr>
        <div className="mf__formigo__rating-options-guide-bullet size-1 rounded-full bg-black"></div>
      </div>
      <div className="mf__formigo__rating-options-guide-labels flex text-xs font-thin">
        <div className="">{minLabel || YiiLang.formigo('labelFormRateVeryBad')}</div>
        <div className="flex-1"></div>
        <div className="">{maxLabel || YiiLang.formigo('labelFormRateVeryGood')}</div>
      </div>
    </div>
  );
}
