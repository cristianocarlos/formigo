import YiiLang from '@/utils/yii-lang';

import type {ComponentProps} from 'react';

export default function SubmitButton({children, className = '', ...htmlProps}: ComponentProps<'button'>) {
  return (
    <button {...htmlProps} className={`formigo--button-primary disabled:animate-pulse ${className}`}>
      {children || YiiLang.formigo('labelFormSubmitButton')}
    </button>
  );
}
