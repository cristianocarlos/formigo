import {useState} from 'react';

import Dialog from '@/components/Dialog';

import type {TDialogProps} from '@/components/Dialog';
import type {ComponentProps} from 'react';

type TProps = ComponentProps<'button'> & {
  dialogRenderer: TDialogProps['children'];
  dialogTitle: TDialogProps['title'];
};

export default function DialogButton({children, className, dialogRenderer, dialogTitle}: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <button className={`${className}`} onClick={handleOpen} type="button">
        {children}
      </button>
      <Dialog handleClose={handleClose} isOpen={isOpen} title={dialogTitle}>
        {dialogRenderer}
      </Dialog>
    </>
  );
}
