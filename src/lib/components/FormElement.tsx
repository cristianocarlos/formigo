import type {ReactNode} from 'react';

type TProps = {
  children: ReactNode;
  className?: string;
  tagName?: 'div' | 'fieldset';
};

export default function FormElement({
  children,
  className: propClassName = '',
  tagName = 'div',
  ...htmlDataAttributeProps
}: TProps) {
  const className = 'relative mb-4 text-base leading-none formigo--form-element';
  if (tagName === 'fieldset')
    return (
      <fieldset {...htmlDataAttributeProps} className={`${className} ${propClassName}`}>
        {children}
      </fieldset>
    );
  return (
    <div {...htmlDataAttributeProps} className={`${className} ${propClassName}`}>
      {children}
    </div>
  );
}
