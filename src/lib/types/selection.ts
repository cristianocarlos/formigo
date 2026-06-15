import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {ReactElement, ReactNode} from 'react';

export type TSelectionData = {id: string; label: string} & Record<string, string>;

export type TSelectionContext = {
  attribute: TFormigoAttribute;
  handleAdd: (item: TSelectionData) => void;
  handleRemove: (index: number) => void;
  rows?: Array<TSelectionData>;
};

export type TSelectionChooserRendererParams = {
  chooserAttribute: TSelectionContext['attribute'];
  handleAdd: TSelectionContext['handleAdd'];
};

export type TSelectionRowsRendererParams = {
  data: NonNullable<TSelectionContext['rows']>[number];
  rowAttribute: TSelectionContext['attribute'];
};

export type TSelectionChooserProps = {
  renderer: (params: TSelectionChooserRendererParams) => ReactElement;
};

export type TSelectionRowsProps = {
  renderer: (params: TSelectionRowsRendererParams) => ReactNode;
};
