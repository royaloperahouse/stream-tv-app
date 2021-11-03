import React from 'react';
import { View, StyleSheet } from 'react-native';
import Logo from '@assets/svg/StreamLogo.svg';
import { scaleSize } from '@utils/scaleSize';

type TWithLogoProps = {};

const WithLogo: React.FC<TWithLogoProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={scaleSize(219)} height={scaleSize(60)} />
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
    top: scaleSize(48),
    left: scaleSize(60),
    width: scaleSize(219),
    height: scaleSize(60),
  },
  mainContentContainer: {
    flex: 1,
  },
});

export default WithLogo;
