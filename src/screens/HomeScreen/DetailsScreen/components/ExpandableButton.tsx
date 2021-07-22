import React, { useState } from 'react';
import { View, TouchableHighlight, Image, StyleSheet } from 'react-native';

import { scaleSize } from '@utils/scaleSize';

import RohText from '@components/RohText';

type Props = {
  icon: any;
  text: string;
  focusCallback: () => void;
  onPress?: (val: boolean) => void;
};

const ExpandableButton: React.FC<Props> = ({
  icon,
  text,
  focusCallback,
  onPress,
}) => {
  const [isButtonActive, setFocus] = useState(false);

  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlight
        style={isButtonActive ? styles.buttonActive : styles.button}
        onFocus={() => {
          focusCallback();
          setFocus(true);
        }}
        onBlur={() => setFocus(false)}
        onPress={() => onPress && onPress(true)}
        accessible>
        <View style={styles.wrapper}>
          <Image style={styles.icon} source={icon} />
          {isButtonActive && <RohText style={styles.text}>{text}</RohText>}
        </View>
      </TouchableHighlight>
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
    width: scaleSize(70),
    height: scaleSize(70),
    borderColor: 'white',
    borderWidth: 1,
  },
  buttonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(70),
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

export default ExpandableButton;
