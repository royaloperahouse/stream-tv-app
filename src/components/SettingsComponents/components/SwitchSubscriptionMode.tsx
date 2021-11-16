import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toggleSubscriptionMode } from '@services/store/auth/Slices';
import { subscribedModeSelector } from '@services/store/auth/Selectors';

type TSwitchSubscriptionMode = {
  listItemGetNode?: () => number;
};

const SwitchSubscriptionMode: React.FC<TSwitchSubscriptionMode> = ({
  listItemGetNode,
}) => {
  const dispatch = useDispatch();
  const fullSubscription: boolean = useSelector(
    subscribedModeSelector,
    shallowEqual,
  );
  const switchSubscriptionModeActionHandler = () =>
    dispatch(toggleSubscriptionMode());
  const actionButtonText = `Switch to ${
    fullSubscription ? 'non-subscribed' : 'subscribed'
  } mode`;
  const subscriptionInfoText = `You are ${
    fullSubscription ? 'subscribed' : 'non-subscribed'
  }`;
  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <RohText style={styles.titleText}>Switch of Subscription Mode</RohText>
      </View>
      <View style={styles.descriptionContainer}>
        <RohText style={styles.descriptionText}>{subscriptionInfoText}</RohText>
      </View>
      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtonContainer}>
          <TouchableHighlightWrapper
            canMoveRight={false}
            canMoveUp={false}
            canMoveDown={false}
            nextFocusLeft={
              typeof listItemGetNode === 'function'
                ? listItemGetNode()
                : undefined
            }
            onPress={switchSubscriptionModeActionHandler}
            style={styles.actionButtonDefault}
            styleFocused={styles.actionButtonFocus}>
            <View style={styles.actionButtonContentContainer}>
              <RohText style={styles.actionButtonText}>
                {actionButtonText}
              </RohText>
            </View>
          </TouchableHighlightWrapper>
        </View>
      </View>
    </View>
  );
};

export default SwitchSubscriptionMode;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: scaleSize(42),
    marginLeft: scaleSize(80),
    marginRight: scaleSize(338),
  },
  titleContainer: {
    marginBottom: scaleSize(34),
  },
  titleText: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.tVMidGrey,
  },
  descriptionContainer: {
    marginBottom: scaleSize(60),
  },
  descriptionText: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(32),
    color: Colors.defaultTextColor,
  },
  commonQuestionContainer: {
    marginBottom: scaleSize(40),
  },
  commonQuestionText: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    color: Colors.defaultTextColor,
    letterSpacing: scaleSize(1),
    textTransform: 'uppercase',
  },
  actionButtonContainer: {
    minWidth: scaleSize(358),
    minHeight: scaleSize(80),
    alignItems: 'center',
  },
  actionButtonContentContainer: {
    minWidth: scaleSize(358),
    minHeight: scaleSize(80),
    alignItems: 'center',
    paddingHorizontal: scaleSize(25),
    paddingVertical: scaleSize(25),
  },
  actionButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(30),
    color: Colors.defaultTextColor,
  },
  actionButtonDefault: {
    borderWidth: scaleSize(2),
    borderColor: Colors.defaultTextColor,
  },
  actionButtonFocus: {
    borderColor: Colors.streamPrimary,
    backgroundColor: Colors.streamPrimary,
  },
});
