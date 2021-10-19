import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

type TSettingsNavMenuItemProps = {
  title: string;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};
const SettingsNavMenuItem: React.FC<TSettingsNavMenuItemProps> = props => {
  const { title, canMoveUp, canMoveDown } = props;
  const [hasFocus, setHasFocus] = useState(false);

  const focusHandler = () => {
    setHasFocus(true);
  };

  const blurHandler = () => {
    setHasFocus(false);
  };

  return (
    <TouchableHighlightWrapper
      onFocus={focusHandler}
      onBlur={blurHandler}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      style={styles.muButtonInActive}
      styleFocused={styles.menuButtonActive}>
      <View style={styles.root}>
        <RohText style={hasFocus ? styles.buttonTitle : styles.inActiveTitle}>
          {title}
        </RohText>
      </View>
    </TouchableHighlightWrapper>
  );
};

export default SettingsNavMenuItem;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: scaleSize(25),
  },
  menuButtonActive: {
    backgroundColor: Colors.streamPrimary,
    paddingLeft: scaleSize(20),
  },
  menuButtonBlur: {
    backgroundColor: Colors.midGrey,
    paddingLeft: scaleSize(20),
  },
  muButtonInActive: {
    paddingLeft: scaleSize(25),
  },
  buttonTitle: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
  inActiveTitle: {
    opacity: 0.7,
  },
});
