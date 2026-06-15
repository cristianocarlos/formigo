import type {ComponentProps, ReactNode} from 'react';

type TDefaultOptionProps = Omit<ComponentProps<'input'>, 'readOnly'> & {
  className?: string;
  isOldBrowser?: boolean;
  label: ReactNode;
};

export default function RadioOption({className = '', isOldBrowser, label, ...htmlInputProps}: TDefaultOptionProps) {
  return (
    <label className={`flex w-fit items-center gap-2 text-gray-600 has-disabled:opacity-60 ${className}`}>
      <input {...htmlInputProps} className="peer absolute -left-2499.75 opacity-0" type="radio" />
      <div className="flex size-5 items-center justify-center rounded-full border border-gray-300 peer-focus:shadow peer-checked:[&>em]:block">
        <em
          className="bg-formigo--theme hidden size-3 rounded-full"
          style={
            isOldBrowser ? (htmlInputProps.checked ? {background: '#155dfc', display: 'block'} : undefined) : undefined
          }
        />
      </div>
      {label}
    </label>
  );
}
