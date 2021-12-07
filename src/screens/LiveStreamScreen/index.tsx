import React from 'react';
import { View, StyleSheet } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import analytics from '@react-native-firebase/analytics';

type TLiveStreamScreenProps = {};
const LiveStreamScreen: React.FC<TLiveStreamScreenProps> = () => {
  analytics().logScreenView({
    screen_class: 'LiveStreamScreen',
    screen_name: 'Live Stream Screen'
  });
  return (
    <View style={styles.root}>
      <RohText style={styles.rootText} bold>
        LiveStream Screen coming soon
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
