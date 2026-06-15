import type {TCheckGroupValue} from '@/lib/types/checkGroup';
import type {
  TFormigoAttribute,
  TFormigoInputErrors,
  TFormigoMasks,
  TFormigoServerErrors,
  TFormigoSubmitErrors,
  TFormigoValidatorHandler,
} from '@/lib/types/formigo';
import type {TImmerDraft} from '@/types/thirdParty';
import type {TZustandCommonState} from '@/utils/zustand/types';

export type TZustandFormigoInputPrepareInitValue = string | TCheckGroupValue;

export type TZustandFormigoFormProxyState = TImmerDraft<TZustandFormigoForms[string]>;

export type TZustandFormigoProduceStateActions = {
  attrGetValueIn: <G = string>(
    formProxyState: TZustandFormigoFormProxyState,
    attribute: TFormigoAttribute,
  ) => G | undefined;
  mutatorAttrSetValueIn: <G = string>(
    formProxyState: TZustandFormigoFormProxyState,
    attribute: TFormigoAttribute,
    value: G | undefined,
  ) => void;
  mutatorInputReadySetValue: (
    formProxyState: TZustandFormigoFormProxyState,
    attribute: TFormigoAttribute,
    value: boolean,
  ) => void;
};

export type TZustandFormigoProduceFormStateCallback = (
  formProxyState: TZustandFormigoFormProxyState,
  actions: TZustandFormigoProduceStateActions,
) => void;

export type TZustandFormigoProduceStoreStateCallback = (
  proxyState: TZustandFormigoForms,
  actions: TZustandFormigoProduceStateActions,
) => void;

export type TZustandFormigoGetterState = {
  dataAttrGetValueIn: <G = string>(attribute: TFormigoAttribute, formId: string) => G | undefined;
  dataComboHasEmptyId: (attribute: TFormigoAttribute, formId: string) => boolean;
  dataHandFillGetValue: (attribute: TFormigoAttribute, formId: string) => string | undefined;
  dataInputReadyGetValue: (attribute: TFormigoAttribute, formId: string) => unknown;
  dataLoadingGetValue: (attribute: TFormigoAttribute, formId: string) => boolean;
};

export type TZustandFormigoSetterState = {
  dataAttrArrayAddItem: <G>(itemValue: G, attribute: TFormigoAttribute, formId: string) => void;
  dataAttrArrayRemoveItem: (index: number, attribute: TFormigoAttribute, formId: string) => void;
  dataAttrObjectMergeValue: <G>(mergeableData: G, attribute: TFormigoAttribute, formId: string) => void;
  dataAttrSetValueIn: <G>(value: G, attribute: TFormigoAttribute, formId: string) => void;
  dataHandFillSetValue: (value: string | undefined, attribute: TFormigoAttribute, formId: string) => void;
  dataLoadingSetValue: (value: boolean, attribute: TFormigoAttribute, formId: string) => void;
  inputMask: (attribute: TFormigoAttribute, mask: TFormigoMasks, formId: string) => void;
  inputPrepare: (
    attribute: TFormigoAttribute,
    initValue: TZustandFormigoInputPrepareInitValue | undefined,
    mask: TFormigoMasks | undefined,
    formId: string,
  ) => void;
  produceFormState: (cb: TZustandFormigoProduceFormStateCallback, formId: string) => void;
  produceStoreState: (cb: TZustandFormigoProduceStoreStateCallback) => void;
};

export type TZustandFormigoValidatorState = {
  dataValidatorAwarnessErrorsGetValue: (attribute: TFormigoAttribute, formId: string) => unknown;
  dataValidatorHasMessage: (formId: string) => boolean;
  dataValidatorInputErrorsGetValue: (attribute: TFormigoAttribute, formId: string) => TFormigoInputErrors;
  dataValidatorSubmitErrorsGetValue: (formId: string) => TFormigoSubmitErrors | undefined;
  inputAddValidator: (handler: TFormigoValidatorHandler, attribute: TFormigoAttribute, formId: string) => unknown;
  inputResetErrors: (attribute: TFormigoAttribute, formId: string) => void;
  inputResetValidators: (attribute: TFormigoAttribute, formId: string) => void;
  inputSetServerErrors: (errors: {[dottedColumnId: string]: Array<string>}, formId: string) => void;
  inputValidate: (attribute: TFormigoAttribute, formId: string) => void;
  submitValidate: (formId: string) => void;
};

export type TZustandFormigoForms = Record<string, TZustandFormigoStateData>;

export type TZustandFormigoStateData = {
  attr: Record<string, unknown>; // valores de cada atributo
  awarnessErrors?: {[attributeDashedKey: string]: unknown};
  feedback?: {message: string; success: boolean};
  handFill?: {[attributeDashedKey: string]: string | undefined}; // para determininar que algo foi preenchido automáticamente (resultado de endereço)
  inputErrors?: {[attributeDashedKey: string]: TFormigoInputErrors};
  inputReady?: {[attributeDashedKey: string]: boolean}; // para determinar que o campo está pronto pra carregar (após setagem de initValue e mask)
  loading?: {[attributeDashedKey: string]: boolean}; // para determininar que algo está sendo processado no campo (suggests e busca de endereço)
  recordId?: number;
  serverErrors?: TFormigoServerErrors;
  submitErrors?: TFormigoSubmitErrors;
  submitErrorsId?: string;
  validators?: {[attributeDashedKey: string]: Array<TFormigoValidatorHandler>}; // Validações convencionais, blur, submit
};

export type TZustandFormigoState = {
  data: TZustandFormigoForms;
} & TZustandCommonState &
  TZustandFormigoGetterState &
  TZustandFormigoSetterState &
  TZustandFormigoValidatorState;
