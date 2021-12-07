import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import VirtualKeyboard, {
  DisplayForVirtualKeyboard,
} from '@components/VirtualKeyboard';
import { Colors } from '@themes/Styleguide';
import SearchResult from '@components/SearchResult';

type TSearchScreenProps = {};
const SearchScreen: React.FC<TSearchScreenProps> = () => {
  const vkRef = useRef();

  return (
    <View style={styles.root}>
      <View style={styles.virtualKeyboardContainer}>
        <View style={styles.screenTitleContainer}>
          <RohText style={styles.screenTitleText}>SEARCH</RohText>
        </View>
        <View style={styles.searchTextDisplayContainer}>
          <DisplayForVirtualKeyboard ref={vkRef} />
        </View>
        <VirtualKeyboard ref={vkRef} />
      </View>
      <View style={styles.resultsContainer}>
        <SearchResult />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    height: Dimensions.get('window').height,
  },
  virtualKeyboardContainer: {
    width: scaleSize(486),
    height: '100%',
    marginRight: scaleSize(160),
  },
  searchTextDisplayContainer: {
    marginBottom: scaleSize(30),
  },
  screenTitleContainer: {
    width: '100%',
    height: scaleSize(315),
    paddingBottom: scaleSize(59),
    justifyContent: 'flex-end',
  },
  screenTitleText: {
    fontSize: scaleSize(54),
    lineHeight: scaleSize(67),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
  resultsContainer: {
    flex: 1,
  },
});

export default SearchScreen;
