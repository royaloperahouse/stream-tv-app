import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  clearEventState,
  getEventListLoopStop,
} from '@services/store/events/Slices';
import {
  clearAuthState,
  endLoginLoop,
  endFullSubscriptionLoop,
} from '@services/store/auth/Slices';
import { pinUnlink } from '@services/apiClient';
import { clearPrevSearchList } from '@services/previousSearch';
import { clearListOfBitmovinSavedPosition } from '@services/bitMovinPlayer';
import { clearMyList } from '@services/myList';

type TSignOutProps = {
  listItemGetNode?: () => number;
};

const SignOut: React.FC<TSignOutProps> = ({ listItemGetNode }) => {
  const dispatch = useDispatch();
  const signOutActionHandler = () =>
    pinUnlink()
      .then(response => {
        if (response.status !== 204) {
          throw Error('Something went wrong');
        }
        dispatch(getEventListLoopStop());
        dispatch(endLoginLoop());
        dispatch(endFullSubscriptionLoop());
        dispatch(clearAuthState());
        dispatch(clearEventState());
        return Promise.all([
          clearPrevSearchList(),
          clearListOfBitmovinSavedPosition(),
          clearMyList(),
        ]);
      })
      .catch(console.log);
  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <RohText style={styles.titleText}>SIGN OUT OF THIS DEVICE</RohText>
      </View>
      <View style={styles.descriptionContainer}>
        <RohText style={styles.descriptionText}>
          Choosing to sign out of this device will stop this device being paired
          with your ROH account. To access content on this device again, you
          will need to pair.
        </RohText>
      </View>
      <View style={styles.commonQuestionContainer}>
        <RohText style={styles.commonQuestionText}>
          Are you sure you want to sign out?
        </RohText>
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
            onPress={signOutActionHandler}
            style={styles.actionButtonDefault}
            styleFocused={styles.actionButtonFocus}>
            <View style={styles.actionButtonContentContainer}>
              <RohText style={styles.actionButtonText}>
                I want to sign out
              </RohText>
            </View>
          </TouchableHighlightWrapper>
        </View>
      </View>
    </View>
  );
};

export default SignOut;

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
