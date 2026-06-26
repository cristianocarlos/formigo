import {useRef} from 'react';

import FieldsetWrapper from '@/lib/components/FieldsetWrapper';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {useDispatchFormigoInputPrepare, useSelectorFormigoInputReadyValue} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import EmptyValueHidden from './EmptyValueHidden';
import DefaultOptions from './options/DefaultOptions';
import DerivableOptions from './options/DerivableOptions';
import FilledOptions from './options/FilledOptions';
import RatingOptions from './options/RatingOptions';
import {RadioGroupContext} from './RadioGroupContext';
import useRadioGroupHandlers from './useRadioGroupHandlers';

import type {TRadioGroupOptionRows, TRadioGroupProps} from '@/lib/types/radioGroup';

RadioGroup.Options = DefaultOptions;
RadioGroup.DerivableOptions = DerivableOptions;
RadioGroup.FilledOptions = FilledOptions;
RadioGroup.RatingOptions = RatingOptions;

export default function RadioGroup<GOptionData extends TRadioGroupOptionRows[number]>(
  props: TRadioGroupProps<GOptionData>,
) {
  const {
    attribute,
    children,
    className = '',
    disabled,
    forceValidateOnSubmit,
    handleChange,
    initValue,
    label,
    preventUncheck,
    printMode,
    readOnly,
    refComponent,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const refHtmlOptionList = useRef<HTMLDivElement>(null);

  /**
   * HANDLERS
   */

  const {handleInputChange, handleInputClick} = useRadioGroupHandlers({
    attribute,
    disabled,
    handleChange,
    preventUncheck,
    readOnly,
    refComponent,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({attribute});

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
      validationType: VALIDATION_TYPES.radioGroup,
    },
    validators || [],
  );

  /**
   * COMPONENT
   */

  if (!isReady) return null;

  return (
    <RadioGroupContext
      value={{
        ...props,
        handleInputChange,
        handleInputClick,
        inputId: initProps.id,
        inputName: initProps.name,
        refHtmlOptionList,
      }}
    >
      <FieldsetWrapper
        attribute={attribute}
        className={`${printMode ? 'grayscale-100' : ''} ${className}`}
        data-test="formigo-test--radio-group"
        legend={label}
        role="radiogroup"
      >
        <EmptyValueHidden />
        {children || <RadioGroup.Options />}
      </FieldsetWrapper>
    </RadioGroupContext>
  );
}
