import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import WithLogo from '@components/WithLogo';
import WithBackground from '@components/WithBackground';
import { useSelector, shallowEqual } from 'react-redux';
import {
  devicePinSelector,
  deviceAuthenticatedErrorSelector,
} from '@services/store/auth/Selectors';

type TLoginScreenProps = {};

const LoginScreen: React.FC<TLoginScreenProps> = () => {
  const devicePin = useSelector(devicePinSelector, shallowEqual);
  const deviceAuthenticatedError = useSelector(
    deviceAuthenticatedErrorSelector,
    shallowEqual,
  );

  return (
    <WithBackground>
      <WithLogo>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <RohText style={styles.header}>Follow these steps on your</RohText>
            <RohText style={styles.header}>Computer, tablet or mobile</RohText>
            <View style={styles.websiteContainer}>
              <View style={styles.addressContainer}>
                <RohText style={styles.regular}>Go to: </RohText>
                <RohText style={styles.address}>ROH.ORG.UK/PIN</RohText>
              </View>
              <RohText style={styles.regular}>
                Then enter the activation code when prompted
              </RohText>

              <RohText style={styles.pin}>
                {devicePin || 'Pin not found'}
              </RohText>
              <RohText style={styles.regular}>
                {deviceAuthenticatedError}
              </RohText>
            </View>
          </View>
        </View>
      </WithLogo>
    </WithBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: scaleSize(200),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    flex: 2,
  },
  websiteContainer: {
    marginTop: scaleSize(60),
    alignItems: 'center',
  },
  header: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: scaleSize(54),
  },
  blue: {
    color: Colors.defaultBlue,
    textTransform: 'uppercase',
    fontSize: scaleSize(26),
  },
  regular: {
    color: 'white',
    fontSize: scaleSize(32),
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: scaleSize(20),
  },
  address: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: scaleSize(38),
  },
  pin: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: scaleSize(120),
  },
});

export default LoginScreen;
