import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';

type Props = {
  Icon: any;
  text: string;
  focusCallback: () => void;
  onPress?: (val: boolean) => void;
  hasTVPreferredFocus?: boolean;
};

const ExpandableButton: React.FC<Props> = ({
  Icon,
  text,
  focusCallback,
  onPress,
  hasTVPreferredFocus = false,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlightWrapper
        underlayColor={Colors.defaultBlue}
        canMoveRight={false}
        hasTVPreferredFocus={hasTVPreferredFocus}
        style={styles.button}
        styleFocused={styles.buttonActive}
        onFocus={() => {
          focusCallback();
        }}
        onPress={() => {
          if (typeof onPress === 'function') {
            onPress(true);
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
    backgroundColor: Colors.defaultBlue,
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
