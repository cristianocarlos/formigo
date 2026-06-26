import {useCallback, useState} from 'react';

import FormElement from '@/lib/components/FormElement';
import SelectionChooser from '@/lib/components/selection/SelectionChooser';
import {SelectionContext} from '@/lib/components/selection/SelectionContext';
import SelectionRows from '@/lib/components/selection/SelectionRows';
import {useStoreFormigoAttrGetValue} from '@/lib/zustand/hooksGetterSlice';
import {useDispatchFormigoAttrSetValue} from '@/lib/zustand/hooksSetterSlice';

import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {TSelectionData} from '@/lib/types/selection';
import type {ReactNode} from 'react';

type TSelectionRows = Array<TSelectionData>;

type TSelectionProps = {
  attribute: TFormigoAttribute;
  children: ReactNode;
  className?: string;
};

Selection.Chooser = SelectionChooser;
Selection.Rows = SelectionRows;

export default function Selection(props: TSelectionProps) {
  const {attribute, children, className = ''} = props;

  const attrGetValue = useStoreFormigoAttrGetValue<TSelectionRows>(attribute);
  const attrSetValue = useDispatchFormigoAttrSetValue<TSelectionRows>(attribute);
  const [rows, setRows] = useState<TSelectionRows | undefined>(() => attrGetValue());

  const handleAdd = useCallback(
    (item: TSelectionData) => {
      const currentRows = attrGetValue() || [];
      const found = currentRows.find((data: TSelectionData) => data.id === item.id);
      if (found) return;
      const newRows = currentRows.concat(item);
      attrSetValue(newRows);
      setRows(attrGetValue());
    },
    [attrGetValue, attrSetValue, setRows],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const currentRows = attrGetValue();
      if (!currentRows) return;
      const newRows = currentRows.slice(); // Clona
      newRows.splice(index, 1);
      attrSetValue(newRows);
      setRows(attrGetValue());
    },
    [attrGetValue, attrSetValue, setRows],
  );

  return (
    <SelectionContext value={{attribute, handleAdd, handleRemove, rows}}>
      <FormElement className={`[&>.formigo--form-element]:mb-0 ${className}`}>{children}</FormElement>
    </SelectionContext>
  );
}
