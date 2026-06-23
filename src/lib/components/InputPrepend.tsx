import type {CSSProperties, ReactElement} from 'react';

export default function InputPrepend({
  className = '',
  iconElement,
  style,
}: {
  className?: string;
  iconElement?: ReactElement;
  style: CSSProperties;
}) {
  if (!iconElement) return;
  return (
    <span
      className={`peer-focus:text-formigo--theme op-0 absolute left-0 z-[var(--z-formigo--input-lateral)] inline-flex h-full items-center justify-center rounded-l-sm text-gray-400 transition-all duration-200 ease-in-out [&>.lucide]:stroke-1 ${className}`}
      style={style}
    >
      {iconElement}
    </span>
  );
}
