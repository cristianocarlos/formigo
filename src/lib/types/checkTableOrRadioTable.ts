import type {TFormigoElementBase1, TFormigoRefComponent} from '@/lib/types/formigo';
import type {RefObject} from 'react';

export type TCheckTableOrRadioTableValue = string;

export type TCheckTableValues = {[rowId: string]: {[colId: string]: TCheckTableOrRadioTableValue}};
export type TRadioTableValues = {[rowId: string]: TCheckTableOrRadioTableValue};

export type TCheckTableRefComponent = TFormigoRefComponent & {
  replaceValue: (value?: TCheckTableValues) => void;
};

export type TRadioTableRefComponent = TFormigoRefComponent & {
  replaceValue: (value?: TRadioTableValues) => void;
};

type TCheckTableOrRadioTableColOrRowsData = {
  complementary_label: null | string;
  complementary_type_id: null | number;
  has_complementary: boolean | null;
  id: number;
  is_exclusive: boolean | null;
  label: string;
};

type TCheckTableOrRadioTableCols = Array<TCheckTableOrRadioTableColOrRowsData>;
export type TCheckTableOrRadioTableRows = Array<TCheckTableOrRadioTableColOrRowsData>;

type TCheckTableOrRadioTableBase = TFormigoElementBase1 & {
  cols: TCheckTableOrRadioTableCols;
  initValue?: string; // Valor inicial
  label?: null | string; // Label
  rows: TCheckTableOrRadioTableRows;
};

export type TCheckTableProps = TCheckTableOrRadioTableBase & {
  handleChange?: (data: {
    checkedValues?: TCheckTableValues;
    checkValue?: string;
    colId: string;
    isChecked: boolean;
    rowId: string;
  }) => void; // handleChange adicional
  refComponent?: RefObject<TCheckTableRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
};

export type TRadioTableProps = TCheckTableOrRadioTableBase & {
  colsUnique?: boolean; // Validator não pode selecionar mais de uma linha na mesma coluna
  handleChange?: (data: {colValue?: string; rowId: string}) => void; // handleChange adicional
  refComponent?: RefObject<TRadioTableRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
  rowsComplete?: boolean; // Validator todas as linhas precisam ter uma coluna marcada
};
