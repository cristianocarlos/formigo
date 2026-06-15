import type {TAddressCountryData} from '@/lib/types/address';
import type {
  TFormigoAttribute,
  TFormigoElementBase1,
  TFormigoElementBase2,
  TFormigoRefComponent,
  TFormigoSanitizedValues,
} from '@/lib/types/formigo';
import type {PHONE_GROUP_ADDITIONAL_INPUT_KEYS} from '@/lib/utils/phoneHelper';
import type {ReactNode, RefObject} from 'react';

export type TInputGroupRefComponent = TFormigoRefComponent & {
  replaceValue: <G>(items?: G) => void;
};

export type TInputGroupValue = Array<NonNullable<TFormigoSanitizedValues>>;

export type TInputGroupChildrenProps = {
  index: number;
  itemAttribute: TFormigoAttribute;
};

export type TInputGroupProps<GItemData = TInputGroupValue[number]> = Omit<
  TFormigoElementBase1,
  'forceValidateOnSubmit' | 'required' | 'validateOnlyOnSubmit' | 'validators'
> & {
  addLimit?: number; // Limite para o botão adicionar
  children: (props: TInputGroupChildrenProps) => ReactNode; // children
  getItemEmptyValue?: () => GItemData; // Valor vazio (também auxiliar pra resetar os erros)
  initValue?: Array<GItemData>; // Valor inicial
  label?: TFormigoElementBase2['label']; // Label
  lockedRowsLength?: number; // Quantidade de linhas fixo
  refComponent?: RefObject<TInputGroupRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
};

export type TPhoneGroupProps = Omit<
  TFormigoElementBase1,
  'forceValidateOnSubmit' | 'validateOnlyOnSubmit' | 'validators'
> & {
  additionalInputs?: Array<(typeof PHONE_GROUP_ADDITIONAL_INPUT_KEYS)[keyof typeof PHONE_GROUP_ADDITIONAL_INPUT_KEYS]>;
  addLimit?: TInputGroupProps['addLimit'];
  countryXhrUrl?: string;
  externalCountryData?: TAddressCountryData; // Para quando há seleção de país fora do componente (ex. endereço)
  label?: TInputGroupProps['label'];
  refComponent?: TInputGroupProps['refComponent'];
};
