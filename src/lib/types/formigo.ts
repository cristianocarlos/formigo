import type {MASKS} from '@/utils/masks';
import type {ReactElement} from 'react';

export type TFormigoRefComponent = {
  resetError: () => void; // Resetar erro(s)
  resetValue: () => void; // Resetar valor
};

export type TFormigoElementBase1 = {
  // Todos
  attribute: TFormigoAttribute;
  className?: string; // HTML Atributo class
  disabled?: boolean; // HTML Atributo disabled (não envia o valor)
  forceValidateOnSubmit?: boolean; // Se deve validar mesmo com readOnly ao enviar
  printMode?: boolean; // Não tem no draftjs
  readOnly?: boolean; // HTML Atributo readOnly (com hidden para enviar o valor)
  required?: boolean; // Validator
  validateOnlyOnSubmit?: boolean; // Se deve validar somente ao enviar
  validators?: Array<TFormigoValidatorHandler>; // Validators adicionais
};

export type TFormigoElementBase2 = {
  label?: null | string; // Label
  labelHint?: string; // Label complementar
  maxLength?: number; // Atributo maxLength (ComboOrSuggest: as vezes é necessário usar o que o usuário escreve, sem seleção, então precisa limitar o tamanho. Nunca será o atributo do DB, que é o id. Ex Universidades)
  placeholder?: string; // Atributo placeholder
};

export type TFormigoValidatorBaseCallerProps = {
  attribute: TFormigoAttribute;
};

export type TFormigoSanitizedValues = {[p: string]: Record<string, string | undefined> | string | undefined};

//
export type TFormigoAttribute = Array<string>;
export type TFormigoLabel = null | ReactElement | string;
export type TFormigoMasks = keyof typeof MASKS;
export type TFormigoRequestMethod = 'patch' | 'post' | 'put';
export type TFormigoFormFeatures = {recordId: null | number; values: Record<string, unknown>};
export type TFormigoXhrActions = {
  dataGet: <GContent>(
    url: string,
    signal?: AbortSignal,
    errorType?: 'address' | 'combo-box' | 'screen',
  ) => Promise<GContent>;
  formSubmit: <GContent>(
    formDom: HTMLFormElement,
    signal?: AbortSignal,
  ) => Promise<{content: GContent; message: string; success: boolean}>;
  recordDelete: (url: string) => Promise<boolean>;
};
//
export type TFormigoValidatorGetAttrValue = <G = string>(attribute: TFormigoAttribute) => G | undefined;
export type TFormigoValidatorHandler = (getAttrValue: TFormigoValidatorGetAttrValue) => string | undefined;
//
export type TFormigoInputErrors = Array<string>;
export type TFormigoSubmitErrors = {[attributeDashedKey: string]: Array<string>};
export type TFormigoServerErrors = {[attributeDashedKey: string]: Array<string>};
