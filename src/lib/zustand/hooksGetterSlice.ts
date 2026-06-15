import {useCallback, useRef} from 'react';

import {CHECK_BOOL_TRUE} from '@/lib/utils/checkOrRadio';
import {useFormId} from '@/lib/zustand/helper';
import {getArrayLength} from '@/utils/zustand/selectors';

import {useStore} from './store';

import type {TFormigoAttribute} from '@/lib/types/formigo';

/**
 * init: valor inicial, nunca muda
 * Casos de uso:
 * - resetar para o valor inicial
 * - checar se houve mudança
 */

export function useInitFormigoAttrValue<G = string>(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useRef(useStore.getState().dataAttrGetValueIn(attribute, formId)).current as G | undefined;
}

/**
 * selector: monitoramento do valor em tempo real
 */

export function useSelectorFormigoAttrValue<G = string>(attribute: TFormigoAttribute | undefined) {
  const formId = useFormId();
  return useStore((state) => {
    if (!attribute) return;
    return state.dataAttrGetValueIn(attribute, formId) as G | undefined;
  });
}

export function useSelectorFormigoAttrIsChecked(
  attribute: TFormigoAttribute | undefined,
  checkedValue = CHECK_BOOL_TRUE,
) {
  const value = useSelectorFormigoAttrValue(attribute);
  return value === checkedValue;
}

export function useSelectorFormigoHandFillValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataHandFillGetValue(attribute, formId));
}

export function useSelectorFormigoInputReadyValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataInputReadyGetValue(attribute, formId));
}

export function useSelectorFormigoLoadingValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataLoadingGetValue(attribute, formId));
}

/**
 * store: método para obter o valor, não gera rerender
 * Casos de uso:
 * - acessar o valor atual através de um evento (click, fetch, ...)
 */

export function useStoreFormigoAttrGetValue<G = string>(attribute: TFormigoAttribute | undefined) {
  const formId = useFormId();
  return useCallback(() => {
    if (!attribute) return;
    return useStore.getState().dataAttrGetValueIn(attribute, formId) as G | undefined;
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, []);
}

/**
 * helper
 */

export function useSelectorFormigoAttrArrayLength(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => {
    return getArrayLength(state.dataAttrGetValueIn(attribute, formId));
  });
}

export function useSelectorFormigoComboHasEmptyId(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataComboHasEmptyId(attribute, formId));
}

export function useSelectorFormigoFeedback() {
  return useStore((state) => state.data.feedback);
}

export function useSelectorFormigoState() {
  return useStore((state) => state);
}

export const useCustomFormigoState = useStore;
