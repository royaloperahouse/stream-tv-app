import React, { useCallback, useRef } from 'react';
import { View, ViewProps, VirtualizedList } from 'react-native';

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
  } = props;
  const sectionsListRef = useRef<VirtualizedList<any> | null>(null);
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
  return (
    <View style={[containerStyle]}>
      <VirtualizedList
        ref={sectionsListRef}
        data={sections}
        keyExtractor={(item: Array<any>, index) =>
          sectionKeyExtractor(item[index])
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={sectionsInitialNumber}
        getItemCount={getSectionCount}
        windowSize={sectionsWindowSize}
        getItem={data => [...data]}
        renderItem={({ item, index }) => (
          <View style={[railStyle]}>
            <View style={[headerContainerStyle]}>
              {renderHeader(item[index])}
            </View>
            <VirtualizedList
              horizontal
              windowSize={railWindowSize}
              getItem={data => [...data]}
              data={item[index].data}
              keyExtractor={(sectionItem: Array<any>, sectionIndex) =>
                sectionItemKeyExtractor(sectionItem[sectionIndex])
              }
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              initialNumToRender={sectionItemsInitialNumber}
              getItemCount={getSectionItemCount}
              renderItem={({ index: itemIndex, item: sectionItem }) => {
                return renderItem({
                  index: itemIndex,
                  item: sectionItem[itemIndex],
                  section: item[index],
                  scrollToRail: scrollToRail(index),
                  isFirstRail: index === 0,
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
