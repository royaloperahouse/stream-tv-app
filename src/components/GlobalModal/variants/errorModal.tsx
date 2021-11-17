import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import { TGlobalModalContentProps } from '@services/types/globalModal';

const ErrorModal: React.FC<TGlobalModalContentProps> = ({
  title = 'Error',
  subtitle = '',
  confirmActionHandler = () => {},
}) => {
  return (
    <View style={styles.root}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <RohText style={styles.headerText}>{title}</RohText>
        </View>
        {subtitle && (
          <View style={styles.subHeader}>
            <RohText style={styles.subHeaderText}>{subtitle}</RohText>
          </View>
        )}

        <View>
          <TouchableHighlightWrapper
            style={styles.primaryActionButton}
            hasTVPreferredFocus
            canMoveDown={false}
            canMoveLeft={false}
            canMoveRight={false}
            canMoveUp={false}
            onPress={confirmActionHandler}>
            <View style={styles.primaryActionButtonContainer}>
              <RohText style={styles.primaryActionButtonText}>
                Try again
              </RohText>
            </View>
          </TouchableHighlightWrapper>
        </View>
      </View>
    </View>
  );
};
export default ErrorModal;

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
  },
  headerText: {
    fontSize: scaleSize(54),
    lineHeight: scaleSize(67),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
    textTransform: 'uppercase',
  },
  subHeader: {
    marginBottom: scaleSize(40),
  },
  subHeaderText: {
    fontSize: scaleSize(28),
    lineHeight: scaleSize(40),
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
