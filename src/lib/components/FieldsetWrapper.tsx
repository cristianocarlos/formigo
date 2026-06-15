import OptimisticError from '@/lib/components/OptimisticError';

import type {TFormigoAttribute, TFormigoLabel} from '@/lib/types/formigo';
import type {ComponentProps} from 'react';

type TFieldWrapperProps = ComponentProps<'fieldset'> & {
  attribute: TFormigoAttribute;
  legend?: TFormigoLabel;
};

export default function FieldsetWrapper(props: TFieldWrapperProps) {
  const {attribute, children, className = '', legend, ...htmlDataAttributeProps} = props;
  return (
    <fieldset {...htmlDataAttributeProps} className={`formigo--element has-[.optimistic-error]:shadow-xl ${className}`}>
      {legend ? <legend className="formigo--input-label">{legend}</legend> : undefined}
      {children}
      <OptimisticError attribute={attribute} />
    </fieldset>
  );
}
