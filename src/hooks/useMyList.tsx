import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { getMyList } from '@services/myList';

export const useMyList = (): Array<string> => {
  const [myList, setMyList] = useState<Array<string>>([]);
  const mountedRef = useRef<boolean | undefined>(false);
  useFocusEffect(
    useCallback(() => {
      mountedRef.current = true;
      getMyList().then(items => {
        if (mountedRef.current) {
          setMyList(items);
        }
      });
    }, []),
  );
  return myList;
};
