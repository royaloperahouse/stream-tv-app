import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { View, ViewProps, VirtualizedList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { scaleSize } from '@utils/scaleSize';

type TRailSectionsProps = {
  containerStyle?: ViewProps['style'];
  sections: Array<{ [key: string]: any }>;
  sectionKeyExtractor?: (data: { [key: string]: any }) => string;
  sectionItemKeyExtractor?: (data: { [key: string]: any }) => string;
  sectionsInitialNumber?: number;
  sectionItemsInitialNumber?: number;
  railStyle?: ViewProps['style'];
  renderHeader?: (data: any) => JSX.Element | null;
  headerContainerStyle?: ViewProps['style'];
  renderItem: (info: { [key: string]: any }) => JSX.Element | null;
  sectionsWindowSize?: number;
  railWindowSize?: number;
  sectionIndex?: number;
};

const RailSections: React.FC<TRailSectionsProps> = props => {
  const {
    containerStyle = {},
    sections,
    sectionKeyExtractor = data => data.id,
    sectionItemKeyExtractor = data => data.id,
    sectionsInitialNumber = 2,
    sectionItemsInitialNumber = 5,
    railStyle = {},
    renderHeader = _ => null,
    headerContainerStyle = {},
    sectionsWindowSize = 2,
    railWindowSize = 5,
    renderItem,
    sectionIndex = 0,
  } = props;
  const mountedRef = useRef<boolean>(false);
  const sectionsListRef = useRef<VirtualizedList<any> | null>(null);
  const railItemsListRef = useRef<VirtualizedList<any> | null>(null);
  const getSectionCount = useCallback(data => data.length, []);
  const getSectionItemCount = useCallback(data => data.length, []);
  const scrollToRail = (index: number) => () => {
    if (sectionsListRef.current) {
      sectionsListRef.current.scrollToIndex({
        animated: true,
        index,
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
      mountedRef.current = true;
      return () => {
        if (mountedRef && mountedRef.current) {
          mountedRef.current = false;
        }
      };
    }, []),
  );
  return (
    <View style={[containerStyle]}>
      <VirtualizedList
        ref={sectionsListRef}
        data={sections}
        keyExtractor={item => sectionKeyExtractor(item)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={sectionsInitialNumber}
        initialScrollIndex={
          !sections.length
            ? 0
            : sectionIndex < sections.length
            ? sectionIndex
            : sections.length - 1
        }
        getItemCount={getSectionCount}
        windowSize={sectionsWindowSize}
        getItem={(data, index) => data[index]}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            if (
              !mountedRef ||
              !mountedRef.current ||
              info.index === undefined ||
              !sectionsListRef.current
            ) {
              return;
            }
            sectionsListRef.current.scrollToIndex({
              animated: true,
              index: info.index,
            });
          });
        }}
        renderItem={({ item: sectionItem, index: sectionItemIndex }) => (
          <View style={[railStyle]}>
            <View style={[headerContainerStyle]}>
              {renderHeader(sectionItem)}
            </View>
            <VirtualizedList
              horizontal
              listKey={sectionItem.sectionIndex?.toString()}
              windowSize={railWindowSize}
              initialNumToRender={sectionItemsInitialNumber}
              getItem={(data, index) => data[index]}
              data={sectionItem.data}
              ref={
                sectionItemIndex === sectionIndex ? railItemsListRef : undefined
              }
              keyExtractor={(sectionItemForKeyExtracting: any) =>
                sectionItemKeyExtractor(sectionItemForKeyExtracting)
              }
              onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 1000));
                wait.then(() => {
                  if (
                    !mountedRef ||
                    !mountedRef.current ||
                    info.index === undefined ||
                    !railItemsListRef.current
                  ) {
                    return;
                  }
                  railItemsListRef.current.scrollToIndex({
                    animated: false,
                    index: info.index,
                  });
                });
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              getItemCount={getSectionItemCount}
              renderItem={({
                index: railItemIndexInList,
                item: railItemInList,
              }) => {
                return renderItem({
                  index: railItemIndexInList,
                  item: railItemInList,
                  section: sectionItem,
                  scrollToRail: scrollToRail(sectionItemIndex),
                  isFirstRail: sectionItemIndex === 0,
                  sectionIndex: sectionItemIndex,
                  railItemIndex: railItemIndexInList,
                  isLastRail: sections.length - 1 === sectionItemIndex,
                });
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default RailSections;
