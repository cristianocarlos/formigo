import {get as esToolkitGet} from 'es-toolkit/compat';

import {useFormigoContextFormId} from '@/lib/utils/withContext';
import {immerMutatorSetValueIn} from '@/utils/immerHelper';

import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {TZustandFormigoFormProxyState} from '@/lib/zustand/types';
import type {TArrayKey, TDottedKey} from '@/types/common';

export function getResolvedDottedKey(keyPath: TArrayKey | TDottedKey, prefixKey?: keyof TZustandFormigoFormProxyState) {
  if (typeof keyPath === 'string') {
    if (prefixKey) return prefixKey + '.' + keyPath;
    return keyPath;
  }
  if (Array.isArray(keyPath)) {
    const dottedKey = keyPath.join('.');
    if (prefixKey) return prefixKey + '.' + dottedKey;
    return dottedKey;
  }
  return keyPath;
}

export function getResolvedAttributeDashedKey(keyPath: TArrayKey) {
  return getResolvedDottedKey(keyPath).replaceAll('.', '__');
}

export function attrValueGetter(prevFormProxyState: TZustandFormigoFormProxyState) {
  return (unresolvedKeyPath: TArrayKey) => {
    return immerAttrGetValueIn(prevFormProxyState, unresolvedKeyPath);
  };
}

export function immerAttrGetValueIn(
  formProxyState: TZustandFormigoFormProxyState,
  attribute: TDottedKey | TFormigoAttribute,
) {
  if (!formProxyState) return;
  return esToolkitGet(formProxyState.attr, attribute);
}

export function immerMutatorAttrSetValueIn<G = string | undefined>(
  formProxyState: TZustandFormigoFormProxyState,
  attribute: TFormigoAttribute,
  value: G,
) {
  if (!formProxyState) return;
  immerMutatorSetValueIn(formProxyState.attr, attribute, value);
}

export function immerMutatorInputReadySetValue(
  formProxyState: TZustandFormigoFormProxyState,
  attribute: TFormigoAttribute,
  value = true,
) {
  const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
  const keyPath = getResolvedDottedKey(attributeDashedKey, 'inputReady');
  immerMutatorSetValueIn(formProxyState, keyPath, value);
}

export function useFormId() {
  const formId = useFormigoContextFormId();
  if (!formId) throw new Error('FormId must be provided');
  return formId;
}

export function resolveAttribute(
  callbackAttribute: null | TFormigoAttribute | undefined,
  hookAttribute: null | TFormigoAttribute | undefined,
) {
  const attribute = callbackAttribute || hookAttribute;
  if (!attribute) throw new Error('attribute must be provided');
  return attribute;
}
