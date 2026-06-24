import type {TVerticalClockBookingDataLoad} from '@/lib/types/calendar';
import type {
  TFormigoAttribute,
  TFormigoElementBase1,
  TFormigoElementBase2,
  TFormigoRefComponent,
} from '@/lib/types/formigo';
import type {
  TFormattedDate,
  TFormattedDateHour,
  TInputKeyboardEventHandler,
  TInputOrTextAreaFocusEventHandler,
} from '@/types/common';
import type {ReactElement, RefObject} from 'react';

export type TInputRefHtmlButton = RefObject<HTMLButtonElement | null>;

type TInputRefComponent = TFormigoRefComponent & {
  inputFocus: (focusOptions?: FocusOptions) => void; // Focar no input
  replaceValue: (value?: string) => void;
};

export type THiddenProps<GAttrValue = string | undefined> = {
  attribute: TFormigoAttribute;
  dataType?: 'check-group-descriptions' | 'check-group-values' | 'json-value' | 'suggest-select-option-id'; // quando é necessário identificar otipo de dado que vai no hidden
  disabled?: boolean;
  resolver?: (attrValue?: GAttrValue) => string | undefined; // As vezes é necessário tratar o valor quando usa o draftjs
  value?: string;
};

export type TBaseInputProps = TFormigoElementBase1 &
  TFormigoElementBase2 & {
    autoComplete?: 'new-password' | 'off'; // Atributo autoComplete
    dataType?: 'skip-url-query-string'; // Identificação adicional (ex. skip-url-query-string)
    handleBlur?: (value?: string) => void; // handle adicional
    handleFocus?: TInputOrTextAreaFocusEventHandler; // handle adicional
    iconElement?: ReactElement; // Nome do ícone
    initValue?: string; // Valor inicial
    refComponent?: RefObject<TInputRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
    refHtmlInput?: RefObject<HTMLInputElement | null>; // Expõe o elemento input
  };

export type TTextInputProps = TBaseInputProps & {
  handleKeyDown?: TInputKeyboardEventHandler; // handle adicional
  handleKeyUp?: TInputKeyboardEventHandler; // handle key up (quick search)
};

export type TTextAreaProps = Omit<TBaseInputProps, 'autoComplete' | 'dataType' | 'refHtmlInput'> & {
  refHtmlTextArea?: RefObject<HTMLTextAreaElement | null>; // Expõe o elemento input
};

export type TFloatInputProps = TBaseInputProps & {
  allowNegative?: boolean;
};

export type TIntegerInputProps = TBaseInputProps & {
  allowNegative?: boolean; // Permite números negativos
};

export type TDateInputProps = TBaseInputProps & {
  handlePick?: (value: TFormattedDate) => void; // handle pick adicional
  hasAgeDesc?: boolean; // Se apresenta a descrição da data
  hasPicker?: boolean; // Se tem um picker
  pickerPosition?: 'left' | 'right'; // Posição do picker
  resetValueOnPick?: boolean; // Reseta o valor do campo logo após o pick
};

export type TDateHourInputProps = TBaseInputProps &
  Pick<TDateInputProps, 'hasPicker' | 'pickerPosition' | 'resetValueOnPick'> & {
    bookingDataLoad?: TVerticalClockBookingDataLoad; // Carrega expediente e agendamentos
    handlePick?: (value: TFormattedDateHour) => void; // handle pick adicional
  };

export type TPhoneInputProps = TBaseInputProps & {
  countryDataParams?: {attribute: TFormigoAttribute; xhrUrl: string};
};

export type TZipCodeInputProps = Omit<TBaseInputProps, 'validators'> & {
  handleSearch: (value?: string) => void; // handle search
  handleSearchCancel: () => void; // handle search cancel
};

export type TPasswordInputProps = Omit<TBaseInputProps, 'datatype' | 'printMode'> & {
  allowSavingCredentials?: boolean; // Previne o navegador de salvar login e senha
  hasStrenghtMeter?: boolean; // Se tem medidor de força de senha
};
