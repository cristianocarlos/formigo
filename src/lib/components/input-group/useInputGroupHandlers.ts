import {useState} from 'react';

import {resolveGroupRows} from '@/lib/utils/helper';
import {
  useDispatchFormigoAttrArrayRemoveItem,
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoInputResetErrors,
  useSelectorFormigoAttrArrayLength,
} from '@/lib/zustand/hooks';
import {valueAsNumber} from '@/utils/helper';
import {useDidUpdateEffect} from '@/utils/hooks';

import type {TInputGroupProps, TInputGroupValue} from '@/lib/types/inputGroup';
import type {TButtonMouseEventHandler} from '@/types/common';

type TUseInputGroupHandlers = {
  attribute: TInputGroupProps['attribute'];
  refComponent: TInputGroupProps['refComponent'];
  resolveEmptyValue: () => TInputGroupValue;
  resolveItemEmptyValue: () => TInputGroupValue[number];
};

export default function useInputGroupHandlers(params: TUseInputGroupHandlers) {
  const {attribute, refComponent, resolveEmptyValue, resolveItemEmptyValue} = params;

  const attrArrayRemoveItem = useDispatchFormigoAttrArrayRemoveItem(attribute);
  const inputResetErrors = useDispatchFormigoInputResetErrors(null);
  // Usados apenas nos casos do valor ser resetado por fora do componente
  const attrSetValue = useDispatchFormigoAttrSetValue<TInputGroupValue>(attribute);
  const attrKeyPathSetValue = useDispatchFormigoAttrSetValue<TInputGroupValue[number]>(null);

  // const initAttrValue = useInitFormigoAttrValue(attribute);
  // const [groupRows, setGroupRows] = useState(resolveGroupRows((initAttrValue && initAttrValue.length) || 1));

  const attrValueLength = useSelectorFormigoAttrArrayLength(attribute);
  const [groupRows, setGroupRows] = useState(() => resolveGroupRows(attrValueLength || 1));
  const groupRowsLength = groupRows.length;

  useDidUpdateEffect(() => {
    // Quando o valor é setado por fora do componente, com zustand, é necessário atualizar o número de linhas
    // O melhor caminho é usar o replaceValue pelo refComponent, mas tem situações onde isso não é possível
    // Como por exemplo no PatientDataPicker, seria insano dar um replaceValue em cada campo da tela
    if (attrValueLength !== groupRowsLength) {
      setGroupRows(resolveGroupRows(attrValueLength || 1));
    }
    if (attrValueLength === 0) {
      // Quando o campo é resetado por algum comando externo no client, o valor pode ser null/undefined
      // É necessário criar um array com valore vazio, senão ao digitar o lodash cria o valor como objeto {0: {number: '1'}}
      attrSetValue(resolveEmptyValue());
    }
    // Só interessa o monitoramento dos lenghts
  }, [attrValueLength, groupRowsLength]);

  const removeLastItem = () => {
    attrSetValue(resolveEmptyValue());
  };

  const resetError = () => {
    const emptyValueKeys = Object.keys(resolveItemEmptyValue());
    if (emptyValueKeys.length > 0) {
      for (let i = 0; i < groupRows.length; i++) {
        emptyValueKeys.forEach((itemKey) => {
          inputResetErrors([...attribute, i.toString(), itemKey]);
        });
      }
    }
  };

  const replaceValue = (items?: unknown) => {
    if (Array.isArray(items)) {
      setGroupRows(resolveGroupRows(items.length));
      attrSetValue(items);
    } else {
      setGroupRows(resolveGroupRows(1));
      removeLastItem();
    }
  };

  const resetValue = () => {
    replaceValue();
  };

  const handleAdd = () => {
    const newGroupRows = groupRows.slice(); // Clona
    newGroupRows.push(Date.now());
    setGroupRows(newGroupRows);
    attrKeyPathSetValue(resolveItemEmptyValue(), [...attribute, (newGroupRows.length - 1).toString()]);
  };

  const handleRemove: TButtonMouseEventHandler = (e) => {
    if (groupRows.length === 1) {
      removeLastItem();
    } else {
      const itemIndex = valueAsNumber(e.currentTarget.dataset.index || 0);
      // Remove o valor
      attrArrayRemoveItem(itemIndex);
      // Ajusta as linhas
      const newGroupRows = groupRows.slice(); // Clona
      newGroupRows.splice(itemIndex, 1);
      setGroupRows(newGroupRows);
    }
  };

  if (refComponent) {
    refComponent.current = {
      replaceValue,
      resetError,
      resetValue,
    };
  }

  return {
    attrValueLength,
    groupRows,
    handleAdd,
    handleRemove,
    setGroupRows,
  };
}
