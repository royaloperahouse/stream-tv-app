import React, { useState, forwardRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { scaleSize } from '@utils/scaleSize';

import RohText from '@components/RohText';

import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';

type Props = {
  icon: any;
  text?: string;
  onPress?: (val: boolean) => void;
  onFocus?: () => void;
  hasTVPreferredFocus?: boolean;
  getControlPanelVisible: () => boolean;
  canMoveUp?: boolean | undefined;
  canMoveLeft?: boolean | undefined;
  canMoveRight?: boolean | undefined;
  canMoveDown?: boolean | undefined;
  nextFocusDown?: number;
  nextFocusUp?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
};

const ControlButton = forwardRef<any, Props>((props, ref) => {
  const [isButtonActive, setFocus] = useState(false);
  const {
    icon,
    text,
    onPress,
    onFocus,
    hasTVPreferredFocus = false,
    getControlPanelVisible,
    canMoveUp,
    canMoveLeft,
    canMoveRight,
    canMoveDown,
    nextFocusDown,
    nextFocusUp,
    nextFocusLeft,
    nextFocusRight
  } = props;
  const onFocusHandler = () => {
    setFocus(true);
    if (typeof onFocus === 'function') {
      onFocus();
    }
  };
  const onBlurHandler = () => setFocus(false);

  const onPressHandler = () => {
    if (!getControlPanelVisible()) {
      return;
    }
    if (typeof onPress === 'function') {
      onPress(true);
    }
  };
  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlightWrapper
        underlayColor={Colors.defaultBlue}
        ref={ref}
        style={styles.button}
        styleFocused={
          text ? styles.buttonActiveWithPadding : styles.buttonActive
        }
        hasTVPreferredFocus={hasTVPreferredFocus}
        canMoveUp={canMoveUp}
        canMoveLeft={canMoveLeft}
        canMoveRight={canMoveRight}
        canMoveDown={canMoveDown}
        onFocus={onFocusHandler}
        nextFocusDown={nextFocusDown}
        nextFocusUp={nextFocusUp}
        nextFocusLeft={nextFocusLeft}
        nextFocusRight={nextFocusRight}
        onBlur={onBlurHandler}
        onPress={onPressHandler}>
        <View style={styles.wrapper}>
          <Image style={styles.icon} source={icon} />
          {isButtonActive && Boolean(text) && (
            <RohText style={styles.text}>{text}</RohText>
          )}
        </View>
      </TouchableHighlightWrapper>
    </View>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: scaleSize(32),
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scaleSize(72),
    height: scaleSize(72),
  },
  buttonActive: {
    flexDirection: 'row',
  },
  buttonActiveWithPadding: {
    flexDirection: 'row',
    paddingLeft: scaleSize(30),
    paddingRight: scaleSize(30),
  },
  text: {
    color: 'white',
    fontSize: scaleSize(24),
    marginLeft: scaleSize(14),
  },
  icon: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
});

export default ControlButton;
