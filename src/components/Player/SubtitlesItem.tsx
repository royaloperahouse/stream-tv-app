import React, { useState, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';

import { scaleSize } from '@utils/scaleSize';

import RohText from '@components/RohText';

import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import SubtitlesNotSelect from '@assets/svg/player/SubtitlesNotSelect.svg';
import SubtitlesSelect from '@assets/svg/player/SubtitlesSelect.svg';

type Props = {
  text?: string;
  onPress?: (val: boolean) => void;
  hasTVPreferredFocus?: boolean;
  currentIndex: number;
  itemsLength: number;
};

const SubbtitlesItem = forwardRef<any, Props>((props, ref) => {
  const [isButtonActive, setFocus] = useState(false);
  const {
    text,
    onPress,
    hasTVPreferredFocus = false,
    currentIndex,
    itemsLength,
  } = props;
  const onFocusHandler = () => {
    setFocus(true);
  };
  const onBlurHandler = () => setFocus(false);

  const onPressHandler = () => {
    if (typeof onPress === 'function') {
      onPress(true);
    }
  };
  return (
    <TouchableHighlightWrapper
      underlayColor={Colors.subtitlesActiveBackground}
      ref={ref}
      style={styles.subtitleItemContainer}
      hasTVPreferredFocus={hasTVPreferredFocus}
      onFocus={onFocusHandler}
      canMoveLeft={false}
      canMoveRight={false}
      canMoveDown={currentIndex !== itemsLength - 1}
      canMoveUp={currentIndex !== 0}
      onBlur={onBlurHandler}
      onPress={onPressHandler}>
      <View style={styles.wrapper}>
        {isButtonActive ? (
          <SubtitlesSelect width={scaleSize(40)} height={scaleSize(40)} />
        ) : (
          <SubtitlesNotSelect width={scaleSize(40)} height={scaleSize(40)} />
        )}
        <RohText style={isButtonActive ? styles.text : styles.textInActive}>
          {text}
        </RohText>
      </View>
    </TouchableHighlightWrapper>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleItemContainer: {
    marginHorizontal: scaleSize(20),
    paddingHorizontal: scaleSize(20),
    height: scaleSize(80),
    paddingLeft: scaleSize(40),
  },
  text: {
    color: 'white',
    marginLeft: scaleSize(20),
    fontSize: scaleSize(24),
    lineHeight: scaleSize(30),
  },
  textInActive: {
    color: 'white',
    marginLeft: scaleSize(20),
    fontSize: scaleSize(24),
    lineHeight: scaleSize(30),
    opacity: 0.7,
  },
});

export default SubbtitlesItem;
