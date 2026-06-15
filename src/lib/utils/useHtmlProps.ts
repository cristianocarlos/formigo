import {useMemo} from 'react';

import {MASKS} from '@/utils/masks';

import type {TFormigoAttribute, TFormigoLabel} from '@/lib/types/formigo';

type THtmlProps = {
  id: string;
  maxLength?: number;
  name: string;
  placeholder?: string; // Para o html só pode ser string ou undefined
};

type THtmlPropsParams = {
  attribute: TFormigoAttribute;
  label?: TFormigoLabel;
  mask?: string;
  maxLength?: number;
  placeholder?: null | string; // null pq o label pode ser atribuído ao placeholder
};

type TResolvePlaceHolder = {
  label?: TFormigoLabel;
  mask?: string;
  placeholder?: null | string; // null pq o label pode ser atribuído ao placeholder
};

function resolvePlaceholder({label, mask, placeholder}: TResolvePlaceHolder) {
  let resolvedPlaceholder;
  if (placeholder !== null) {
    // null tem relevância aqui, é tratado diferente de undefined
    switch (mask) {
      case MASKS.brPhoneNumber:
        resolvedPlaceholder = placeholder || '__ ____-____';
        break;
      case MASKS.cnpj:
        resolvedPlaceholder = placeholder || '__.___.___/____-__';
        break;
      case MASKS.cpf:
        resolvedPlaceholder = placeholder || '___.___.___-__';
        break;
      case MASKS.currency:
        resolvedPlaceholder = placeholder || '0,00';
        break;
      case MASKS.date:
        resolvedPlaceholder = placeholder || '__/__/_____';
        break;
      case MASKS.dateHour:
        resolvedPlaceholder = placeholder || '__/__/_____ __:__';
        break;
      case MASKS.hour:
        resolvedPlaceholder = placeholder || '__:__';
        break;
      default:
        resolvedPlaceholder = placeholder || (typeof label === 'string' ? label : undefined);
    }
  }
  return resolvedPlaceholder;
}

export function resolveAttributeName(attribute: TFormigoAttribute) {
  if (attribute.length === 1) {
    return attribute[0];
  }
  // replace substitui só a primeira ocorrência de ][
  // a primeira expressão retorna ModelName][prop1][prop2]
  // o replace dexa a string ModelName[prop1][prop2]
  return (attribute.join('][') + ']').replace('][', '[');
}

export default function useHtmlProps(params: THtmlPropsParams) {
  const {attribute, label, mask, maxLength, placeholder} = params;
  return useMemo(() => {
    const htmlProps = {} as THtmlProps;

    // id, name
    htmlProps.id = attribute.join('_');
    htmlProps.name = resolveAttributeName(attribute);

    // label, placeholder
    if (placeholder !== null) {
      // null tem relevância aqui, é tratado diferente de undefined
      htmlProps.placeholder = resolvePlaceholder({label, mask, placeholder});
    }

    // maxLength
    if (maxLength) {
      htmlProps.maxLength = maxLength;
    }

    return htmlProps;
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, []);
}
