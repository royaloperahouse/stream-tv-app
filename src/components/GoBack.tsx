import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { Icons } from '@themes/Styleguide';
import { navMenuManager } from '@components/NavMenu';
import { scaleSize } from '@utils/scaleSize';
import { useNavigation } from '@react-navigation/native';

type TGoBackProps = {};

const GoBack: React.FC<TGoBackProps> = () => {
  const navigation = useNavigation();
  const onPressHandler = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      navMenuManager.showNavMenu();
    }
  };
  return (
    <TouchableHighlight onPress={onPressHandler}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Image style={styles.back} source={Icons.back} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
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
