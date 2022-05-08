import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getVersion } from 'react-native-device-info';

type TAppVersionProps = {};

const AppVersion: React.FC<TAppVersionProps> = () => {
  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <RohText style={styles.titleText}>APP VERSION</RohText>
      </View>
      <View style={styles.appVersionContainer}>
        <RohText style={styles.appVersionText}>{getVersion()}</RohText>
      </View>
    </View>
  );
};

export default AppVersion;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: scaleSize(42),
    marginLeft: scaleSize(80),
    marginRight: scaleSize(338),
  },
  titleContainer: {
    marginBottom: scaleSize(54),
  },
  titleText: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.tVMidGrey,
  },
  appVersionContainer: {
    minHeight: scaleSize(80),
    minWidth: scaleSize(486),
    backgroundColor: Colors.tvMidGreyWith50Alpha,
    justifyContent: 'center',
    paddingLeft: scaleSize(24),
  },
  appVersionText: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
    opacity: 1,
  },
});
