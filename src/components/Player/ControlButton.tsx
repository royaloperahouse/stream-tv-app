import React, { useState, forwardRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { scaleSize } from '@utils/scaleSize';

import RohText from '@components/RohText';

import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';

type Props = {
  icon: any;
  text?: string;
  expand?: boolean;
  onPress?: (val: boolean) => void;
  onFocus?: () => void;
  hasTVPreferredFocus?: boolean;
};

const ControlButton = forwardRef<any, Props>((props, ref) => {
  const [isButtonActive, setFocus] = useState(false);
  const {
    icon,
    text,
    expand,
    onPress,
    onFocus,
    hasTVPreferredFocus = false,
  } = props;
  const onFocusHandler = () => {
    setFocus(true);
    if (typeof onFocus === 'function') {
      onFocus();
    }
  };

  const onBlurHandler = () => setFocus(false);

  const onPressHandler = () => {
    if (typeof onPress === 'function') {
      onPress(true);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlightWrapper
        ref={ref}
        style={styles.button}
        styleFocused={expand ? styles.buttonActiveExpand : styles.buttonActive}
        hasTVPreferredFocus={hasTVPreferredFocus}
        onFocus={onFocusHandler}
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
    width: scaleSize(72),
    height: scaleSize(72),
  },
  buttonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(72),
    height: scaleSize(72),
    backgroundColor: '#6990ce',
    paddingLeft: scaleSize(30),
    paddingRight: scaleSize(30),
  },
  buttonActiveExpand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    height: scaleSize(72),
    backgroundColor: '#6990ce',
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
