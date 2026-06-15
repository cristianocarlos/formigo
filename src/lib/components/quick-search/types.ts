import type {TFormigoXhrActions} from '@/lib/types/formigo';

type TQuickSearchDebounceParamsBase = {
  dataGet: TFormigoXhrActions['dataGet'];
  handleAbort: () => void;
  handleStart: () => void;
  term?: string;
  url: string;
};

export type TQuickSearchDebounceParams<G> = TQuickSearchDebounceParamsBase & {
  handleEnd: (newRows: G) => void;
};

export type TQuickSearchProps<G> = Omit<TQuickSearchDebounceParamsBase, 'term'> & {
  handleEnd: TQuickSearchDebounceParams<G>['handleEnd'];
  placeholder?: string;
};
