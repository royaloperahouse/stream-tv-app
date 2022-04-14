import { VirtualizedList, View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import React, { useRef } from 'react';
import { Colors } from '@themes/Styleguide';
import { useSplitingOnColumnsForSynopsis } from '@hooks/useSplitingOnColumnsForSynopsis';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import ScrollingArrowPagination, {
  TScrollingArrowPaginationRef,
} from '@components/ScrollingArrowPagination';

type TMultiColumnSynopsisListProps = {
  data: Array<{ key: string; text: string }>;
  columnHeight: number;
  columnWidth: number;
};

const MultiColumnSynopsisList: React.FC<
  TMultiColumnSynopsisListProps
> = props => {
  const { data, columnHeight, columnWidth } = props;
  const { onLayoutHandler, splitedItems, splited } =
    useSplitingOnColumnsForSynopsis({
      columnHeight,
      itemsForSpliting: data,
    });
  const scrollingArrowPaginationRef =
    useRef<TScrollingArrowPaginationRef>(null);
  if (!splited) {
    return (
      <View style={{ width: columnWidth }}>
        {data.map(item => (
          <View
            key={item.key}
            style={[styles.elementContainer, styles.elementContainerAbsolute]}
            onLayout={onLayoutHandler('key', item.key)}>
            <RohText style={styles.synopsis}>{item.text}</RohText>
          </View>
        ))}
      </View>
    );
  }
  if (splitedItems.length === 1) {
    return (
      <TouchableHighlightWrapper>
        <View style={[{ height: columnHeight, width: columnWidth, overflow: 'hidden' }]}>
          {splitedItems.map(column =>
            column.map(synops => (
              <View style={styles.elementContainer} key={synops.key}>
                <RohText style={styles.synopsis}>{synops.text}</RohText>
              </View>
            )),
          )}
        </View>
      </TouchableHighlightWrapper>
    );
  }

  return (
    <View style={[{ height: columnHeight }]}>
      <VirtualizedList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        style={styles.list}
        data={splitedItems}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        getItemCount={columns => columns?.length || 0}
        keyExtractor={(_, index) => index.toString()}
        getItem={columns => [...columns]}
        windowSize={4}
        renderItem={({
          item,
          index,
        }: {
          [key: string]: any;
          item: Array<TMultiColumnSynopsisListProps['data']>;
        }) => (
          <TouchableHighlightWrapper
            style={[{ height: columnHeight }]}
            canMoveRight={index !== item.length - 1}
            onFocus={() => {
              if (
                typeof scrollingArrowPaginationRef.current?.setCurrentIndex ===
                'function'
              ) {
                scrollingArrowPaginationRef.current.setCurrentIndex(index);
              }
            }}>
            <View style={[styles.columnContainer, { height: columnHeight }]}>
              {item[index].map(ceil => (
                <View style={styles.elementContainer} key={ceil.key}>
                  <RohText style={styles.synopsis}>{ceil.text}</RohText>
                </View>
              ))}
            </View>
          </TouchableHighlightWrapper>
        )}
      />
      <ScrollingArrowPagination
        ref={scrollingArrowPaginationRef}
        countOfItems={splitedItems.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  elementContainer: {
    paddingBottom: scaleSize(32),
    width: scaleSize(740),
  },
  elementContainerAbsolute: {
    position: 'absolute',
    opacity: 0,
  },
  list: {
    flex: 1,
  },
  columnContainer: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaleSize(30),
  },
  synopsisContainer: {
    height: '100%',
    width: scaleSize(740),
  },
  synopsis: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(28),
    lineHeight: scaleSize(38),
  },
});

export default MultiColumnSynopsisList;
