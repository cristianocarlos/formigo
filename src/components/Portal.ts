import {useState} from 'react';
import {createPortal} from 'react-dom';

import {getDocument} from '@/utils/globals';
import {useDidMountEffect} from '@/utils/hooks';

import type {ReactNode} from 'react';

type TProps = {
  children: ReactNode;
  id: string;
};

export default function Portal({children, id}: TProps) {
  const [domReady, setDomReady] = useState(false);
  useDidMountEffect(() => {
    setDomReady(true);
  });
  const dom = getDocument().getElementById(id);
  return domReady && dom ? createPortal(children, dom) : undefined;
}
