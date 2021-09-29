import React from 'react';
import { View, StyleSheet } from 'react-native';
import Down from '@assets/svg/eventDetails/Down.svg';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';

type Props = {
  text?: string;
};

const GoDown: React.FC<Props> = ({ text = '' }) => {
  return (
    <View style={styles.container}>
      <Down width={scaleSize(50)} height={scaleSize(50)} />
      <RohText style={styles.text}>{text?.toUpperCase()}</RohText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    opacity: 0.7,
    alignItems: 'center',
  },
  text: {
    color: '#F1F1F1',
    fontSize: scaleSize(24),
    marginLeft: scaleSize(20),
  },
});

export default GoDown;
