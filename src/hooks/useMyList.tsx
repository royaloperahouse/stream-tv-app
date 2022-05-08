import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { getMyList } from '@services/myList';

export const useMyList = (): { data: Array<string>; ejected: boolean } => {
  const ejected = useRef<boolean>(false);
  const [myList, setMyList] = useState<Array<string>>([]);
  const mountedRef = useRef<boolean | undefined>(false);
  useFocusEffect(
    useCallback(() => {
      mountedRef.current = true;
      getMyList().then(items => {
        if (mountedRef && mountedRef.current) {
          ejected.current = true;
          setMyList(items);
        }
      });
      return () => {
        if (mountedRef && mountedRef.current) {
          mountedRef.current = false;
        }
      };
    }, []),
  );
  return { data: myList, ejected: ejected.current };
};
