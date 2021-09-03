import React from 'react';
import { View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import { useFeature } from 'flagged';

type TOperaMusicScreenProps = {};
const OperaMusicScreen: React.FC<TOperaMusicScreenProps> = () => {
  const hasOpera = useFeature('hasOpera');

  return (
    <View style={styles.root}>
      {
        hasOpera ? 
        <RohText style={styles.rootText} bold>
          Activated: Opera & Music Screen
        </RohText> :
        <RohText style={styles.rootText} bold>
          Opera & Music Screen coming soon
        </RohText>
      }
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
