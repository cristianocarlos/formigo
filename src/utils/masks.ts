import {stripNonNumber, strToNumeric, valueAsNumber, valueAsString, zeroFill} from '@/utils/helper';
import {isSafeInteger, isSafeNumeric, isValidPhoneNumber, isValidZipCode} from '@/utils/validators';

import type {TInputBeforeInputEvent} from '@/types/common';

export const MASKS = {
  brPhoneNumber: 'brPhoneNumber',
  cnpj: 'cnpj',
  cpf: 'cpf',
  currency: 'currency',
  date: 'date',
  dateHour: 'dateHour',
  float: 'float',
  hour: 'hour',
  integer: 'integer',
  negativeFloat: 'negativeFloat',
  negativeInteger: 'negativeInteger',
  zipCode: 'zipCode',
} as const;

function getTypedChar(e: TInputBeforeInputEvent) {
  // e.data beforeinput | e.key keypress
  return e.data || e.key; // FIXME: fritar || e.key quando estiver funcionando no Chrome-Android
}

export function formatCnpj(value?: null | number | string) {
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    const resolvedValue = valueAsString(value);
    if (resolvedValue.length <= 14 && resolvedValue.length > 3) {
      const zeroFillValue = zeroFill(resolvedValue, 14);
      return (
        zeroFillValue.substring(0, 2) +
        '.' +
        zeroFillValue.substring(2, 5) +
        '.' +
        zeroFillValue.substring(5, 8) +
        '/' +
        zeroFillValue.substring(8, 12) +
        '-' +
        zeroFillValue.substring(12, 14)
      );
    }
    return resolvedValue;
  }
  return value;
}

export function formatCpf(value?: null | number | string) {
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    const resolvedValue = valueAsString(value);
    if (resolvedValue.length <= 11 && resolvedValue.length > 3) {
      const zeroFillValue = zeroFill(resolvedValue, 11);
      return (
        zeroFillValue.substring(0, 3) +
        '.' +
        zeroFillValue.substring(3, 6) +
        '.' +
        zeroFillValue.substring(6, 9) +
        '-' +
        zeroFillValue.substring(9, 11)
      );
    }
    return resolvedValue;
  }
  return value;
}

export function formatCurrency(value?: null | number | string) {
  // pt_br
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    return formatNumber(value, 2, ',', '.');
  }
  if (typeof value === 'string') {
    const resolvedValue = strToNumeric(value);
    return isSafeNumeric(resolvedValue) ? formatNumber(resolvedValue, 2, ',', '.') : value;
  }
  return value;
}

export function formatFloat(value?: null | number | string) {
  // pt_br
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    const resolvedValue = valueAsString(value);
    return resolvedValue.replace('.', ',');
  }
  return value;
}

function formatNumber(value?: null | number | string, decimals = 2, decPoint = '.', thousandsSep = ',') {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://crestidg.com)
  // +     bugfix by: Benjamin Lupton
  // +     bugfix by: Allan Jensen (http://www.winternet.no)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +     bugfix by: Howard Yeend
  // *     example 1: number_format(1234.5678, 2, '.', '');
  // *     returns 1: 1234.57
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    let resolvedValue = valueAsNumber(value);
    const negativeSignal = resolvedValue < 0 ? '-' : '';
    resolvedValue = valueAsNumber(Math.abs(resolvedValue).toFixed(decimals));
    const integerPart = valueAsString(Math.floor(resolvedValue));
    const separatorEndPos = integerPart.length > 3 ? integerPart.length % 3 : 0;
    return (
      negativeSignal +
      (separatorEndPos ? integerPart.substring(0, separatorEndPos) + thousandsSep : '') +
      integerPart.substring(separatorEndPos).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) +
      (decimals
        ? decPoint +
          Math.abs(resolvedValue - valueAsNumber(integerPart))
            .toFixed(decimals)
            .slice(2)
        : '')
    );
  }
  return value;
}

export function formatPhoneNumber(value?: null | number | string) {
  // pt_br
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (!isSafeInteger(value)) return valueAsString(value);
  const resolvedValue = valueAsString(value);
  if (resolvedValue.length === 10) {
    return resolvedValue.substring(0, 2) + ' ' + resolvedValue.substring(2, 6) + '-' + resolvedValue.substring(6, 10);
  }
  if (resolvedValue.length === 11) {
    return resolvedValue.substring(0, 2) + ' ' + resolvedValue.substring(2, 7) + '-' + resolvedValue.substring(7, 11);
  }
  if (resolvedValue.length === 12) {
    return (
      '+' +
      resolvedValue.substring(0, 2) +
      ' ' +
      resolvedValue.substring(2, 4) +
      ' ' +
      resolvedValue.substring(4, 8) +
      '-' +
      resolvedValue.substring(8, 12)
    );
  }
  if (resolvedValue.length === 13) {
    return (
      '+' +
      resolvedValue.substring(0, 2) +
      ' ' +
      resolvedValue.substring(2, 4) +
      ' ' +
      resolvedValue.substring(4, 9) +
      '-' +
      resolvedValue.substring(9, 13)
    );
  }
  return resolvedValue;
}

export function formatZipCode(value?: null | number | string) {
  // pt_br
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  const resolvedValue = stripNonNumber(value);
  if (isSafeInteger(resolvedValue)) {
    const stringValue = valueAsString(resolvedValue);
    if (stringValue.length <= 8 && stringValue.length > 3) {
      const zeroFillValue = zeroFill(stringValue, 8);
      return zeroFillValue.substring(0, 5) + '-' + zeroFillValue.substring(5, 8);
    }
    return stringValue;
  }
  return value.toString();
}

