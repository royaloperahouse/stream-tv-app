import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { getListOfUniqueEventId } from '@services/bitMovinPlayer';

export const useContinueWatchingList = (): {
  data: Array<string>;
  ejected: boolean;
} => {
  const ejected = useRef<boolean>(false);
  const [continueWatchingList, setContinueWatchingList] = useState<
    Array<string>
  >([]);
  const mountedRef = useRef<boolean | undefined>(false);
  useFocusEffect(
    useCallback(() => {
      mountedRef.current = true;
      getListOfUniqueEventId().then(items => {
        if (mountedRef.current) {
          ejected.current = true;
          setContinueWatchingList(items);
        }
      });
      return () => {
        mountedRef.current = false;
      };
    }, []),
  );
  return { data: continueWatchingList, ejected: ejected.current };
};
