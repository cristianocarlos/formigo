import {get as esToolkitGet, setWith as esToolkitSetWith} from 'es-toolkit/compat';
import {produce as immerProduce} from 'immer';

import {arrayRemoveDuplicates} from '@/utils/helper';

import type {TArrayKey, TDottedKey} from '@/types/common';
import type {TImmerDraft} from '@/types/thirdParty';

export function immerProduceState<G>(state: G, cb: (proxyState: TImmerDraft<G>) => void) {
  return immerProduce(state, cb);
}

export function immerGetValueIn<G>(proxyState: TImmerDraft<G>, keyPath: TArrayKey | TDottedKey) {
  return esToolkitGet(proxyState, keyPath);
}

export function immerMutatorSetValueIn<G>(proxyState: TImmerDraft<G>, keyPath: TArrayKey | TDottedKey, value: unknown) {
  esToolkitSetWith(proxyState as NonNullable<unknown>, keyPath, value, Object);
}

/**
 * array
 */

export function immerMutatorArrayAddItemAtEnd<G>(
  proxyState: TImmerDraft<G>,
  keyPath: TArrayKey | TDottedKey,
  itemValue: unknown,
) {
  const newItems = immerGetValueIn(proxyState, keyPath) || [];
  newItems.push(itemValue);
  immerMutatorSetValueIn(proxyState, keyPath, arrayRemoveDuplicates(newItems));
}

export function immerMutatorArrayRemoveItem<G>(
  proxyState: TImmerDraft<G>,
  keyPath: TArrayKey | TDottedKey,
  index: number,
) {
  // delete immerGetValueIn(proxyState, keyPath)[index]; // delete mantem o registro vazio :(
  immerGetValueIn(proxyState, keyPath).splice(index, 1);
}

/**
 * object
 */

export function immerMutatorObjectMergeValue<GImmerDraft, GMergeableData>(
  proxyState: TImmerDraft<GImmerDraft>,
  keyPath: TArrayKey | TDottedKey,
  mergeableData: GMergeableData,
) {
  if (keyPath.length === 0) {
    Object.assign(proxyState as NonNullable<unknown>, mergeableData);
  } else {
    const currentData = immerGetValueIn(proxyState, keyPath); // Não precisa do || {} quando é objeto se resolve sozinho
    immerMutatorSetValueIn(proxyState, keyPath, {...currentData, ...mergeableData});
  }
}
