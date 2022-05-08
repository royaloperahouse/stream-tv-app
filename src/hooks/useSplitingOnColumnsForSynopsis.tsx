import { LayoutChangeEvent } from 'react-native';
import { useState, useRef } from 'react';
type TUseSplitingOnColumnsForSynopsisArg = {
  columnHeight: number;
  itemsForSpliting: Array<{ [key: string]: any }>;
};
type TSplitedItemsTmp = Array<{
  [key: string]: any;
}>;
type TUseSplitingOnColumnsForSynopsisResult = {
  onLayoutHandler: (
    itemIdKey: string,
    itemIdValue: string,
  ) => (event: LayoutChangeEvent) => void;
  splitedItems: Array<{
    items: TUseSplitingOnColumnsForSynopsisArg['itemsForSpliting'];
    needToWrap: boolean;
  }>;
  splited: boolean;
};
type TUseSplitingOnColumnsForSynopsis = (
  arg: TUseSplitingOnColumnsForSynopsisArg,
) => TUseSplitingOnColumnsForSynopsisResult;
export const useSplitingOnColumnsForSynopsis: TUseSplitingOnColumnsForSynopsis =
  ({ columnHeight, itemsForSpliting }) => {
    const [splitedItems, setSplitedItems] = useState<
      Array<{
        items: TUseSplitingOnColumnsForSynopsisArg['itemsForSpliting'];
        needToWrap: boolean;
      }>
    >([]);
    const [splited, setSplited] = useState<boolean>(false);
    const splitedItemsTmp = useRef<TSplitedItemsTmp>(itemsForSpliting);
    const splitedItemsTmpResult = useRef<
      Array<{
        items: TSplitedItemsTmp;
        heightOfItems: number;
        completed: boolean;
        needToWrap: boolean;
      }>
    >([{ items: [], heightOfItems: 0, completed: false, needToWrap: false }]);
    const onLayoutHandler: TUseSplitingOnColumnsForSynopsisResult['onLayoutHandler'] =
      (itemIdKey, itemIdValue) => event => {
        const ceilIndex = splitedItemsTmp.current.findIndex(
          item => item[itemIdKey] === itemIdValue,
        );
        if (ceilIndex === -1) {
          return;
        }
        for (let i = 0; i < splitedItemsTmpResult.current.length; i++) {
          if (
            splitedItemsTmpResult.current[i].heightOfItems +
              event.nativeEvent.layout.height <=
              columnHeight &&
            !splitedItemsTmpResult.current[i].completed
          ) {
            splitedItemsTmpResult.current[i].heightOfItems +=
              event.nativeEvent.layout.height;
            splitedItemsTmpResult.current[i].items.push(
              splitedItemsTmp.current[ceilIndex],
            );
            splitedItemsTmp.current.splice(ceilIndex, 1);
            break;
          }
          if (event.nativeEvent.layout.height > columnHeight) {
            splitedItemsTmpResult.current[i].completed = true;
            splitedItemsTmpResult.current[i].heightOfItems +=
              event.nativeEvent.layout.height;
            if (splitedItemsTmpResult.current[i].items.length) {
              splitedItemsTmpResult.current.push({
                items: [splitedItemsTmp.current[ceilIndex]],
                heightOfItems: event.nativeEvent.layout.height,
                completed: true,
                needToWrap: true,
              });
            } else {
              splitedItemsTmpResult.current[i].items.push(
                splitedItemsTmp.current[ceilIndex],
              );
              splitedItemsTmpResult.current[i].needToWrap = true;
            }
            splitedItemsTmp.current.splice(ceilIndex, 1);
            break;
          }
          if (i === splitedItemsTmpResult.current.length - 1) {
            splitedItemsTmpResult.current[i].completed = true;
            splitedItemsTmpResult.current.push({
              items: [],
              heightOfItems: 0,
              completed: false,
              needToWrap: false,
            });
          }
        }
        if (splitedItemsTmp.current.length === 0) {
          setSplitedItems(
            splitedItemsTmpResult.current.map(({ items, needToWrap }) => ({
              items,
              needToWrap,
            })),
          );
          setSplited(true);
        }
      };

    return {
      onLayoutHandler,
      splitedItems,
      splited,
    };
  };
