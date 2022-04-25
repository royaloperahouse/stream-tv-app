import React, {
  useRef,
  RefObject,
  forwardRef,
  useLayoutEffect,
  useState,
} from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import Spinner from 'react-native-spinkit';

type Props = {
  Icon: any;
  text: string;
  focusCallback?: (pressingHandler?: () => void) => void;
  blurCallback?: () => void;
  onPress?: (
    val?: RefObject<TouchableHighlight>,
    clearLoadingState?: () => void,
  ) => void;
  hasTVPreferredFocus?: boolean;
  showLoader?: boolean;
  freezeButtonAfterPressing?: boolean;
};

const ExpandableButton = forwardRef<any, Props>(
  (
    {
      Icon,
      text,
      focusCallback,
      onPress,
      blurCallback,
      hasTVPreferredFocus = false,
      showLoader,
      freezeButtonAfterPressing,
    },
    ref: any,
  ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [freezeButton, setFreezeButton] = useState<boolean>(false);
    const buttonRef = useRef<TTouchableHighlightWrapperRef>(null);
    const isMounted = useRef<boolean>(false);
    const clearLoadingState = () => {
      setFreezeButton(false);
      setLoading(false);
    };

    const pressingHandler = () => {
      if (isMounted.current && showLoader) {
        setLoading(true);
      }
      if (isMounted.current && freezeButtonAfterPressing) {
        setFreezeButton(true);
      }
      if (typeof onPress === 'function') {
        onPress(
          typeof buttonRef.current?.getRef === 'function'
            ? buttonRef.current.getRef()
            : undefined,
          showLoader || freezeButtonAfterPressing
            ? clearLoadingState
            : undefined,
        );
      }
    };

    useLayoutEffect(() => {
      if (ref !== null && typeof buttonRef.current?.getRef === 'function') {
        ref.current = buttonRef.current.getRef().current;
      }
    }, [ref]);
    useLayoutEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);
    return (
      <View style={styles.buttonContainer}>
        <TouchableHighlightWrapper
          ref={buttonRef}
          canMoveRight={false}
          canMoveDown={!freezeButton}
          canMoveUp={!freezeButton}
          canMoveLeft={!freezeButton}
          hasTVPreferredFocus={hasTVPreferredFocus}
          style={styles.button}
          styleFocused={styles.buttonActive}
          onBlur={() => {
            if (typeof blurCallback === 'function') {
              blurCallback();
            }
          }}
          onFocus={() => {
            if (typeof focusCallback === 'function') {
              focusCallback(pressingHandler);
            }
          }}
          onPress={pressingHandler}>
          <View style={styles.wrapper}>
            {Icon && <Icon width={scaleSize(40)} height={scaleSize(40)} />}
            {
              <RohText style={styles.text} numberOfLines={1}>
                {text}
              </RohText>
            }
            <View style={styles.spinnerContainer}>
              <Spinner
                isVisible={loading}
                size={scaleSize(50)}
                type="Circle"
                color={Colors.defaultTextColor}
              />
            </View>
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
    alignItems: 'center',
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
  spinnerContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: scaleSize(20),
  },
});

export default ExpandableButton;
