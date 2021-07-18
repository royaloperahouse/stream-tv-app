import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import { Colors, Images } from '@themes/Styleguide';

type TWithBackgroundProps = {};

const WithBackground: React.FC<TWithBackgroundProps> = ({ children }) => {
  return (
    <ImageBackground
      style={styles.containerBackground}
      source={Images.defaultBackground}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    resizeMode: 'cover',
  },
});

export default WithBackground;
