import React, { useRef, RefObject } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';

type Props = {
  Icon: any;
  text: string;
  focusCallback: () => void;
  onPress?: (val?: RefObject<TouchableHighlight>) => void;
  hasTVPreferredFocus?: boolean;
};

const ExpandableButton: React.FC<Props> = ({
  Icon,
  text,
  focusCallback,
  onPress,
  hasTVPreferredFocus = false,
}) => {
  const buttonRef = useRef<TTouchableHighlightWrapperRef>(null);
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
};

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
  },
  text: {
    color: 'white',
    fontSize: scaleSize(24),
    marginLeft: scaleSize(14),
  },
});

export default ExpandableButton;
