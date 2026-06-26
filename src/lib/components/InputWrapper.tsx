import FormElement from '@/lib/components/FormElement';
import InputLabel from '@/lib/components/InputLabel';
import OptimisticError from '@/lib/components/OptimisticError';

import type {TFormigoAttribute, TFormigoLabel} from '@/lib/types/formigo';
import type {ComponentProps} from 'react';

type TProps = ComponentProps<'div'> & {
  attribute: TFormigoAttribute;
  inputId?: string; // id do input para o for do label
  label?: TFormigoLabel;
  labelHint?: string;
};

export default function InputWrapper(props: TProps) {
  const {attribute, children, className = '', inputId, label, labelHint, ...htmlDataAttributeProps} = props;
  return (
    <FormElement {...htmlDataAttributeProps} className={className}>
      <InputLabel hint={labelHint} htmlFor={inputId}>
        {label}
      </InputLabel>
      {children}
      <OptimisticError attribute={attribute} />
    </FormElement>
  );
}
