import {XIcon} from 'lucide-react';

import YiiLang from '@/utils/yii-lang';

import type {ComponentProps} from 'react';

export default function XIconButton(props: ComponentProps<'button'>) {
  const {title = YiiLang.formigo('textRemove'), ...htmlProps} = props;
  return (
    <button {...htmlProps} title={title} type="button">
      <XIcon className="text-formigo--theme size-3!" />
    </button>
  );
}
