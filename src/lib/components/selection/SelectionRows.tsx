import XIconButton from '@/components/XIconButton';
import {useSelectionContext} from '@/lib/components/selection/SelectionContext';

import type {TSelectionRowsProps} from '@/lib/types/selection';

export default function SelectionRows({renderer}: TSelectionRowsProps) {
  const {attribute, handleRemove, rows} = useSelectionContext();
  if (!rows) return;
  if (rows.length === 0) return;
  return (
    <ul>
      {rows.map((data, index) => {
        return (
          <li className="flex hover:bg-gray-50 hover:[&>button]:inline!" key={index}>
            <div className="flex-1 leading-tight">
              {renderer({data, rowAttribute: [...attribute, index.toString()]})}
            </div>
            <XIconButton className="hidden" onClick={() => handleRemove(index)} />
          </li>
        );
      })}
    </ul>
  );
}
