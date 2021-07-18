import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

import { Icons } from '@themes/Styleguide';

import { scaleSize } from '@utils/scaleSize';

type TGoBackProps = {};

const GoBack: React.FC<TGoBackProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Image style={styles.back} source={Icons.back} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: Dimensions.get('window').height,
    width: scaleSize(160),
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
});

export default GoBack;
