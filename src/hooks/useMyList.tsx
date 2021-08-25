import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { getMyList } from '@services/myList';

export const useMyList = (): Array<string> => {
  const [myList, setMyList] = useState<Array<string>>([]);
  useFocusEffect(
    useCallback(() => {
      getMyList().then(items => {
        setMyList(items);
      });
    }, []),
  );
  return myList;
};
