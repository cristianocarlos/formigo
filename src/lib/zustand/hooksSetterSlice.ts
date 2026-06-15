import {useCallback} from 'react';

import {resolveAttribute, useFormId} from '@/lib/zustand/helper';

import {useStore} from './store';

import type {TFormigoAttribute, TFormigoMasks} from '@/lib/types/formigo';
import type {
  TZustandFormigoInputPrepareInitValue,
  TZustandFormigoProduceFormStateCallback,
  TZustandFormigoProduceStoreStateCallback,
} from '@/lib/zustand/types';

type TSetValue<G> = (newValue: G | undefined, cAttribute?: undefined) => void;
type TAttributeSetValue<G> = (newValue: G | undefined, cAttribute: TFormigoAttribute) => void;
//
type TArrayRemoveItem = (index: number, cAttribute?: undefined) => void;
type TAttributeArrayRemoveItem = (index: number, cAttribute: TFormigoAttribute) => void;
//
type TArrayAddItem<G> = (itemValue: G, cAttribute?: undefined) => void;
type TAttributeArrayAddItem<G> = (itemValue: G, cAttribute: TFormigoAttribute) => void;
//
type TObjectMergeValue<G> = (mergeableData: G, cAttribute?: undefined) => void;
type TAttributeObjectMergeValue<G> = (mergeableData: G, cAttribute: TFormigoAttribute) => void;

export function useDispatchFormigoAttrArrayAddItem<G>(attribute: TFormigoAttribute | undefined): TArrayAddItem<G>; // attribute pode ser undefined, não opcional
export function useDispatchFormigoAttrArrayAddItem<G>(attribute: null): TAttributeArrayAddItem<G>;
export function useDispatchFormigoAttrArrayAddItem<G>(attribute: null | TFormigoAttribute | undefined) {
  const formId = useFormId();
  const fn = useStore((state) => state.dataAttrArrayAddItem<G>);
  return useCallback(
    (value: G, cAttribute?: null | TFormigoAttribute) => {
      fn(value, resolveAttribute(cAttribute, attribute), formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoAttrArrayRemoveItem(attribute: TFormigoAttribute | undefined): TArrayRemoveItem; // attribute pode ser undefined, não opcional
export function useDispatchFormigoAttrArrayRemoveItem(attribute: null): TAttributeArrayRemoveItem;
export function useDispatchFormigoAttrArrayRemoveItem(attribute: null | TFormigoAttribute | undefined) {
  const formId = useFormId();
  const fn = useStore((state) => state.dataAttrArrayRemoveItem);
  return useCallback(
    (index: number, cAttribute?: null | TFormigoAttribute) => {
      fn(index, resolveAttribute(cAttribute, attribute), formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoAttrObjectMergeValue<G>(
  attribute: TFormigoAttribute | undefined,
): TObjectMergeValue<G>; // attribute pode ser undefined, não opcional
export function useDispatchFormigoAttrObjectMergeValue<G>(attribute: null): TAttributeObjectMergeValue<G>;
export function useDispatchFormigoAttrObjectMergeValue<G>(attribute: null | TFormigoAttribute | undefined) {
  const formId = useFormId();
  const fn = useStore((state) => state.dataAttrObjectMergeValue<G>);
  return useCallback(
    (value: G, cAttribute?: null | TFormigoAttribute) => {
      fn(value, resolveAttribute(cAttribute, attribute), formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoAttrSetValue<G = string>(attribute: TFormigoAttribute | undefined): TSetValue<G>; // attribute pode ser undefined, não opcional
export function useDispatchFormigoAttrSetValue<G = string>(attribute: null): TAttributeSetValue<G>;
export function useDispatchFormigoAttrSetValue<G = string>(attribute: null | TFormigoAttribute | undefined) {
  const formId = useFormId();
  const fn = useStore((state) => state.dataAttrSetValueIn<G | undefined>);
  return useCallback(
    (value: G | undefined, cAttribute?: null | TFormigoAttribute) => {
      fn(value, resolveAttribute(cAttribute, attribute), formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoInputMask(attribute: TFormigoAttribute) {
  const formId = useFormId();
  const fn = useStore((state) => state.inputMask);
  return useCallback(
    (mask: TFormigoMasks) => {
      fn(attribute, mask, formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoInputPrepare(attribute: TFormigoAttribute) {
  const formId = useFormId();
  const fn = useStore((state) => state.inputPrepare);
  return useCallback(
    (initValue?: TZustandFormigoInputPrepareInitValue, mask?: TFormigoMasks) => {
      fn(attribute, initValue, mask, formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoHandFillSetValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  const fn = useStore((state) => state.dataHandFillSetValue);
  return useCallback(
    (newValue: string | undefined) => {
      fn(newValue, attribute, formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoLoadingSetValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  const fn = useStore((state) => state.dataLoadingSetValue);
  return useCallback(
    (newValue: boolean) => {
      fn(newValue, attribute, formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoProduceFormState() {
  const formId = useFormId();
  const fn = useStore((state) => state.produceFormState);
  return useCallback(
    (cb: TZustandFormigoProduceFormStateCallback) => {
      fn(cb, formId);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}

export function useDispatchFormigoProduceStoreState() {
  const fn = useStore((state) => state.produceStoreState);
  return useCallback(
    (cb: TZustandFormigoProduceStoreStateCallback) => {
      fn(cb);
    },
    [], // eslint-disable-line @eslint-react/exhaustive-deps
  );
}
