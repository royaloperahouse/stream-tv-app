import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { getListOfUniqueEventId } from '@services/bitMovinPlayer';

export const useContinueWatchingList = (): Array<string> => {
  const [continueWatchingList, setContinueWatchingList] = useState<
    Array<string>
  >([]);
  const mountedRef = useRef<boolean | undefined>(false);
  useFocusEffect(
    useCallback(() => {
      mountedRef.current = true;
      getListOfUniqueEventId().then(items => {
        if (mountedRef.current) {
          setContinueWatchingList(items);
        }
      });
      return () => {
        mountedRef.current = false;
      };
    }, []),
  );
  return continueWatchingList;
};
