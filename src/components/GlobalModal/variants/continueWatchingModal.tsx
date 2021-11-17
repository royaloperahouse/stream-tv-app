import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import { TGlobalModalContentProps } from '@services/types/globalModal';

const СontinueWatchingModal: React.FC<TGlobalModalContentProps> = ({
  confirmActionHandler: primaryActionHandler = () => {},
  rejectActionHandler: secondaryActionHandler = () => {},
  videoTitle,
  fromTime,
}) => {
  const resumeButtonTitle = `Resume from ${fromTime}`;
  return (
    <View style={styles.root}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <RohText style={styles.headerText}>Continue watching?</RohText>
        </View>
        <View style={styles.subHeader}>
          <RohText style={styles.subHeaderText}>{videoTitle}</RohText>
        </View>
        <View>
          <TouchableHighlightWrapper
            style={styles.primaryActionButton}
            hasTVPreferredFocus
            canMoveLeft={false}
            canMoveRight={false}
            canMoveUp={false}
            styleFocused={styles.primaryActionButtonFocus}
            onPress={primaryActionHandler}>
            <View style={styles.primaryActionButtonContainer}>
              <RohText style={styles.primaryActionButtonText}>
                {resumeButtonTitle}
              </RohText>
            </View>
          </TouchableHighlightWrapper>
          <TouchableHighlightWrapper
            style={styles.secondaryActionButton}
            canMoveDown={false}
            canMoveLeft={false}
            canMoveRight={false}
            styleFocused={styles.secondaryActionButtonFocus}
            onPress={secondaryActionHandler}>
            <View style={styles.primaryActionButtonContainer}>
              <RohText style={styles.primaryActionButtonText}>
                Start from the beginning
              </RohText>
            </View>
          </TouchableHighlightWrapper>
        </View>
      </View>
    </View>
  );
};
export default СontinueWatchingModal;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: scaleSize(25),
    alignItems: 'center',
  },
  header: {
    marginBottom: scaleSize(40),
  },
  headerText: {
    fontSize: scaleSize(54),
    lineHeight: scaleSize(67),
    letterSpacing: scaleSize(1),
    color: Colors.tVMidGrey,
    textTransform: 'uppercase',
  },
  subHeader: {
    marginBottom: scaleSize(40),
  },
  subHeaderText: {
    fontSize: scaleSize(28),
    lineHeight: scaleSize(30),
    color: Colors.defaultTextColor,
  },
  primaryActionButton: {
    width: scaleSize(358),
    height: scaleSize(80),
    marginBottom: scaleSize(20),
    borderWidth: scaleSize(2),
    borderColor: Colors.defaultTextColor,
  },
  primaryActionButtonFocus: {
    borderColor: Colors.streamPrimary,
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
  secondaryActionButton: {
    width: scaleSize(358),
    height: scaleSize(80),
    borderWidth: scaleSize(2),
    borderColor: Colors.defaultTextColor,
  },
  secondaryActionButtonFocus: {
    borderColor: Colors.streamPrimary,
    backgroundColor: Colors.streamPrimary,
  },
  secondaryActionButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryActionButtonText: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(30),
    color: Colors.defaultTextColor,
  },
});
