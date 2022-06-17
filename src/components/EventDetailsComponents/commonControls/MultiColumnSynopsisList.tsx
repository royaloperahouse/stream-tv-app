import { VirtualizedList, View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import React, { useRef, useCallback } from 'react';
import { Colors } from '@themes/Styleguide';
import { useSplitingOnColumnsForSynopsis } from '@hooks/useSplitingOnColumnsForSynopsis';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import ScrollingArrowPagination, {
  TScrollingArrowPaginationRef,
} from '@components/ScrollingArrowPagination';
import { OverflowingContainer } from '@components/OverflowingContainer';
import { useFocusEffect } from '@react-navigation/native';

type TMultiColumnSynopsisListProps = {
  data: Array<{ key: string; text: string }>;
  columnHeight: number;
  columnWidth: number;
  setFocusRef: (
    cp:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number,
  ) => void;
  id: string;
};

const MultiColumnSynopsisList: React.FC<
  TMultiColumnSynopsisListProps
> = props => {
  const { data, columnHeight, columnWidth, setFocusRef = () => {}, id } = props;
  const { onLayoutHandler, splitedItems, splited } =
    useSplitingOnColumnsForSynopsis({
      columnHeight,
      itemsForSpliting: data,
    });
  const scrollingArrowPaginationRef =
    useRef<TScrollingArrowPaginationRef>(null);
  const focusedComponentRef = useRef<TTouchableHighlightWrapperRef>(null);
  useFocusEffect(
    useCallback(() => {
      if (splited) {
        setFocusRef(focusedComponentRef.current?.getRef?.().current || null);
      } else {
        setFocusRef(null);
      }
      return () => {
        setFocusRef(null);
      };
    }, [splited, setFocusRef]),
  );
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
      <TouchableHighlightWrapper canMoveRight={false} ref={focusedComponentRef}>
        <View>
          {splitedItems.map((column, index) =>
            column.needToWrap ? (
              <OverflowingContainer
                fixedHeight
                key={index}
                contentMaxVisibleHeight={columnHeight}
                contentMaxVisibleWidth={columnWidth}>
                {column.items.map(synops => (
                  <View style={styles.elementContainer} key={synops.key}>
                    <RohText style={styles.synopsis}>{synops.text}</RohText>
                  </View>
                ))}
              </OverflowingContainer>
            ) : (
              <View
                key={index}
                style={[
                  {
                    height: columnHeight,
                    width: columnWidth,
                  },
                ]}>
                {column.items.map(synops => (
                  <View style={styles.elementContainer} key={synops.key}>
                    <RohText style={styles.synopsis}>{synops.text}</RohText>
                  </View>
                ))}
              </View>
            ),
          )}
        </View>
      </TouchableHighlightWrapper>
    );
  }
  return (
    <View style={[{ height: columnHeight, width: columnWidth }]}>
      <VirtualizedList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        style={styles.list}
        data={splitedItems}
        listKey={id}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        getItemCount={columns => columns?.length || 0}
        keyExtractor={(_, index) => index.toString()}
        getItem={(columns, index) => columns[index]}
        windowSize={4}
        renderItem={({
          item,
          index,
        }: {
          [key: string]: any;
          item: {
            items: Array<{
              [key: string]: any;
            }>;
            needToWrap: boolean;
          };
        }) => (
          <TouchableHighlightWrapper
            canMoveRight={index !== splitedItems.length - 1}
            ref={index === 0 ? focusedComponentRef : undefined}
            onFocus={() => {
              if (
                typeof scrollingArrowPaginationRef.current?.setCurrentIndex ===
                'function'
              ) {
                scrollingArrowPaginationRef.current.setCurrentIndex(index);
              }
            }}>
            <View>
              {item.needToWrap ? (
                <OverflowingContainer
                  fixedHeight
                  key={index}
                  contentMaxVisibleHeight={columnHeight}
                  contentMaxVisibleWidth={columnWidth}>
                  {item.items.map(synops => (
                    <View style={styles.elementContainer} key={synops.key}>
                      <RohText style={styles.synopsis}>{synops.text}</RohText>
                    </View>
                  ))}
                </OverflowingContainer>
              ) : (
                <View
                  style={[
                    {
                      height: columnHeight,
                      width: columnWidth,
                    },
                  ]}>
                  {item.items.map(synops => (
                    <View style={styles.elementContainer} key={synops.key}>
                      <RohText style={styles.synopsis}>{synops.text}</RohText>
                    </View>
                  ))}
                </View>
              )}
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
