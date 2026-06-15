import {MessageCircleIcon} from 'lucide-react';
import {useRef} from 'react';

import HtmlElement from '@/lib/components/HtmlElement';
import InputPrepend from '@/lib/components/InputPrepend';
import InputWrapper from '@/lib/components/InputWrapper';
import useTextInputHandlers from '@/lib/components/text-input/useTextInputHandlers';
import {resolveInputValue} from '@/lib/utils/helper';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import InputPrint from '../InputPrint';
import TextAreaCounter from './TextAreaCounter';
import useTextAreaInitProps from './useTextAreaInitProps';

import type {TTextAreaProps} from '@/lib/types/input';

export default function TextArea(props: TTextAreaProps) {
  const {
    attribute,
    className = '',
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    iconElement = <MessageCircleIcon />,
    initValue,
    label,
    labelHint,
    maxLength,
    placeholder,
    printMode,
    readOnly,
    refComponent,
    refHtmlTextArea,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const refHtmlTextAreaDefault = useRef<HTMLTextAreaElement>(null);
  const refHtmlTextAreaResolved = refHtmlTextArea || refHtmlTextAreaDefault; // Quando vem nas props, tem preferência

  /**
   * HANDLERS
   */

  const {handleInputBlur, handleInputChange, handleInputFocus} = useTextInputHandlers({
    attribute,
    disabled,
    handleBlur,
    handleFocus,
    readOnly,
    refComponent,
    refHtmlInput: refHtmlTextAreaResolved,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useTextAreaInitProps({
    attribute,
    hasPrepend: !!iconElement,
    label,
    maxLength,
    placeholder,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue);
  });

  /**
   * VALIDATORS
   */

  useValidators(
    {
      attribute,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.input,
    },
    validators,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return;

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'TextArea', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={className}
      inputId={initProps.id}
      label={label}
      labelHint={labelHint}
    >
      {printMode ? (
        <InputPrint value={resolvedInputValue} />
      ) : (
        <div className="relative">
          <HtmlElement.TextArea
            disabled={disabled}
            id={initProps.id}
            maxLength={initProps.maxLength}
            name={initProps.name}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={initProps.placeholder}
            readOnly={readOnly}
            ref={refHtmlTextAreaResolved}
            style={initProps.inputStyle} /* inputStyle resolveInputStyle(!!iconElement, false) */
            value={resolvedInputValue}
          />
          <InputPrepend className="items-start" iconElement={iconElement} style={initProps.prependStyle} />
        </div>
      )}
      {!printMode && initProps.maxLength && <TextAreaCounter maxLength={initProps.maxLength} value={attrValue} />}
    </InputWrapper>
  );
}
