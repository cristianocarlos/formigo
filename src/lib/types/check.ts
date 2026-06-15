import type {TFormigoElementBase1, TFormigoLabel, TFormigoRefComponent} from '@/lib/types/formigo';
import type {ReactElement, RefObject} from 'react';

export type TCheckAnyValue = string;
export type TCheckBoolValue = '0' | '1';

type TCheckChangedData = {checkValue: TCheckAnyValue; isChecked: boolean};

type TCheckRefComponent = TFormigoRefComponent & {
  replaceValue: (value: boolean) => void;
};

export type TCheckProps = TFormigoElementBase1 & {
  checkValue?: TCheckAnyValue; // Atributo value
  children: ReactElement;
  handleChange?: (changedData: TCheckChangedData) => void; // handleChange adicional
  initValue?: TCheckAnyValue; // Valor inicial
  label?: TFormigoLabel;
  refComponent?: RefObject<TCheckRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
  uncheckValue?: TCheckAnyValue; // Valor unchecked (para o hidden)
};
