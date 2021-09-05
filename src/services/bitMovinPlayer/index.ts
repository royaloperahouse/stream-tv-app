import { logError } from '@utils/loger';
import { bitMovinPlayerKey } from '@configs/bitMovinPlayerConfig';
import { TBitMovinPlayerSavedPosition } from '@services/types/models';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const savePosition = async (
  item: TBitMovinPlayerSavedPosition,
  cb?: (...args: any[]) => void,
): Promise<void> => {
  try {
    const savedPositions: string | null = await AsyncStorage.getItem(
      bitMovinPlayerKey,
    );
    const parsedSavedPositionList: Array<TBitMovinPlayerSavedPosition> =
      !savedPositions ? [] : JSON.parse(savedPositions);
    const existedIndex = parsedSavedPositionList.findIndex(
      listItem => listItem.id === item.id,
    );
    if (existedIndex === -1) {
      parsedSavedPositionList.push(item);
    } else {
      parsedSavedPositionList[existedIndex] = item;
    }
    await AsyncStorage.setItem(
      bitMovinPlayerKey,
      JSON.stringify(parsedSavedPositionList),
    );
  } catch (error) {
    logError(
      'Something went wromg with saving to BitMovinPlayerSavedPositionList',
      error,
    );
  } finally {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

export const removeItemsFromSavedPositionList = async (
  items: Array<TBitMovinPlayerSavedPosition>,
  cb?: (...args: any[]) => void,
): Promise<void> => {
  if (!Array.isArray(items) || !items.length) {
    return;
  }
  try {
    const savedPositions: string | null = await AsyncStorage.getItem(
      bitMovinPlayerKey,
    );
    const parsedSavedPositionList: Array<TBitMovinPlayerSavedPosition> =
      !savedPositions ? [] : JSON.parse(savedPositions);
    const filteredSavedPositionList = parsedSavedPositionList.filter(
      listItem => !items.some(item => item.id === listItem.id),
    );
    await AsyncStorage.setItem(
      bitMovinPlayerKey,
      JSON.stringify(filteredSavedPositionList),
    );
  } catch (error) {
    logError(
      'Something went wromg with removing from BitMovinPlayerSavedPositionList',
      error,
    );
  } finally {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

export const clearMyList = (): Promise<void> =>
  AsyncStorage.removeItem(bitMovinPlayerKey);

export const getBitMovinSavedPosition = async (
  id: string,
): Promise<TBitMovinPlayerSavedPosition | null> => {
  try {
    const savedPositions: string | null = await AsyncStorage.getItem(
      bitMovinPlayerKey,
    );
    const parsedSavedPositionList: Array<TBitMovinPlayerSavedPosition> =
      !savedPositions ? [] : JSON.parse(savedPositions);
    return parsedSavedPositionList.find(listItem => listItem.id === id) || null;
  } catch (error) {
    logError(
      'Something went wromg with getting BitMovinPlayerSavedPosition',
      error,
    );
    return null;
  }
};
