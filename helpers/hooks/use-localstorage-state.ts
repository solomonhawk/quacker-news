import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';

type StateKey = Array<string | number>;

function getLocalStorageKey(stateKey: StateKey): string {
  return `quackernews__${stateKey.join('_')}`;
}

export const useLocalStorageState = <T>(stateKey: StateKey, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const hydratedRef = useRef(false);
  const key = getLocalStorageKey(stateKey);

  const [state, setState] = useState(() => {
    return defaultValue;
  });

  const useEffectFn = typeof window === 'undefined' ? useEffect : useLayoutEffect;

  useEffectFn(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!hydratedRef.current) {
      const json = localStorage.getItem(key);

      if (json) {
        setState(JSON.parse(json));
      }

      hydratedRef.current = true;
    }
  }, [key]);

  useEffect(() => {
    if (hydratedRef.current) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
};
