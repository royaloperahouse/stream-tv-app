import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
import { TGlobalModalContentProps } from '@services/types/globalModal';
import Spinner from 'react-native-spinkit';

const RentalStateStatusModal: React.FC<TGlobalModalContentProps> = ({
  title = '',
}) => {
  const headerText = `Checking rental status of ${title}`;
  useLayoutEffect(() => {
    const handleBackButtonClick = () => {
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);
  return (
    <View style={styles.root}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <RohText style={styles.headerText}>{headerText}</RohText>
        </View>
        <View style={styles.subHeader}>
          <Spinner
            isVisible
            size={scaleSize(158)}
            type="ChasingDots"
            color={Colors.tVMidGrey}
          />
        </View>
      </View>
    </View>
  );
};
export default RentalStateStatusModal;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingLeft: scaleSize(200),
    justifyContent: 'center',
  },
  contentContainer: {
    width: scaleSize(1187),
  },
  header: {
    marginBottom: scaleSize(40),
    flexDirection: 'row',
  },
  headerText: {
    fontSize: scaleSize(54),
    lineHeight: scaleSize(67),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
    textTransform: 'uppercase',
  },
  subHeader: {
    marginBottom: scaleSize(140),
    alignItems: 'center',
  },
  subHeaderText: {
    fontSize: scaleSize(28),
    lineHeight: scaleSize(30),
    color: Colors.defaultTextColor,
  },
  primaryActionButton: {
    width: scaleSize(358),
    height: scaleSize(80),
    backgroundColor: Colors.streamPrimary,
  },
  primaryActionButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionButtonText: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(30),
    color: Colors.defaultTextColor,
  },
});
