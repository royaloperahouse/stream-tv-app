import { FlatList, View, StyleSheet, LogBox, LayoutChangeEvent } from "react-native";
import RohText from "@components/RohText";
import { scaleSize } from "@utils/scaleSize";
import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { Colors } from "@themes/Styleguide";

type TMultiColumnRoleNameListProps = {
    data: Array<{role: string, name: string}>,
    numColumns: number,
    setItemHeight(height: number): void
    setContainerHeight(height: number): void
};

export type TMultiColumnRoleNameListRef = {
  scrollToEnd?: () => void;
  scrollToTop?: () => void;
  setHasMore?: () => void;
};

const MultiColumnRoleNameList = React.forwardRef<any,TMultiColumnRoleNameListProps> (
  (props, ref) => {
    const {
      data,
      numColumns,
      setItemHeight,
      setContainerHeight
    } = props;

    const flatlistRef = useRef<FlatList>(null);
    useEffect(() => {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        scrollToEnd: () => {
          if (flatlistRef.current) {
            flatlistRef.current.scrollToEnd();
          }
        },
        scrollToTop: () => {
          if (flatlistRef.current) {
            flatlistRef.current.scrollToOffset({ offset: 0 });
          }
        },
      }),
      [],
    );

    return (
      <FlatList
        ref={flatlistRef}
        onLayout={(event: LayoutChangeEvent) => setContainerHeight(event.nativeEvent.layout.height)}
        numColumns={numColumns}
        style={styles.list}
        data={data}
        keyExtractor={item => item.role}
        renderItem = {({ item }) => (
          <View
            style={[styles.elementContainer, {maxWidth: `${1/numColumns * 100}%`}]}
            onLayout={(event: LayoutChangeEvent) => setItemHeight(event.nativeEvent.layout.height)}>
            <RohText style={styles.role}>{item.role}</RohText>
            <RohText style={styles.name}>{item.name}</RohText>
          </View>
        )}
      />
      );
    });

    const styles = StyleSheet.create({
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
        marginBottom: scaleSize(32),
        flex: 1,
      },
      list: {
        flex: 1
      }
    });

    export default MultiColumnRoleNameList;