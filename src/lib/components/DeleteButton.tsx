import {TrashIcon} from 'lucide-react';

import DialogButton from '@/components/DialogButton';
import YiiLang from '@/utils/yii-lang';

import DeleteHandler from './DeleteHandler';

import type {TDeleteHandlerProps} from './DeleteHandler';
import type {ReactNode} from 'react';

export type TDeleteButtonProps = Pick<TDeleteHandlerProps, 'handleConfirm' | 'socketId' | 'url'> & {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function DeleteButton(props: TDeleteButtonProps) {
  const {children, className = '', disabled, handleConfirm, socketId, url} = props;
  return (
    <DialogButton
      className={`text-formigo--theme ml-auto flex items-center gap-1 ${className}`}
      dialogRenderer={({handleClose}) => {
        return (
          <DeleteHandler
            handleConfirm={handleConfirm}
            handleDialogClose={handleClose || (() => null)}
            socketId={socketId}
            url={url}
          />
        );
      }}
      dialogTitle={YiiLang.formigo('textFormDeleteConfirmTitle')}
      disabled={disabled}
    >
      {children || (
        <>
          <TrashIcon />
          {YiiLang.formigo('labelFormDeleteButton')}
        </>
      )}
    </DialogButton>
  );
}
