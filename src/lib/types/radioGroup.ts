import type {TFormigoElementBase1, TFormigoRefComponent} from '@/lib/types/formigo';
import type {ReactElement, RefObject} from 'react';

export type TRadioGroupValue = string;

type TRadioGroupRefComponent = TFormigoRefComponent & {
  replaceValue: (value?: TRadioGroupValue) => void;
};

export type TRadioGroupOptionRows = Array<{
  id: number | string;
  label?: ReactElement | string; // Não obrigatório, principalmente com uso do optionLabelFormatter
}>;

export type TRadioGroupProps<GOptionData = TRadioGroupOptionRows[number]> = TFormigoElementBase1 & {
  children?: Array<ReactElement> | ReactElement;
  handleChange?: (value?: TRadioGroupValue) => void; // handleChange adicional
  initValue?: TRadioGroupValue; // Valor inicial
  label?: null | string; // Label
  options: Array<GOptionData>; // Opções
  preventUncheck?: boolean; // Previne que seja desmarcado
  refComponent?: RefObject<TRadioGroupRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
};

export type TRadioGroupDerivableOptionsResolverParams<GOptionData = unknown> = {
  attribute: TFormigoElementBase1['attribute'];
  disabled: TFormigoElementBase1['disabled'];
  isCheckGroup?: boolean;
  options: Array<GOptionData>;
  printMode: TFormigoElementBase1['printMode'];
  refComponent?: TRadioGroupProps['refComponent'];
};
