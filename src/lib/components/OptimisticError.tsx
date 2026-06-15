import {useSelectorFormigoValidatorInputErrors} from '@/lib/zustand/hooks';

import type {TFormigoAttribute} from '@/lib/types/formigo';

export default function OptimisticError({attribute}: {attribute: TFormigoAttribute}) {
  const inputErrors = useSelectorFormigoValidatorInputErrors(attribute);
  if (!inputErrors) return;
  return (
    <em className="absolute w-full rounded bg-linear-to-l from-yellow-100 to-yellow-50 text-xs leading-none text-yellow-500 not-italic">
      {inputErrors.join('; ')}
    </em>
  );
}
