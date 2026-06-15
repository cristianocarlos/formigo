import ButtonSet from '@/lib/components/ButtonSet';
import {useFormigoContext} from '@/lib/utils/withContext';
import YiiLang from '@/utils/yii-lang';

import type {TDialogCloseHandler} from '@/components/Dialog';
import type {TButtonMouseEventHandler, TFormigoSubmitEventHandler} from '@/types/common';

export type TDeleteHandlerProps = {
  handleConfirm: () => void;
  handleDialogClose: TDialogCloseHandler;
  socketId?: string;
  url: string;
};

const preventDoubleSubmission: TFormigoSubmitEventHandler = (e) => {
  const {currentTarget} = e;
  currentTarget.disabled = true;
  window.setTimeout(() => {
    currentTarget.disabled = false;
  }, 2000);
};

export default function DeleteHandler(props: TDeleteHandlerProps) {
  const {handleConfirm, handleDialogClose, url} = props;
  const {xhrActions} = useFormigoContext();
  const handleDelete: TButtonMouseEventHandler = async (e) => {
    e.preventDefault();
    preventDoubleSubmission(e);
    await xhrActions.recordDelete(url);
    handleConfirm();
    handleDialogClose?.();
  };

  return (
    <>
      <div className="mb-4">{YiiLang.formigo('textFormDeleteConfirmAsk')}</div>
      <ButtonSet hasFeedback={false}>
        <button className="formigo--button-primary" onClick={handleDelete}>
          {YiiLang.formigo('labelFormDeleteConfirmDeleteButton')}
        </button>
        <button onClick={handleDialogClose} type="button">
          {YiiLang.formigo('labelFormDeleteConfirmCancelButton')}
        </button>
      </ButtonSet>
    </>
  );
}
