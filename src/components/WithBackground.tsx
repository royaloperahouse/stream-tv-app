import React from 'react';
import { StyleSheet, ImageBackground, Dimensions } from 'react-native';

import { Colors, Images } from '@themes/Styleguide';

type TWithBackgroundProps = {
  url?: string;
};

const WithBackground: React.FC<TWithBackgroundProps> = ({ url, children }) => {
  const source = url ? { uri: url } : Images.defaultBackground;
  return (
    <ImageBackground style={styles.containerBackground} source={source}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerBackground: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.backgroundColor,
    resizeMode: 'cover',
  },
});

export default WithBackground;
