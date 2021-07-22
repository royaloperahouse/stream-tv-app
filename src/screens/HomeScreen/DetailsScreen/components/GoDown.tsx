import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { Icons } from '@themes/Styleguide';

import { scaleSize } from '@utils/scaleSize';

import RohText from '@components/RohText';

type Props = {
  text: string;
};

const GoDown: React.FC<Props> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.down} source={Icons.down} />
      <RohText style={styles.text}>{text}</RohText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    opacity: 0.7,
  },
  buttonContainer: {},
  down: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  text: {
    color: '#F1F1F1',
    fontSize: scaleSize(24),
    marginLeft: scaleSize(20),
    textTransform: 'uppercase',
  },
});

export default GoDown;
