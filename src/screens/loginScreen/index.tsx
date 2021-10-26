import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
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
          <View style={styles.leftContainer}>
            <RohText style={styles.header}>Follow these steps on your</RohText>
            <RohText style={styles.header}>Computer, tablet or mobile</RohText>

            <View style={styles.QRContainer}>
              <RohText style={styles.blue}>QR Code</RohText>
              <RohText style={styles.regular}>
                Scan the QR code with your phone's camera
              </RohText>
            </View>

            <View style={styles.orContainer}>
              <RohText style={styles.address}>OR</RohText>
            </View>

            <View style={styles.websiteContainer}>
              <RohText style={styles.blue}>Website</RohText>

              <View style={styles.addressContainer}>
                <RohText style={styles.regular}>Go to: </RohText>
                <RohText style={styles.address}>ROH.ORG.UK/PIN</RohText>
              </View>
              <RohText style={styles.regular}>
                Then enter the activation code when prompted
              </RohText>

              <RohText style={styles.pin}>
                {devicePin || 'pin did not found'}
              </RohText>
              <RohText style={styles.regular}>
                {deviceAuthenticatedError}
              </RohText>
            </View>
          </View>
          <View style={styles.rightContainer}>
            {Boolean(devicePin) && (
              <QRCode
                quietZone={5}
                size={scaleSize(380)}
                value={`https://www.roh.org.uk/pin?pin=${devicePin}`}
              />
            )}
          </View>
        </View>
      </WithLogo>
    </WithBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scaleSize(200),
    marginLeft: scaleSize(200),
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    alignItems: 'flex-start',
    flex: 2,
  },
  rightContainer: {
    marginTop: scaleSize(203),
    alignItems: 'flex-start',
    flex: 1,
  },
  QRContainer: {
    marginTop: scaleSize(69),
  },
  orContainer: {
    marginTop: scaleSize(60),
  },
  websiteContainer: {
    marginTop: scaleSize(60),
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
