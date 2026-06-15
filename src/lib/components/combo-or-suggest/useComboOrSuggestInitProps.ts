import {useMemo} from 'react';

import {resolvedPadding, resolvedSize, resolveInputStyle} from '@/lib/utils/inlineStyles';
import useHtmlProps, {resolveAttributeName} from '@/lib/utils/useHtmlProps';

import {COMBO_OR_SUGGEST_ATTRIBUTE_KEYS} from './attributesHelper';

import type {TComboOrSuggestAuxAttributes, TComboOrSuggestBase} from '@/lib/types/comboOrSuggest';
import type {CSSProperties} from 'react';

type TInitProps = {
  appendStyle: CSSProperties;
  arrowStyle: CSSProperties;
  descriptionName: string;
  inputStyle: CSSProperties;
  screenIdStyle: CSSProperties;
};

type TUseComboOrSuggestInitProps = Pick<TComboOrSuggestBase, 'attribute' | 'label' | 'maxLength' | 'placeholder'> & {
  auxAttributes: TComboOrSuggestAuxAttributes;
  hasPrepend?: boolean;
};

export default function useComboOrSuggestInitProps(params: TUseComboOrSuggestInitProps) {
  const {attribute, auxAttributes, hasPrepend, label, maxLength, placeholder} = params;

  const htmlProps = useHtmlProps({
    attribute,
    label,
    maxLength,
    placeholder,
  });
  const comboBoxInitProps = useMemo(() => {
    const initProps = {} as TInitProps;
    //
    initProps.descriptionName = resolveAttributeName(auxAttributes[COMBO_OR_SUGGEST_ATTRIBUTE_KEYS.comboOptionLabel]);
    //
    const appendSize = resolvedSize + 8;
    initProps.inputStyle = {
      ...resolveInputStyle(hasPrepend, true),
      paddingRight: appendSize,
    };
    initProps.appendStyle = {
      width: appendSize,
    };
    initProps.arrowStyle = {
      marginRight: resolvedPadding - 4,
    };
    initProps.screenIdStyle = {
      right: appendSize - 1,
    };
    return initProps;
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, []);

  return {...htmlProps, ...comboBoxInitProps};
}
