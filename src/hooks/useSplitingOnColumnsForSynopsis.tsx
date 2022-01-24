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
  splitedItems: Array<TUseSplitingOnColumnsForSynopsisArg['itemsForSpliting']>;
  splited: boolean;
};
type TUseSplitingOnColumnsForSynopsis = (
  arg: TUseSplitingOnColumnsForSynopsisArg,
) => TUseSplitingOnColumnsForSynopsisResult;
export const useSplitingOnColumnsForSynopsis: TUseSplitingOnColumnsForSynopsis =
  ({ columnHeight, itemsForSpliting }) => {
    const [splitedItems, setSplitedItems] = useState<
      TUseSplitingOnColumnsForSynopsisResult['splitedItems']
    >([itemsForSpliting]);
    const [splited, setSplited] = useState<boolean>(false);
    const splitedItemsTmp = useRef<TSplitedItemsTmp>(itemsForSpliting);
    const splitedItemsTmpResult = useRef<
      Array<{
        items: TSplitedItemsTmp;
        heightOfItems: number;
        completed: boolean;
      }>
    >([{ items: [], heightOfItems: 0, completed: false }]);
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
          if (
            !splitedItemsTmpResult.current[i].items.length &&
            event.nativeEvent.layout.height > columnHeight
          ) {
            splitedItemsTmpResult.current[i].heightOfItems +=
              event.nativeEvent.layout.height;
            splitedItemsTmpResult.current[i].items.push(
              splitedItemsTmp.current[ceilIndex],
            );
            splitedItemsTmpResult.current[i].completed = true;
            splitedItemsTmp.current.splice(ceilIndex, 1);
            break;
          }
          if (i === splitedItemsTmpResult.current.length - 1) {
            splitedItemsTmpResult.current[i].completed = true;
            splitedItemsTmpResult.current.push({
              items: [],
              heightOfItems: 0,
              completed: false,
            });
          }
        }
        if (splitedItemsTmp.current.length === 0) {
          setSplitedItems(
            splitedItemsTmpResult.current.map(({ items }) => items),
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
