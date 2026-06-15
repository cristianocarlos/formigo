import type {TComboBoxProps} from '@/lib/types/comboOrSuggest';
import type {TFormigoElementBase1, TFormigoRefComponent} from '@/lib/types/formigo';
import type {TTextInputProps} from '@/lib/types/input';
import type {ADDRESS_KEYS} from '@/lib/utils/helper';
import type {RefObject} from 'react';

export type TAddressRefComponent = TFormigoRefComponent & {
  replaceValue: (value?: TAddressValue) => void;
};

export type TAddressValue = {
  [ADDRESS_KEYS.city]?: string;
  [ADDRESS_KEYS.cityDesc]?: string;
  [ADDRESS_KEYS.complement]?: string;
  [ADDRESS_KEYS.country]?: string;
  [ADDRESS_KEYS.countryDesc]?: string;
  [ADDRESS_KEYS.line1]?: string;
  [ADDRESS_KEYS.line2]?: string;
  [ADDRESS_KEYS.number]?: string;
  [ADDRESS_KEYS.zipCode]?: string;
};

export type TAddressCountryData = {
  dialing_code?: string;
  id?: string;
  iso2_id?: string;
};

export type TAddressProps = Omit<TFormigoElementBase1, 'validators'> & {
  cityIsSelectedOnly?: TComboBoxProps['isSelectedOnly']; // Se é obrigatório selecionar a cidade da lista
  cityRequired?: TComboBoxProps['required']; // Validator. Em caso de somente a cidade ser obrigatória, não usa o required
  cityXhrUrl: string;
  complementMaxLength?: TTextInputProps['maxLength']; // max length. O complemento pode variar o tamanho máximo
  countryXhrUrl?: string;
  initValue?: TAddressValue;
  refComponent?: RefObject<TAddressRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
  zipCodeXhrUrl: string;
};
