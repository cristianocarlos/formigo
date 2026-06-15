import type {TLinkMouseEventHandler} from '@/types/common';
import type {ComponentProps} from 'react';

const handleDisabled: TLinkMouseEventHandler = (e) => {
  e.preventDefault();
};

type IPTargetLink = ComponentProps<'a'> & {
  disabled?: boolean;
};

export default function TargetLink(props: IPTargetLink) {
  const {
    children,
    className,
    disabled,
    onClick,
    rel,
    target,
    ...htmlProps // Para os atributos data-*
  } = props;

  const disabledClassName = disabled ? 'disabled' : '';
  let resolvedRel = rel;
  if (!resolvedRel) {
    resolvedRel = !target || target === '_self' ? undefined : 'noopener noreferrer';
  }

  return (
    <a
      {...htmlProps}
      className={`${disabledClassName} ${className}`}
      onClick={disabled ? handleDisabled : onClick}
      rel={resolvedRel}
      target={target}
    >
      {children}
    </a>
  );
}
