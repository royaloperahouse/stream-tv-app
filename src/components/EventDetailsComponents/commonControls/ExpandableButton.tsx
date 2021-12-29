import React, { useRef, RefObject, forwardRef, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';

type Props = {
  Icon: any;
  text: string;
  focusCallback: () => void;
  onPress?: (val?: RefObject<TouchableHighlight>) => void;
  hasTVPreferredFocus?: boolean;
};

const ExpandableButton = forwardRef<any, Props>(
  (
    { Icon, text, focusCallback, onPress, hasTVPreferredFocus = false },
    ref,
  ) => {
    const buttonRef = useRef<TTouchableHighlightWrapperRef>(null);
    useLayoutEffect(() => {
      if (ref !== null && typeof buttonRef.current?.getRef === 'function') {
        ref.current = buttonRef.current.getRef().current;
      }
    }, [ref]);
    return (
      <View style={styles.buttonContainer}>
        <TouchableHighlightWrapper
          ref={buttonRef}
          canMoveRight={false}
          hasTVPreferredFocus={hasTVPreferredFocus}
          style={styles.button}
          styleFocused={styles.buttonActive}
          onFocus={() => {
            focusCallback();
          }}
          onPress={() => {
            if (typeof onPress === 'function') {
              onPress(
                typeof buttonRef.current?.getRef === 'function'
                  ? buttonRef.current.getRef()
                  : undefined,
              );
            }
          }}>
          <View style={styles.wrapper}>
            {Icon && <Icon width={scaleSize(40)} height={scaleSize(40)} />}
            {
              <RohText style={styles.text} numberOfLines={1}>
                {text}
              </RohText>
            }
          </View>
        </TouchableHighlightWrapper>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: scaleSize(32),
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    alignItems: 'center',
    height: scaleSize(70),
    flexDirection: 'row',
    opacity: 0.5,
  },
  buttonActive: {
    paddingLeft: scaleSize(30),
    opacity: 1,
    backgroundColor: Colors.streamPrimary,
  },
  text: {
    color: 'white',
    fontSize: scaleSize(24),
    marginLeft: scaleSize(14),
  },
});

export default ExpandableButton;
