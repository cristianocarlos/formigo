import FieldsetWrapper from '@/lib/components/FieldsetWrapper';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {maxSizeValidator, minSizeValidator} from '@/lib/utils/validators';
import {useDispatchFormigoInputPrepare, useSelectorFormigoInputReadyValue} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import {CheckGroupContext} from './CheckGroupContext';
import DescriptionsHidden from './DescriptionsHidden';
import EmptyValueHidden from './EmptyValueHidden';
import DefaultOptions from './options/DefaultOptions';
import DerivableOptions from './options/DerivableOptions';
import FilledOptions from './options/FilledOptions';
import useCheckGroupHandlers from './useCheckGroupHandlers';
import ValuesHidden from './ValuesHidden';

import type {TCheckGroupOptionRows, TCheckGroupProps} from '@/lib/types/checkGroup';

// Quando o id das options é um sequencial, iniciando em zero, precisa um hack pra nunca ser convertido em array no json
// Uma option {id: '.', label: null} com hiddenOptions = {['.']}
// Acontece pelo índice ser um sequencial iniciando em zero, isso faz com que a conversão do PHP
// "adivinhe" o tipo do valor, convertendo em um json array

CheckGroup.Options = DefaultOptions;
CheckGroup.DerivableOptions = DerivableOptions;
CheckGroup.DescriptionsHidden = DescriptionsHidden;
CheckGroup.FilledOptions = FilledOptions;
CheckGroup.ValuesHidden = ValuesHidden;

export default function CheckGroup<GOptionData extends TCheckGroupOptionRows[number]>(
  props: TCheckGroupProps<GOptionData>,
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
    maxSize,
    minSize,
    options,
    printMode,
    readOnly,
    refComponent,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange} = useCheckGroupHandlers({
    attribute,
    disabled,
    handleChange,
    options,
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

  const resolvedValidators = validators || [];

  useDidMountEffect(() => {
    if (maxSize) {
      resolvedValidators.push(maxSizeValidator({attribute, maxSize}));
    }
    if (minSize) {
      resolvedValidators.push(minSizeValidator({attribute, minSize}));
    }
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
      validationType: VALIDATION_TYPES.checkGroup,
    },
    resolvedValidators,
  );

  /**
   * COMPONENT
   */

  if (!isReady) return;

  return (
    <CheckGroupContext
      value={{
        ...props,
        handleInputChange,
        inputId: initProps.id,
        inputName: initProps.name,
      }}
    >
      <FieldsetWrapper
        attribute={attribute}
        className={`${printMode ? 'grayscale-100' : ''} ${className}`}
        legend={label}
        role="listbox"
      >
        <EmptyValueHidden />
        {children || <CheckGroup.Options />}
      </FieldsetWrapper>
    </CheckGroupContext>
  );
}
