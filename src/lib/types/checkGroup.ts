import type {TFormigoElementBase1, TFormigoRefComponent} from '@/lib/types/formigo';
import type {ReactElement, RefObject} from 'react';

export type TCheckGroupCheckValue = string;

export type TCheckGroupValue = Record<string, TCheckGroupCheckValue>; // {"1": "1", "2": "2"}

export type TCheckGroupRefComponent = TFormigoRefComponent & {
  changeState: (checkValue: TCheckGroupCheckValue, isChecked: boolean) => void; // Marcar/desmarcar item
  checkAll: () => void; // Marcar todos
  replaceValue: (value?: TCheckGroupValue) => void;
};

export type TCheckGroupRefObject = RefObject<TCheckGroupRefComponent | undefined>;

export type TCheckGroupOptionRows = Array<{
  id: number | string;
  label?: ReactElement | string; // Não obrigatório, principalmente com uso do optionLabelFormatter
}>;

export type TCheckGroupProps<GOptionData = TCheckGroupOptionRows[number]> = TFormigoElementBase1 & {
  children?: Array<ReactElement> | ReactElement;
  handleChange?: (changedData: {
    checkedValues?: TCheckGroupValue;
    checkValue: TCheckGroupCheckValue;
    isChecked: boolean;
  }) => void; // handleChange adicional
  initValue?: TCheckGroupValue; // Valor inicial
  label?: null | string; // Label
  maxSize?: number; // Validator
  minSize?: number; // Validator
  options: Array<GOptionData>; // Opções
  refComponent?: TCheckGroupRefObject; // Expõe algumas funções do componente para uso externo
};

export type TCheckGroupDerivableOptionsResolverParams<GOptionData = unknown> = {
  attribute: TFormigoElementBase1['attribute'];
  disabled: TFormigoElementBase1['disabled'];
  isCheckGroup?: boolean;
  options: Array<GOptionData>;
  printMode: TFormigoElementBase1['printMode'];
  refComponent?: TCheckGroupRefObject;
};
