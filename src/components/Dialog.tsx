import {useEffect, useRef} from 'react';

import Portal from '@/components/Portal';
import XIconButton from '@/components/XIconButton';

import type {ReactElement} from 'react';

export type TDialogCloseHandler = () => void;

export type TDialogProps = {
  children: (params: {handleClose?: TDialogCloseHandler}) => ReactElement;
  handleClose?: TDialogCloseHandler;
  isOpen: boolean;
  title: string;
};

function preventScroll(yes: boolean) {
  const body = document.querySelector('body');
  if (!body) return;
  body.style.overflow = yes ? 'hidden' : '';
}

export default function Dialog({children, handleClose, isOpen, title}: TDialogProps) {
  const refHtmlDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isOpen) {
      refHtmlDialog.current?.showModal();
      preventScroll(true);
    } else {
      refHtmlDialog.current?.close();
      preventScroll(false);
    }
  }, [isOpen]);
  return (
    <Portal id="dialog">
      <dialog
        className="m-auto w-full max-w-2xl -translate-y-16 scale-95 overflow-hidden rounded-2xl border-none bg-white p-0 opacity-0 shadow-2xl transition-all [transition-behavior:allow-discrete] duration-300 backdrop:bg-black/0 backdrop:transition-all backdrop:duration-300 open:scale-100 open:opacity-100 open:backdrop:bg-black/80 starting:open:scale-95 starting:open:opacity-0 starting:open:backdrop:bg-black/0"
        ref={refHtmlDialog}
      >
        {isOpen ? (
          <>
            <title>{title}</title>
            <header className="flex gap-4 rounded-tl-lg rounded-tr-lg border-b border-b-gray-200 bg-gray-100 px-8 py-4 max-sm:p-4">
              <h1 className="flex-1">{title}</h1>
              {handleClose ? <XIconButton onClick={handleClose} /> : undefined}
            </header>
            <div className="max-h-[80vh] overflow-auto px-8 py-8 max-sm:p-4 [&_[data-buttonset]]:mt-8">
              {children({handleClose})}
            </div>
          </>
        ) : undefined}
      </dialog>
    </Portal>
  );
}
