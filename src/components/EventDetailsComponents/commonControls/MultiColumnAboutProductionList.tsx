import { VirtualizedList, View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import React, { useRef } from 'react';
import { Colors } from '@themes/Styleguide';
import { useSplitingOnColumnsForSynopsis } from '@hooks/useSplitingOnColumnsForSynopsis';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import ScrollingPagination, {
  TScrolingPaginationRef,
} from '@components/ScrollingPagination';
import FastImage from 'react-native-fast-image';

export enum ECellItemKey {
  'guidance' = 'guidance',
  'genres' = 'genres',
  'sponsor' = 'sponsor',
  'language' = 'language',
  'run_time' = 'run_time',
}

type TMultiColumnAboutProductionListProps = {
  data: Array<{ key: string; type: ECellItemKey; content: any }>;
  columnHeight: number;
  columnWidth: number;
};

const MultiColumnAboutProductionList: React.FC<
  TMultiColumnAboutProductionListProps
> = props => {
  const { data, columnHeight, columnWidth } = props;
  const { onLayoutHandler, splitedItems, splited } =
    useSplitingOnColumnsForSynopsis({
      columnHeight,
      itemsForSpliting: data,
    });

  const imageSizeCalc = (
    width: number,
    height: number,
    maxWidth: number,
  ): { width: number; height: number } => {
    if (width <= maxWidth) {
      return {
        width: scaleSize(width),
        height: scaleSize(height),
      };
    }
    const multiplexer = width / maxWidth;
    const calculatedHeight = height / multiplexer;
    return {
      width: scaleSize(maxWidth),
      height: scaleSize(calculatedHeight),
    };
  };
  const contentItemsFabric = (item: {
    key: string;
    type: ECellItemKey;
    content: any;
  }) => {
    switch (item.type) {
      case ECellItemKey.sponsor: {
        return (
          <View>
            {item.content.img && (
              <View>
                <RohText style={styles.title}>Production sponsor</RohText>
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  style={[
                    styles.image,
                    imageSizeCalc(
                      item.content.img.width,
                      item.content.img.height,
                      columnWidth,
                    ),
                  ]}
                  source={{ uri: item.content.img.url }}
                />
              </View>
            )}
            {item.content.info && (
              <View>
                <RohText style={styles.title}>
                  {item.content.info.title}
                </RohText>
                <RohText style={styles.content}>
                  {item.content.info.description}
                </RohText>
              </View>
            )}
          </View>
        );
      }
      default:
        return (
          <View>
            <RohText style={styles.title}>
              {ECellItemKey[item.type].toUpperCase()}
            </RohText>
            <RohText style={styles.content}>{item.content}</RohText>
          </View>
        );
    }
  };
  const scrollingPaginationRef = useRef<TScrolingPaginationRef>(null);
  if (!splited) {
    return (
      <View style={{ width: columnWidth }}>
        {data.map(item => (
          <View
            key={item.key}
            style={[styles.elementContainer, styles.elementContainerAbsolute]}
            onLayout={onLayoutHandler('key', item.key)}>
            {contentItemsFabric(item)}
          </View>
        ))}
      </View>
    );
  }
  if (splitedItems.length < 3) {
    return (
      <TouchableHighlightWrapper>
        <View style={styles.towColumnsList}>
          {splitedItems.map((column, index) => (
            <View style={styles.columnContainer} key={index}>
              {column.map((ceil: any) => (
                <View style={styles.elementContainer} key={ceil.key}>
                  {contentItemsFabric(ceil)}
                </View>
              ))}
            </View>
          ))}
        </View>
      </TouchableHighlightWrapper>
    );
  }

  return (
    <View style={styles.root}>
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
        getItem={(data, index) => data[index]}
        windowSize={4}
        renderItem={({
          item,
          index,
        }: {
          [key: string]: any;
          item: TMultiColumnAboutProductionListProps['data'];
        }) => (
          <TouchableHighlightWrapper
            style={[styles.column, { height: columnHeight }]}
            canMoveRight={index !== item.length - 1}
            onFocus={() => {
              if (
                typeof scrollingPaginationRef.current?.setCurrentIndex ===
                'function'
              ) {
                scrollingPaginationRef.current.setCurrentIndex(index);
              }
            }}
            styleFocused={styles.columnInFocus}>
            <View style={styles.columnContainer}>
              {item.map(ceil => (
                <View style={styles.elementContainer} key={ceil.key}>
                  {contentItemsFabric(ceil)}
                </View>
              ))}
            </View>
          </TouchableHighlightWrapper>
        )}
      />
      <View style={styles.paginationContainer}>
        <ScrollingPagination
          ref={scrollingPaginationRef}
          countOfItems={splitedItems.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  title: {
    fontSize: scaleSize(20),
    color: Colors.midGrey,
    textTransform: 'uppercase',
    lineHeight: scaleSize(24),
    letterSpacing: scaleSize(2),
  },
  content: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(24),
    lineHeight: scaleSize(32),
  },
  elementContainer: {
    paddingBottom: scaleSize(32),
    width: scaleSize(357),
  },
  elementContainerAbsolute: {
    position: 'absolute',
    opacity: 0,
  },
  list: {
    flex: 1,
  },
  towColumnsList: {
    flexDirection: 'row',
  },
  columnContainer: {
    flex: 1,
  },
  column: {
    opacity: 0.7,
    marginRight: scaleSize(30),
  },
  columnInFocus: {
    opacity: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaleSize(30),
  },
  image: {
    zIndex: 0,
    marginTop: scaleSize(10),
  },
});

export default MultiColumnAboutProductionList;
