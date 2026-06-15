import type {ComponentProps, ReactElement, ReactNode} from 'react';

export type TCheckBoxOptionProps = Omit<ComponentProps<'input'>, 'readOnly'> & {
  className?: string;
  dataType: string;
  hiddenElement: ReactElement<HTMLInputElement> | undefined;
  isOldBrowser?: boolean;
  label: ReactNode;
};

export default function BoxOption(props: TCheckBoxOptionProps) {
  const {className = '', dataType, hiddenElement, isOldBrowser, label, ...htmlInputProps} = props;
  return (
    <label
      className={`flex w-fit items-center gap-2 text-gray-600 has-disabled:opacity-60 ${className}`}
      data-type={dataType}
    >
      {hiddenElement}
      <input {...htmlInputProps} className="peer absolute -left-2499.75 opacity-0" type="checkbox" />
      <div className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-gray-300 peer-focus:shadow peer-checked:[&>svg]:block">
        <svg
          className="text-formigo--theme hidden size-full"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          style={isOldBrowser ? (htmlInputProps.checked ? {color: '#155dfc', display: 'block'} : undefined) : undefined}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      {label}
    </label>
  );
}
