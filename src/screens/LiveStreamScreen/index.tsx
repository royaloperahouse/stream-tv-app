import React from 'react';
import { View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';

type TLiveStreamScreenProps = {};
const LiveStreamScreen: React.FC<TLiveStreamScreenProps> = () => {
  return (
    <View style={styles.root}>
      <RohText style={styles.rootText} bold>
        LiveStream Screen will be soon
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

export default LiveStreamScreen;
