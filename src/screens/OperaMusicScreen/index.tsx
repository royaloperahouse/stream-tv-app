import React from 'react';
import { View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';

type TOperaMusicScreenProps = {};
const OperaMusicScreen: React.FC<TOperaMusicScreenProps> = () => {
  return (
    <View style={styles.root}>
      <RohText style={styles.rootText} bold>
        Opera & Music Screen coming soon
      </RohText>
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

export default OperaMusicScreen;
