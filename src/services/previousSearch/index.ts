import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from '@utils/loger';
import {
  prevSearchListKey,
  maxPrevSearchListSize,
} from '@configs/previousSearchesConfig';

export const addItemToPrevSearchList = async (item: string) => {
  try {
    const alreadySavedPrevSearchList = await AsyncStorage.getItem(
      prevSearchListKey,
    );
    const prevSearchSetCollection = !alreadySavedPrevSearchList
      ? new Set<string>()
      : new Set<string>(JSON.parse(alreadySavedPrevSearchList));
    prevSearchSetCollection.add(item);
    if (prevSearchSetCollection.size > maxPrevSearchListSize) {
      prevSearchSetCollection.delete(
        Array.from<string>(prevSearchSetCollection).shift() || '',
      );
    }
    await AsyncStorage.setItem(
      prevSearchListKey,
      JSON.stringify(Array.from(prevSearchSetCollection)),
    );
  } catch (err) {
    logError('AddItemToPrevSearchList', err);
  }
};

export const getPrevSearchList = async (): Promise<Array<string>> => {
  try {
    const alreadySavedPrevSearchList = await AsyncStorage.getItem(
      prevSearchListKey,
    );
    const prevSearchSetCollection = !alreadySavedPrevSearchList
      ? []
      : JSON.parse(alreadySavedPrevSearchList);
    return prevSearchSetCollection;
  } catch (err) {
    logError('getPrevSearchList', err);
    return [];
  }
};

export const removeItemFromPrevSearchList = async (item: string) => {
  try {
    const alreadySavedPrevSearchList = await AsyncStorage.getItem(
      prevSearchListKey,
    );
    const prevSearchSetCollection = !alreadySavedPrevSearchList
      ? new Set()
      : new Set(JSON.parse(alreadySavedPrevSearchList));
    prevSearchSetCollection.delete(item);
    await AsyncStorage.setItem(
      prevSearchListKey,
      JSON.stringify(Array.from(prevSearchSetCollection)),
    );
  } catch (err) {
    logError('removeItemFromPrevSearchList', err);
  }
};

export const clearPrevSearchList = async () => {
  try {
    await AsyncStorage.setItem(prevSearchListKey, JSON.stringify([]));
  } catch (err) {
    logError('clearPrevSearchList', err);
  }
};