export function getPasteFn(mask?: keyof typeof MASKS) {
  if (!mask) return;
  const pasteFn = {
    brPhoneNumber: (value: string) => {
      if (!value) return '';
      const cleanValue = stripNonNumber(value);
      return isValidPhoneNumber(cleanValue) ? cleanValue : '';
    },
    zipCode: (value: string) => {
      if (!value) return '';
      const cleanValue = stripNonNumber(value);
      return isValidZipCode(cleanValue) ? cleanValue : '';
    },
  };
  return pasteFn[mask as keyof typeof pasteFn];
}

export function getMaskFn(mask?: keyof typeof MASKS) {
  if (!mask) return;
  const masksFn = {
    brPhoneNumber: (e: TInputBeforeInputEvent, value: string) => {
      if (isSafeNumeric(getTypedChar(e))) {
        if (value) {
          let maskedValue = value;
          if (maskedValue.length === 2) {
            maskedValue += ' ';
          } else if (maskedValue.length === 7) {
            maskedValue += '-';
          } else if (maskedValue.length === 12) {
            const numericValue = stripNonNumber(maskedValue);
            maskedValue =
              numericValue.substring(0, 2) + ' ' + numericValue.substring(2, 7) + '-' + numericValue.substring(7, 11);
          }
          if (maskedValue !== value) {
            return maskedValue;
          }
        }
      } else {
        e.preventDefault();
      }
      return value;
    },
    cnpj: (e: TInputBeforeInputEvent, value: string) => {
      if (isSafeNumeric(getTypedChar(e))) {
        if (value) {
          let maskedValue = value;
          if (maskedValue.length === 2 || maskedValue.length === 6) {
            maskedValue += '.';
          } else if (maskedValue.length === 10) {
            maskedValue += '/';
          } else if (maskedValue.length === 15) {
            maskedValue += '-';
          }
          if (maskedValue !== value) {
            return maskedValue;
          }
        }
      } else {
        e.preventDefault();
      }
      return value;
    },
    cpf: (e: TInputBeforeInputEvent, value: string) => {
      if (isSafeNumeric(getTypedChar(e))) {
        if (value) {
          let maskedValue = value;
          if (maskedValue.length === 3 || maskedValue.length === 7) {
            maskedValue += '.';
          } else if (maskedValue.length === 11) {
            maskedValue += '-';
          }
          if (maskedValue !== value) {
            return maskedValue;
          }
        }
      } else {
        e.preventDefault();
      }
      return value;
    },
    currency: (e: TInputBeforeInputEvent) => {
      const typedChar = getTypedChar(e);
      if (!(isSafeNumeric(typedChar) || typedChar === ',' || typedChar === '.')) {
        e.preventDefault();
      }
    },
    date: (e: TInputBeforeInputEvent, value: string) => {
      if (isSafeNumeric(getTypedChar(e))) {
        if (value) {
          let maskedValue = value;
          if (maskedValue.length === 2 || maskedValue.length === 5) {
            maskedValue += '/';
          }
          if (maskedValue !== value) {
            return maskedValue;
          }
        }
      } else {
        e.preventDefault();
      }
      return value;
    },
    dateHour: (e: TInputBeforeInputEvent, value: string) => {
      if (isSafeNumeric(getTypedChar(e))) {
        if (value) {
          let maskedValue = value;
          if (maskedValue.length === 2 || maskedValue.length === 5) {
            maskedValue += '/';
          } else if (maskedValue.length === 10) {
            maskedValue += ' ';
          } else if (maskedValue.length === 13) {
            maskedValue += ':';
          }
          if (maskedValue !== value) {
            return maskedValue;
          }
        }
      } else {
        e.preventDefault();
      }
      return value;
    },
    float: (e: TInputBeforeInputEvent) => {
      const typedChar = getTypedChar(e);
      if (!(isSafeNumeric(typedChar) || typedChar === ',')) {
        e.preventDefault();
      }
    },
    hour: (e: TInputBeforeInputEvent, value: string) => {
      if (isSafeNumeric(getTypedChar(e))) {
        if (value) {
          let maskedValue = value;
          if (maskedValue.length === 1 && valueAsNumber(maskedValue) > 2) {
            maskedValue = '0' + maskedValue + ':';
          } else if (maskedValue.length === 2) {
            maskedValue += ':';
          }
          if (maskedValue !== value) {
            return maskedValue;
          }
        }
      } else {
        e.preventDefault();
      }
      return value;
    },
    integer: (e: TInputBeforeInputEvent) => {
      if (!isSafeNumeric(getTypedChar(e))) {
        e.preventDefault();
      }
    },
    negativeFloat: (e: TInputBeforeInputEvent) => {
      const typedChar = getTypedChar(e);
      if (!(isSafeNumeric(typedChar) || typedChar === ',' || typedChar === '-')) {
        e.preventDefault();
      }
    },
    negativeInteger: (e: TInputBeforeInputEvent) => {
      const typedChar = getTypedChar(e);
      if (!(isSafeNumeric(typedChar) || typedChar === '-')) {
        e.preventDefault();
      }
    },
    zipCode: (e: TInputBeforeInputEvent, value: string) => {
      if (isSafeNumeric(getTypedChar(e))) {
        if (value) {
          let maskedValue = value;
          if (maskedValue.length === 5) {
            maskedValue += '-';
          }
          if (maskedValue !== value) {
            return maskedValue;
          }
        }
      } else {
        e.preventDefault();
      }
      return value;
    },
  };
  return masksFn[mask];
}
