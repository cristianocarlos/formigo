import {useCallback, useEffect, useRef, useState} from 'react';

import type {DependencyList, EffectCallback, RefObject} from 'react';

export function useDidMountEffect(cb: EffectCallback) {
  // Essa cb só deve rodar na montagem do componente
  // eslint-disable-next-line @eslint-react/exhaustive-deps
  useEffect(cb, []);
}

export function useDidUpdateEffect(cb: () => void, deps: DependencyList) {
  const isInitialMountRef = useRef(true);
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
    } else {
      return cb();
    }
    return () => {};
    // Essa cb roda de acordo com as alterações das dependências
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, deps);
}

export function useOutsideClickEffect(
  refElement: RefObject<HTMLElement | null>,
  eventName: 'click' | 'mousedown',
  handler: () => void,
) {
  const handleClickOrMouseDown = useCallback(
    (e: MouseEvent) => {
      if (refElement && refElement.current && !refElement.current.contains(e.target as Node)) {
        handler();
      }
    },
    [handler, refElement],
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Quando o botão pra abrir é dentro do mesmo elemento que recebe o useOutsideClickEffect, acaba não abrindo
      // sendo necessário workarounds com click e mousedown, o setTimeout supostamente resolve o problema
      document.addEventListener(eventName, handleClickOrMouseDown);
    });
    return () => {
      document.removeEventListener(eventName, handleClickOrMouseDown);
      clearTimeout(timeoutId);
    };
  }, [eventName, handleClickOrMouseDown]);
}

export function useValueDebounce<G>(value: G, delay?: number) {
  const isMountedRef = useRef(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    let timeoutId: number | undefined;
    if (isMountedRef.current) {
      timeoutId = window.setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
    }
    // Return a cleanup function that will be called every time ...
    // ... useEffect is re-called. useEffect will only be re-called ...
    // ... if value changes (see the inputs array below).
    // This is how we prevent debouncedValue from changing if value is ...
    // ... changed within the delay period. Timeout gets cleared and restarted.
    // To put it in context, if the user is typing within our app's ...
    // ... search box, we don't want the debouncedValue to update until ...
    // ... they've stopped typing for more than 500ms.
    isMountedRef.current = true;
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, value]);
  return debouncedValue;
}

export function useWillUnmountEffect(cb: () => void, dependencies: DependencyList = []) {
  useEffect(() => {
    return cb;
    // Essa cb só deve rodar na montagem do componente
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, dependencies);
}
