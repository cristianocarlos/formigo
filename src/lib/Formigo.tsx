import {useFormigoContext} from '@/lib/utils/withContext';

import type {TFormigoRequestMethod} from '@/lib/types/formigo';
import type {ReactNode, RefObject} from 'react';

export type TFormigoProps = {
  action?: string;
  apiRequestMethod?: TFormigoRequestMethod;
  children?: ReactNode;
  className?: string;
  method?: string;
  ref?: RefObject<HTMLFormElement>;
};

export default function Formigo(props: TFormigoProps) {
  const {action, apiRequestMethod, children, className = '', method, ...htmlProps} = props;
  const {formId, recordId} = useFormigoContext();
  return (
    <form
      {...htmlProps}
      action={action}
      className={className}
      data-method={apiRequestMethod || (recordId ? 'put' : 'post')}
      id={formId}
      method={method || 'post'}
    >
      {children}
    </form>
  );
}
