import {hasValue} from '@/utils/helper';

import type {TQueryStringData, TQueryStringValue} from '@/types/common';

export function queryStringStringify(obj: TQueryStringData, shouldRemoveUndefined = false) {
  const urlSearchRecord = resolveQueryStringRecord(obj, shouldRemoveUndefined);
  // toString no createSearchParams transforma tudo em strings, inclusive palavras chave como 'null' e 'undefined'
  // o urlSearchRecord contém esses valores convertidos para vazio
  if (!urlSearchRecord) return '';
  return '?' + new URLSearchParams(urlSearchRecord).toString();
}

function resolveQueryStringValue(value: TQueryStringValue, shouldRemoveUndefined = false) {
  if (typeof value === 'undefined' && shouldRemoveUndefined) return; // Quando nao for pra remover, o undefined é convertido pra string vazia
  return hasValue(value) ? value.toString() : '';
}

function resolveQueryStringRecord(obj: TQueryStringData, shouldRemoveUndefined?: boolean) {
  const objectKeys = Object.keys(obj);
  if (objectKeys.length === 0) return;
  const urlSearchRecord: {[key: string]: string} = {};
  objectKeys.forEach((itemKey) => {
    const resolvedValue = resolveQueryStringValue(obj[itemKey], shouldRemoveUndefined);
    if (typeof resolvedValue !== 'undefined') {
      urlSearchRecord[itemKey] = resolvedValue;
    }
  });
  if (Object.keys(urlSearchRecord).length === 0) return;
  return urlSearchRecord;
}
