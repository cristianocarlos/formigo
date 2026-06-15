import {createSelector} from 'reselect';

export const getArrayLength = createSelector(
  [
    (value?: unknown) => {
      return value;
    },
  ],
  (value?: unknown) => {
    return Array.isArray(value) ? value.length : 0;
  },
);
