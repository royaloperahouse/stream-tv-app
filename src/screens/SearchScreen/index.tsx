import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import VirtualKeyboard, {
  DisplayForVirtualKeyboard,
} from '@components/VirtualKeyboard';

type TSearchScreenProps = {};
const SearchScreen: React.FC<TSearchScreenProps> = () => {
  const vkRef = useRef();
  return (
    <View style={styles.root}>
      <RohText style={styles.rootText} bold>
        Search Screen will be soon
      </RohText>
      <View style={{ marginTop: scaleSize(20) }}>
        <View style={{ marginBottom: scaleSize(30) }}>
          <DisplayForVirtualKeyboard ref={vkRef} />
        </View>
        <VirtualKeyboard ref={vkRef} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rootText: {
    color: 'white',
    fontSize: scaleSize(48),
  },
});

export default SearchScreen;
