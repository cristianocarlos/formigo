import ErrorSummary from '@/lib/components/ErrorSummary';

import type {ReactNode} from 'react';

type TProps = {
  children: ReactNode;
  className?: string;
  hasFeedback?: boolean;
};

export default function ButtonSet({children, className = '', hasFeedback = true}: TProps) {
  return (
    <div className={`pt-4 ${className}`} role="group">
      {hasFeedback ? <ErrorSummary className="mb-2" /> : undefined}
      <div className="flex w-full items-center gap-4">{children}</div>
    </div>
  );
}
