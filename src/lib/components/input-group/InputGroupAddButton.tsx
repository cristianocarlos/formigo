import {PlusCircleIcon} from 'lucide-react';

import YiiLang from '@/utils/yii-lang';

export default function InputGroupAddButton({handleAdd}: {handleAdd: () => void}) {
  return (
    <div className="mt-4">
      <button className="text-formigo--theme flex items-center gap-1 text-sm" onClick={handleAdd} type="button">
        <PlusCircleIcon />
        {YiiLang.formigo('labelFormInputGroupAddButton')}
      </button>
    </div>
  );
}
