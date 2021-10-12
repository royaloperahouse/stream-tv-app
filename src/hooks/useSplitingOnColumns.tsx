import { LayoutChangeEvent } from 'react-native';
import { useState, useRef } from 'react';
type TUseSplitingOnColumnsArg = {
  columnHeight: number;
  itemsForSpliting: Array<{ [key: string]: any }>;
};
type TSplitedItemsTmp = Array<{
  [key: string]: any;
}>;
type TUseSplitingOnColumnsResult = {
  onLayoutHandler: (
    itemIdKey: string,
    itemIdValue: string,
  ) => (event: LayoutChangeEvent) => void;
  splitedItems: Array<TUseSplitingOnColumnsArg['itemsForSpliting']>;
  splited: boolean;
};
type TUseSplitingOnColumns = (
  arg: TUseSplitingOnColumnsArg,
) => TUseSplitingOnColumnsResult;
export const useSplitingOnColumns: TUseSplitingOnColumns = ({
  columnHeight,
  itemsForSpliting,
}) => {
  const [splitedItems, setSplitedItems] = useState<
    TUseSplitingOnColumnsResult['splitedItems']
  >([itemsForSpliting]);
  const [splited, setSplited] = useState<boolean>(false);
  const splitedItemsTmp = useRef<TSplitedItemsTmp>(itemsForSpliting);
  const splitedItemsTmpResult = useRef<
    Array<{ items: TSplitedItemsTmp; heightOfItems: number }>
  >([{ items: [], heightOfItems: 0 }]);
  const onLayoutHandler: TUseSplitingOnColumnsResult['onLayoutHandler'] =
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
          columnHeight
        ) {
          splitedItemsTmpResult.current[i].heightOfItems +=
            event.nativeEvent.layout.height;
          splitedItemsTmpResult.current[i].items.push(
            splitedItemsTmp.current[ceilIndex],
          );
          splitedItemsTmp.current.splice(ceilIndex, 1);
          break;
        }
        if (i === splitedItemsTmpResult.current.length - 1) {
          splitedItemsTmpResult.current.push({
            items: [],
            heightOfItems: 0,
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
