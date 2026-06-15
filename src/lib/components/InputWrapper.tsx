import Label from '@/lib/components/Label';
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
  const {attribute, children, className, inputId, label, labelHint, ...htmlDataAttributeProps} = props;
  return (
    <div {...htmlDataAttributeProps} className={`formigo--element ${className}`}>
      <Label className="formigo--input-label" htmlFor={inputId} labelHint={labelHint}>
        {label}
      </Label>
      {children}
      <OptimisticError attribute={attribute} />
    </div>
  );
}
