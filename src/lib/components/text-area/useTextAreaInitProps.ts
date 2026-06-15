import {useMemo} from 'react';

import {resolvedPadding, resolvedSize, resolveInputStyle} from '@/lib/utils/inlineStyles';
import useHtmlProps from '@/lib/utils/useHtmlProps';

import type {TTextAreaProps} from '@/lib/types/input';
import type {CSSProperties} from 'react';

type TInitProps = {
  inputStyle: CSSProperties;
  prependStyle: CSSProperties;
};

type TUseTextAreaInitProps = Pick<TTextAreaProps, 'attribute' | 'label' | 'maxLength' | 'placeholder'> & {
  hasPrepend?: boolean;
};

export default function useTextAreaInitProps(params: TUseTextAreaInitProps) {
  const {attribute, hasPrepend, label, maxLength, placeholder} = params;

  const htmlProps = useHtmlProps({
    attribute,
    label,
    maxLength,
    placeholder,
  });
  const textAreaInitProps = useMemo(() => {
    const initProps = {} as TInitProps;

    initProps.inputStyle = {
      ...resolveInputStyle(hasPrepend, false),
      paddingBottom: resolvedPadding,
      paddingTop: resolvedPadding,
    };
    initProps.prependStyle = {
      paddingTop: resolvedPadding,
      width: resolvedSize,
    };
    return initProps;
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, []);

  return {...htmlProps, ...textAreaInitProps};
}
