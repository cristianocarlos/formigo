const DBL_CLICK_TIMEOUT_DATA: {count: number; id: number | undefined} = {
  count: 0,
  id: undefined,
};

/**
 * Remove todos as duplicidades de um array
 * @example
 *  // yields ["apple", "banana", "orange"]
 *  arrayRemoveEmpty(["apple", "banana", "banana", "orange"])
 */
export function arrayRemoveDuplicates<G>(arrayValue: Array<G>) {
  // return [...new Set(array)]; // Por benchmark, filter no nosso caso é mais rapido
  return arrayValue.filter((value, index) => {
    return arrayValue.indexOf(value) === index;
  });
}

/**
 * Este método assume que a string fornecida representa uma data no formato 'DDMMYYYY'.
 * @returns A data formatada no formato 'DD/MM/YYYY' se a entrada for válida, caso contrário, null.
 */
export function guessFormattedDate(value: string) {
  // pt_br
  const strippedValue = stripNonNumber(value);
  if (strippedValue.length !== 8) return null;
  return strippedValue.substring(0, 2) + '/' + strippedValue.substring(2, 4) + '/' + strippedValue.substring(4, 8);
}

/**
 * Este método assume que a string fornecida representa uma data e hora no formato 'DDMMYYYYHHMM'.
 * @returns A data e hora formatadas no formato 'DD/MM/YYYY HH:MM' se a entrada for válida, caso contrário, null.
 */
export function guessFormattedDateHour(value: string) {
  // pt_br
  const strippedValue = stripNonNumber(value);
  if (strippedValue.length !== 12) return;
  return (
    strippedValue.substring(0, 2) +
    '/' +
    strippedValue.substring(2, 4) +
    '/' +
    strippedValue.substring(4, 8) +
    ' ' +
    strippedValue.substring(8, 10) +
    ':' +
    strippedValue.substring(10, 12)
  );
}

export function handleDoubleClick(dblClickCallback: () => void, singleClickCallback?: () => void, delay = 400) {
  DBL_CLICK_TIMEOUT_DATA.count++;
  if (DBL_CLICK_TIMEOUT_DATA.count === 1) {
    DBL_CLICK_TIMEOUT_DATA.id = window.setTimeout(() => {
      DBL_CLICK_TIMEOUT_DATA.count = 0;
      if (singleClickCallback) {
        singleClickCallback.call(undefined);
      }
    }, delay);
  } else if (DBL_CLICK_TIMEOUT_DATA.count === 2) {
    window.clearTimeout(DBL_CLICK_TIMEOUT_DATA.id);
    DBL_CLICK_TIMEOUT_DATA.count = 0;
    dblClickCallback.call(undefined);
  }
}

/**
 * Retorna verdadeiro se o valor passado não for undefined, null e nem uma string vazia.
 * Essa funcao não tem suporte para Arrays e objetos e retornara true indenpendente do valor.
 */
export function hasValue<G>(value: G): value is NonNullable<G> {
  if (typeof value === 'undefined') return false;
  if (value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

export function isTypeOfSafeNumber(value: number) {
  // Previne as cagalhada do tipo 1e+24 (ultrapassa maximo) -7.7e+76 (ultrapassa mínimo)
  // Para ve-los impresso: value.toLocaleString('fullwide', {useGrouping: false})
  return value <= Number.MAX_SAFE_INTEGER && value >= Number.MIN_SAFE_INTEGER;
}

export function jsonParse<G>(value: null | string | undefined) {
  if (!value) return;
  try {
    const parsedValue = JSON.parse(value); // number | string | boolean | null | object
    if (parsedValue && typeof parsedValue === 'object') {
      return parsedValue as G;
    }
    return;
  } catch (_e) {
    return;
  }
}

export function stripNonNumber(value?: number | string) {
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (Number.isNaN(value)) return '';
  let resolvedValue;
  if (typeof value === 'number') {
    resolvedValue = isTypeOfSafeNumber(value)
      ? valueAsString(value)
      : value.toLocaleString('fullwide', {useGrouping: false});
  } else {
    resolvedValue = value;
  }
  return resolvedValue.replace(/\D/g, '');
}

export function strToNumeric<G extends number | string | undefined>(value: G) {
  // pt_br
  if (typeof value !== 'string') return value;
  return value.replaceAll('.', '').replace(',', '.');
}

export function uniqueId(length = 16) {
  const startPosition = 2;
  const endPosition = startPosition + length;
  return Math.random().toString(20).substring(startPosition, endPosition);
}

/*
 * Maluquisse condicional em vez de usar overload, só por diversão
 */
export function valueAsNumber<
  P extends boolean | null | number | string | undefined,
  R = P extends boolean | number | string ? number : undefined,
>(value: P) {
  if (typeof value === 'number') {
    return value as R;
  }
  if (!value) return undefined as R;
  return Number(value) as R;
}

/*
 * Maluquisse condicional em vez de usar overload, só por diversão
 */
export function valueAsString<
  P extends boolean | FormDataEntryValue | null | number | string | undefined,
  R = P extends boolean | FormDataEntryValue | number | string ? string : undefined,
>(value: P) {
  if (typeof value === 'string') return value as R;
  if (value === false) return '0' as R;
  if (value === 0) return '0' as R;
  if (!value) return undefined as R;
  if (value === true) return '1' as R;
  return value.toString() as R;
}

export function zeroFill(value: number | string, length: number) {
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (typeof value === 'number') return value.toString().padStart(length, '0');
  return value.padStart(length, '0');
}
