import {useSelectionContext} from '@/lib/components/selection/SelectionContext';

import type {TSelectionChooserProps} from '@/lib/types/selection';

export default function SelectionChooser({renderer}: TSelectionChooserProps) {
  const {attribute, handleAdd} = useSelectionContext();
  return renderer({chooserAttribute: ['chooser', ...attribute], handleAdd});
}
