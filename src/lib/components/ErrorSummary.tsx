import {AlertTriangleIcon} from 'lucide-react';

import {useSelectorFormigoValidatorHasMessage} from '@/lib/zustand/hooks';
import YiiLang from '@/utils/yii-lang';

// bg-blue-100 text-blue-800 border-blue-200
// bg-red-100 text-red-800 border-red-200
// bg-yellow-100 text-yellow-800 border-yellow-200
// bg-green-100 text-green-800 border-green-200

export default function ErrorSummary({className}: {className?: string}) {
  const validatorHasMessage = useSelectorFormigoValidatorHasMessage();
  if (!validatorHasMessage) return;
  return (
    <div
      className={`flex items-center gap-2 rounded border border-yellow-200 bg-yellow-100 p-4 text-sm text-yellow-800 ${className}`}
      role="alert"
    >
      <AlertTriangleIcon className="size-8! stroke-1" />
      {YiiLang.formigo('feedbackFormValidatorErrors')}
    </div>
  );
}
