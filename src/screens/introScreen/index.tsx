import React from 'react';
import {
  TouchableHighlight,
  View,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Colors, Images } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import { startLoginLoop } from '@services/store/auth/Slices';
import { TouchableOpacity } from 'react-native-gesture-handler';

type TIntroScreenProps = {};

const IntroScreen: React.FC<TIntroScreenProps> = () => {
  const dispatch = useDispatch();
  const getStarted = () => {
    dispatch(startLoginLoop());
  };
  return (
    <ImageBackground
      style={styles.containerBackground}
      source={Images.introBackground}>
      <View style={styles.container}>
        <Image style={styles.logo} source={Images.ROHLogo} />
        <RohText style={styles.welcome}>Welcome to ROH Stream</RohText>
        <View style={styles.descriptionContainer}>
          <RohText style={styles.description}>
            Unlimited access to our rich
          </RohText>
          <RohText style={styles.description}>
            library of opera and ballet
          </RohText>
        </View>
        <TouchableHighlight
          underlayColor={Colors.defaultBlue}
          onPress={getStarted}
          style={styles.button}
          hasTVPreferredFocus>
          <RohText style={styles.buttonText}>Get started</RohText>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColorTransparent,
  },
  logo: {
    marginTop: scaleSize(48),
    width: scaleSize(167),
    height: scaleSize(232),
  },
  welcome: {
    marginTop: scaleSize(174),
    color: 'white',
    textTransform: 'uppercase',
    fontSize: scaleSize(38),
  },
  descriptionContainer: {
    marginTop: scaleSize(18),
  },
  description: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: scaleSize(72),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.defaultBlue,
    width: scaleSize(445),
    height: scaleSize(84),
    marginTop: scaleSize(182),
  },
  buttonText: {
    color: 'white',
    fontSize: scaleSize(24),
  },
});

export default IntroScreen;
