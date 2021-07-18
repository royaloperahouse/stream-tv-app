import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { Images } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';

type TWithLogoProps = {};

const WithLogo: React.FC<TWithLogoProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={Images.streamLogo} />
      </View>
      <View style={styles.mainContentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  logo: {
    position: 'absolute',
    width: scaleSize(247),
    height: scaleSize(45),
    top: scaleSize(48),
    left: scaleSize(60),
  },
  mainContentContainer: {
    flex: 1,
  },
});

export default WithLogo;
