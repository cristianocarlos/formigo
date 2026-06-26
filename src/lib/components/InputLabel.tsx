import type {ReactNode} from 'react';

type TProps = {
  children: ReactNode;
  className?: string;
  hint?: string;
  htmlFor?: string;
  tagName?: 'label' | 'legend';
};

export default function InputLabel({
  children,
  className: propClassName = '',
  hint,
  htmlFor,
  tagName = 'label',
}: TProps) {
  if (children === undefined || children === null) return;
  const hintElement = hint ? (
    <em className="ml-1 text-[0.6rem] font-normal text-gray-400 not-italic">{hint}</em>
  ) : undefined;
  const className =
    'block w-fit mb-0.5 text-xs leading-none font-medium text-gray-500 after:content-["."] after:text-transparent formigo--input-label';
  if (tagName === 'legend')
    return (
      <legend className={`${className} ${propClassName}`}>
        {children}
        {hintElement}
      </legend>
    );
  return (
    <label className={`${className} ${propClassName}`} htmlFor={htmlFor}>
      {children}
      {hintElement}
    </label>
  );
}
