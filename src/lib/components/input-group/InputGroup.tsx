import FormElement from '@/lib/components/FormElement';
import InputLabel from '@/lib/components/InputLabel';
import {resolveGroupRows} from '@/lib/utils/helper';
import {useDispatchFormigoProduceFormState, useSelectorFormigoInputReadyValue} from '@/lib/zustand/hooks';
import {valueAsNumber} from '@/utils/helper';
import {useDidMountEffect} from '@/utils/hooks';
import YiiLang from '@/utils/yii-lang';

import InputGroupAddButton from './InputGroupAddButton';
import InputGroupRow from './InputGroupRow';
import useInputGroupHandlers from './useInputGroupHandlers';

import type {TInputGroupProps, TInputGroupValue} from '@/lib/types/inputGroup';

export default function InputGroup(props: TInputGroupProps) {
  const {
    addLimit,
    attribute,
    children,
    className = '',
    disabled,
    getItemEmptyValue,
    initValue,
    label,
    lockedRowsLength,
    printMode,
    readOnly,
    refComponent,
    ...htmlDataAttributeProps
  } = props;

  const resolveItemEmptyValue = () => {
    return typeof getItemEmptyValue === 'function' ? getItemEmptyValue() : ({} as TInputGroupValue[number]);
  };

  const resolveEmptyValue = () => {
    return [resolveItemEmptyValue()];
  };

  /**
   * HANDLERS
   */

  const {attrValueLength, groupRows, handleAdd, handleRemove, setGroupRows} = useInputGroupHandlers({
    attribute,
    refComponent,
    resolveEmptyValue,
    resolveItemEmptyValue,
  });

  /**
   * INIT
   */

  const produceFormState = useDispatchFormigoProduceFormState();
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    produceFormState((proxyState, {attrGetValueIn, mutatorAttrSetValueIn, mutatorInputReadySetValue}) => {
      const currentAttrValue = attrGetValueIn<TInputGroupValue>(proxyState, attribute);
      if (!currentAttrValue || currentAttrValue.length === 0) {
        const resolvedValue = initValue || resolveEmptyValue();
        setGroupRows(resolveGroupRows(resolvedValue.length));
        // Esta trozoba sempre vai acionar o auto-save, mas não conhecemos outra solução por hora
        mutatorAttrSetValueIn(proxyState, attribute, resolvedValue);
      }
      if (lockedRowsLength) {
        // a configuração inicial do lockedRowsLength independe do campo ter valor ou não
        const startAttrValue = attrGetValueIn<TInputGroupValue>(proxyState, attribute); // Valor já inicializado
        const startAttrValueLength = startAttrValue?.length || 0;
        setGroupRows(resolveGroupRows(lockedRowsLength));
        for (let i = startAttrValueLength; i < lockedRowsLength; i++) {
          // adiciona as linhas restantes com valor vazio
          startAttrValue?.push(resolveItemEmptyValue());
        }
        mutatorAttrSetValueIn(proxyState, attribute, startAttrValue);
      }
      mutatorInputReadySetValue(proxyState, attribute, true);
    });
  });

  /**
   * COMPONENT
   */

  if (!isReady) return;

  const renderList = () => {
    // O atributo inicial precisa estar setado pelo InputGroup, caso contrário umevento externo pode iniciar o valor antes
    // e criar um objeto {values: {0: {column: value}} no lugar de um array {values: [{column: value}] e foder tudo
    if (!attrValueLength) return;

    // 1. Quando o limite foi definido pra um não faz sentido remover, exceto quando tiver mais linhas salvas no banco
    //    Para quando o addLimit for maior que 1 pode aparecer o remover sempre
    // 2. Casos extraordinários onde o que está salvo no banco é maior que a quantidade configurada
    const preventRemove =
      (addLimit === 1 && groupRows.length === 1) || valueAsNumber(lockedRowsLength || 0) >= groupRows.length;

    return groupRows.map((_unnecessary, index) => {
      const itemAttribute = [...attribute, index.toString()];
      return (
        <InputGroupRow
          disabled={disabled}
          handleRemove={handleRemove}
          index={index}
          itemAttribute={itemAttribute}
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={index} // NECESSÁRIO uso do índice do array. Na remoção as linhas devem ser renovadas
          preventRemove={preventRemove}
          printMode={printMode}
          readOnly={readOnly}
        >
          {children}
        </InputGroupRow>
      );
    });
  };

  const renderAddButton = () => {
    if (disabled || readOnly || printMode || lockedRowsLength) return;
    if (addLimit && addLimit <= groupRows.length) {
      // Não faz sentido usar 1 como addLimit
      if (addLimit === 1) return;
      return <em>{YiiLang.formigo('feedbackFormInputGroupMaxSizeError') + ': ' + addLimit}</em>;
    }
    return <InputGroupAddButton handleAdd={handleAdd} />;
  };

  const resolvedLabel = label;

  // Não precisa usar o FieldsetWrapper, ele só ajuda na representação dos erros que aqui é no próprio componente
  const resolvedHtmlDataAttributeProps = {
    'data-test': 'formigo-test--input-group',
    ...htmlDataAttributeProps,
  };
  return (
    <FormElement {...resolvedHtmlDataAttributeProps} className={className}>
      {resolvedLabel ? <InputLabel>{resolvedLabel}</InputLabel> : undefined}
      <div className="flex flex-col gap-4">{renderList()}</div>
      {renderAddButton()}
    </FormElement>
  );
}
