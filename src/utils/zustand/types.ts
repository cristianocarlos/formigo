import type {TArrayKey} from '@/types/common';

export type TZustandCommonState = {
  dataGetValue: (propName: string) => unknown;
  dataGetValueIn: (keyPath: string | TArrayKey) => unknown;
  dataInject: (initialData: any, resetMethod?: 'init' | 'none') => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  dataReset: () => void;
  dataSetValue: <G>(value: G, propName: string) => void;
  dataSetValueIn: <G>(newValue: G, keyPath: string | TArrayKey) => void;
};
