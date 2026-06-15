import type {ComponentProps} from 'react';

const HtmlElement = () => null;

const placeholderClassName = 'placeholder:text-gray-300 placeholder:italic focus:placeholder:opacity-50';
const focusClassName = 'focus:not-read-only:enabled:border-formigo--theme peer';
const disabldedClassName = 'disabled:bg-gray-100 disabled:opacity-70 disabled:select-none disabled:[&~*]:opacity-70';
const readOnlyClassName = 'read-only:bg-gray-50 read-only:opacity-70 read-only:select-none';
const commonClassName =
  'transition-all duration-200 ease-in-out w-full rounded-sm border border-solid border-gray-300 bg-white text-gray-600 outline-0';

function Input({className = '', ...htmlProps}: ComponentProps<'input'>) {
  return (
    <input
      {...htmlProps}
      className={`h-full ${className} ${commonClassName} ${placeholderClassName} ${focusClassName} ${disabldedClassName} ${readOnlyClassName}`}
    />
  );
}

function TextArea({className = '', ...htmlProps}: ComponentProps<'textarea'>) {
  return (
    <textarea
      {...htmlProps}
      className={`max-h-96 min-h-24 resize-none ${className} ${commonClassName} ${placeholderClassName} ${focusClassName} ${disabldedClassName} ${readOnlyClassName}`}
    />
  );
}

function ComboBoxInput({className = '', ...htmlProps}: ComponentProps<'input'>) {
  return (
    <input
      {...htmlProps}
      className={`h-full ${className} ${commonClassName} ${placeholderClassName} ${focusClassName} ${disabldedClassName} ${readOnlyClassName}`}
    />
  );
}

function ComboSelectInput({className = '', ...htmlProps}: ComponentProps<'input'>) {
  return (
    <input
      {...htmlProps}
      className={`h-full cursor-pointer bg-linear-to-b from-gray-50 to-gray-100 focus:from-white focus:to-white ${className} ${commonClassName} ${placeholderClassName} ${focusClassName} ${disabldedClassName} ${readOnlyClassName}`}
    />
  );
}

HtmlElement.Input = Input;
HtmlElement.TextArea = TextArea;
HtmlElement.ComboBoxInput = ComboBoxInput;
HtmlElement.ComboSelectInput = ComboSelectInput;

export default HtmlElement;
