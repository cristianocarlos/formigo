import type {CSSProperties, ReactNode} from 'react';

export default function InputAppend({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style: CSSProperties;
}) {
  return (
    <span
      className={`[&>label,&>button]:text-formigo--theme absolute top-0 right-0 z-[var(--z-formigo--input-lateral)] inline-flex h-full items-center justify-center gap-1 rounded-r-sm transition-all duration-200 ease-in-out ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
