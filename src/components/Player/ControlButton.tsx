import React, { useState } from 'react';
import { View, TouchableHighlight, Image, StyleSheet } from 'react-native';

import { scaleSize } from '@utils/scaleSize';

import RohText from '@components/RohText';

import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';

type Props = {
  icon: any;
  text?: string;
  expand?: boolean,
  onPress?: (val: boolean) => void;
  onFocus?: () => void;
};

const ControlButton: React.FC<Props> = ({
  icon,
  text,
  expand,
  onPress,
  onFocus,
}) => {
  const [isButtonActive, setFocus] = useState(false);

  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlightWrapper
        style={styles.button}
        styleFocused={expand ? styles.buttonActiveExpand : styles.buttonActive}
        onFocus={() => { setFocus(true); onFocus && onFocus(); }}
        onBlur={() => setFocus(false)}
        onPress={() => onPress && onPress(true)}
        accessible>
        <View style={styles.wrapper}>
          <Image style={styles.icon} source={icon} />
          {isButtonActive && expand && <RohText style={styles.text}>{text}</RohText>}
        </View>
      </TouchableHighlightWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: scaleSize(32),
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
    width: null,
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
