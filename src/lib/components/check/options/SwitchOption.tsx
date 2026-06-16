import type {TCheckBoxOptionProps} from '@/lib/components/check/options/BoxOption';

export default function SwitchOption(props: TCheckBoxOptionProps) {
  const {className = '', dataType, hiddenElement, label, ...htmlInputProps} = props;
  return (
    <label
      className={`text-formigo--readable flex w-fit items-center gap-2 has-disabled:opacity-60 ${className}`}
      data-type={dataType}
    >
      {hiddenElement}
      <input {...htmlInputProps} className="peer absolute -left-2499.75 opacity-0" type="checkbox" />
      <div className="peer-checked:bg-formigo--theme relative h-5 w-9 cursor-pointer rounded-full bg-gray-300 after:absolute after:inset-s-[2px] after:top-[2px] after:size-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
      {label}
    </label>
  );
}
