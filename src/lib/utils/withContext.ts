import {createContext, use} from 'react';

import type {TFormigoFormFeatures, TFormigoXhrActions} from '@/lib/types/formigo';

export type TFormigoContext = {
  formAction?: string;
  formId: string;
  recordId?: TFormigoFormFeatures['recordId'];
  recordValues?: TFormigoFormFeatures['values'];
  xhrActions: TFormigoXhrActions;
};

export const FormigoContext = createContext<TFormigoContext | undefined>(undefined);

export function useFormigoContext() {
  const context = use(FormigoContext);
  if (!context) {
    throw Error('FormigoContext must be used within a Component(Form)');
  }
  return context;
}

function useFormigoContextRecordId() {
  return useFormigoContext().recordId;
}

export function useFormigoContextFormId() {
  return useFormigoContext().formId;
}

export function useFormigoContextIsNewRecord() {
  return !useFormigoContextRecordId();
}

export function useFormigoContextModelValues<G>(modelName?: string) {
  const recordValues = useFormigoContext().recordValues;
  if (!recordValues) {
    throw new Error(`formFeatures.values must be setted`);
  }
  if (!modelName) return recordValues as G;
  const modelValues = recordValues[modelName];
  if (!modelValues) {
    throw new Error(`formFeatures.values[${modelName}] must be setted`);
  }
  return modelValues as G;
}
