import { FlatList, View, StyleSheet, LogBox } from "react-native";
import RohText from "@components/RohText";
import { scaleSize } from "@utils/scaleSize";
import React, { useEffect } from 'react';

type MultiColumnRoleNameListProps = {
    data: Array<{role: string, name: string}>,
    numColumns: number
};

const MultiColumnRoleNameList: React.FC<MultiColumnRoleNameListProps> = ({
    data,
    numColumns
  }) => {
    useEffect(() => {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])
    return (
      <FlatList
        numColumns={numColumns}
        style={{ flex: 1 }}
        data={data}
        keyExtractor={item => item.role}
        renderItem = {({ item }) => (
        <View style={styles.elementContainer}>
          <RohText style={styles.role}>{item.role}</RohText>
          <RohText style={styles.name}>{item.name}</RohText>
        </View>
        )}
      />
      );
    };

    const styles = StyleSheet.create({
    role: {
        fontSize: scaleSize(20),
        color: '#7E91B4',
        textTransform: 'uppercase',
      },
      name: {
        color: 'white',
        fontSize: scaleSize(20),
      },
      elementContainer: {
        marginBottom: scaleSize(32),
        flex: 1,
        maxWidth: `${1/3 * 100}%`
      },
    });

    export default MultiColumnRoleNameList;