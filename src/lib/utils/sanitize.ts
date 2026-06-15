import {valueAsString} from '@/utils/helper';

import type {TFormigoFormFeatures} from '@/lib/types/formigo';

type TObjectNewPlainValue = string | undefined;
type TObjectNewObjectValue = {[p: string]: unknown};
type TObjectNewArrayValue = Array<TObjectNewObjectValue | TObjectNewPlainValue>;
export type TDeepSanitizedValues = {
  [columnOrPropName: string]:
    | TDeepSanitizedValues
    | TObjectNewArrayValue
    | TObjectNewObjectValue
    | TObjectNewPlainValue;
};

function recursiveSanitizeObjectValues<G = TDeepSanitizedValues>(values?: unknown): G | undefined {
  if (!values) return;
  if (typeof values !== 'object') return valueAsString(values as boolean | number | string);
  const newValues = {} as TDeepSanitizedValues;
  Object.keys(values).forEach((columnOrPropName) => {
    const originalValue = values[columnOrPropName as keyof typeof values];
    if (originalValue === null) {
      newValues[columnOrPropName] = undefined;
    } else if (typeof originalValue === 'boolean') {
      newValues[columnOrPropName] = valueAsString(originalValue);
    } else if (typeof originalValue === 'number') {
      newValues[columnOrPropName] = valueAsString(originalValue);
    } else if (typeof originalValue === 'string') {
      newValues[columnOrPropName] = originalValue;
    } else if (Array.isArray(originalValue)) {
      const newArrayValue = [] as TObjectNewArrayValue;
      // @ts-expect-error não quero lidar com isso
      originalValue.forEach((arrayValue) => {
        if (arrayValue) {
          if (typeof arrayValue === 'boolean') {
            newArrayValue.push(valueAsString(arrayValue));
          } else if (typeof arrayValue === 'number') {
            newArrayValue.push(valueAsString(arrayValue));
          } else if (typeof arrayValue === 'string') {
            newArrayValue.push(arrayValue);
          } else {
            newArrayValue.push(recursiveSanitizeObjectValues(arrayValue));
          }
        }
      });
      newValues[columnOrPropName] = newArrayValue;
    } else if (typeof originalValue === 'object') {
      // @ts-expect-error isDraftJsValue
      const isDraftJsValue = !!(originalValue.blocks && originalValue.entityMap);
      newValues[columnOrPropName] = isDraftJsValue ? originalValue : recursiveSanitizeObjectValues(originalValue);
    } else {
      // undefined
      newValues[columnOrPropName] = originalValue;
    }
  });
  return newValues as G;
}

type TSanitizeOneLevelReturn = {[p: string]: string | undefined};

export function sanitizeOneLevelObject<G = unknown>(param: unknown): G {
  if (!param) return undefined as G;
  const newData = {} as TSanitizeOneLevelReturn;
  Object.keys(param).forEach((columnOrPropName) => {
    // @ts-expect-error sanitizeOneLevelObject
    const originalValue = param[columnOrPropName];
    if (originalValue === null) {
      newData[columnOrPropName] = undefined;
    } else if (typeof originalValue === 'boolean') {
      newData[columnOrPropName] = Number(originalValue).toString();
    } else if (typeof originalValue === 'number') {
      newData[columnOrPropName] = originalValue.toString();
    } else if (typeof originalValue === 'string') {
      newData[columnOrPropName] = originalValue;
    } else {
      // undefined
      newData[columnOrPropName] = originalValue;
    }
  });
  return newData as G;
}

export function sanitizeFormFeaturesValues(values?: TFormigoFormFeatures['values']) {
  const sanitizedAttr = {} as TDeepSanitizedValues;
  values &&
    Object.keys(values).forEach((modelName) => {
      sanitizedAttr[modelName] = recursiveSanitizeObjectValues(values[modelName]);
    });
  return sanitizedAttr;
}
