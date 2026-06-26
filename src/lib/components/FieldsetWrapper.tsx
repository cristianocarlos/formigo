import FormElement from '@/lib/components/FormElement';
import InputLabel from '@/lib/components/InputLabel';
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
    <FormElement
      {...htmlDataAttributeProps}
      className={`has-[.optimistic-error]:shadow-xl ${className}`}
      tagName="fieldset"
    >
      {legend ? <InputLabel tagName="legend">{legend}</InputLabel> : undefined}
      {children}
      <OptimisticError attribute={attribute} />
    </FormElement>
  );
}
