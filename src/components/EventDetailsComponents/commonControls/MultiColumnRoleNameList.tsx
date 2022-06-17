import { VirtualizedList, View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import React, { useCallback, useRef } from 'react';
import { Colors } from '@themes/Styleguide';
import { useSplitingOnColumns } from '@hooks/useSplitingOnColumns';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import ScrollingPagination, {
  TScrolingPaginationRef,
} from '@components/ScrollingPagination';
import { useFocusEffect } from '@react-navigation/native';

type TMultiColumnRoleNameListProps = {
  data: Array<{ role: string; name: string }>;
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

const MultiColumnRoleNameList: React.FC<
  TMultiColumnRoleNameListProps
> = props => {
  const { data, columnHeight, columnWidth, setFocusRef = () => {}, id } = props;
  const { onLayoutHandler, splitedItems, splited } = useSplitingOnColumns({
    columnHeight,
    itemsForSpliting: data,
  });
  const scrpllingPaginationRef = useRef<TScrolingPaginationRef>(null);
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
            key={item.role}
            style={[styles.elementContainer, styles.elementContainerAbsolute]}
            onLayout={onLayoutHandler('role', item.role)}>
            <RohText style={styles.role}>{item.role}</RohText>
            <RohText style={styles.name}>{item.name}</RohText>
          </View>
        ))}
      </View>
    );
  }
  if (splitedItems.length < 3) {
    return (
      <TouchableHighlightWrapper canMoveRight={false} ref={focusedComponentRef}>
        <View style={[styles.towColumnsList, { height: columnHeight }]}>
          {splitedItems.map((column, index) => (
            <View style={styles.columnContainer} key={index}>
              {column.map(ceil => (
                <View style={styles.elementContainer} key={ceil.role}>
                  <RohText style={styles.role}>{ceil.role}</RohText>
                  <RohText style={styles.name}>{ceil.name}</RohText>
                </View>
              ))}
            </View>
          ))}
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
          item: TMultiColumnRoleNameListProps['data'];
        }) => (
          <TouchableHighlightWrapper
            style={[styles.column, { height: columnHeight }]}
            canMoveRight={index !== splitedItems.length - 1}
            onFocus={() => {
              if (
                typeof scrpllingPaginationRef.current?.setCurrentIndex ===
                'function'
              ) {
                scrpllingPaginationRef.current.setCurrentIndex(index);
              }
            }}
            ref={index === 0 ? focusedComponentRef : undefined}
            styleFocused={styles.columnInFocus}>
            <View style={styles.columnContainer}>
              {item.map(ceil => (
                <View style={styles.elementContainer} key={ceil.role}>
                  <RohText style={styles.role}>{ceil.role}</RohText>
                  <RohText style={styles.name}>{ceil.name}</RohText>
                </View>
              ))}
            </View>
          </TouchableHighlightWrapper>
        )}
      />
      <View style={styles.paginationContainer}>
        <ScrollingPagination
          ref={scrpllingPaginationRef}
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
  role: {
    fontSize: scaleSize(20),
    color: Colors.midGrey,
    textTransform: 'uppercase',
  },
  name: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(20),
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
    marginTop: scaleSize(200),
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
});

export default MultiColumnRoleNameList;
