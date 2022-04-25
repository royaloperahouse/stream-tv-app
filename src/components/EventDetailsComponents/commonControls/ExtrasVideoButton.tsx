import React, {
  useRef,
  RefObject,
  forwardRef,
  useLayoutEffect,
  useState,
} from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import Spinner from 'react-native-spinkit';
import FastImage from 'react-native-fast-image';

type Props = {
  focusCallback?: (pressingHandler?: () => void) => void;
  blurCallback?: () => void;
  onPress?: (
    val?: RefObject<TouchableHighlight>,
    clearLoadingState?: () => void,
  ) => void;
  hasTVPreferredFocus?: boolean;
  uri: string;
  containerStyle: any;
  canMoveRight: boolean;
};

const ExtrasVideoButton = forwardRef<any, Props>(
  (
    {
      focusCallback,
      onPress,
      blurCallback,
      hasTVPreferredFocus = false,
      uri,
      containerStyle,
      canMoveRight,
    },
    ref: any,
  ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [freezeButton, setFreezeButton] = useState<boolean>(false);
    const buttonRef = useRef<TTouchableHighlightWrapperRef>(null);
    const isMounted = useRef<boolean>(false);

    const clearLoadingState = () => {
      if (isMounted.current) {
        setFreezeButton(false);
        setLoading(false);
      }
    };
    const pressingHandler = () => {
      if (isMounted.current) {
        setLoading(true);
      }
      if (isMounted.current) {
        setFreezeButton(true);
      }
      if (typeof onPress === 'function') {
        onPress(
          typeof buttonRef.current?.getRef === 'function'
            ? buttonRef.current.getRef()
            : undefined,
          clearLoadingState,
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
      <TouchableHighlightWrapper
        ref={buttonRef}
        canMoveDown={!freezeButton}
        canMoveUp={!freezeButton}
        canMoveLeft={!freezeButton}
        hasTVPreferredFocus={hasTVPreferredFocus}
        style={containerStyle}
        underlayColor={Colors.defaultBlue}
        canMoveRight={!freezeButton && canMoveRight}
        styleFocused={styles.extrasGalleryItemFocusedContainer}
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
        <View>
          <FastImage
            style={styles.extrasGalleryItemImage}
            source={{ uri }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              loading ? styles.activeSpinnerStyle : {},
            ]}
          />
          <View style={[styles.spinnerContainer]}>
            <Spinner
              isVisible={loading}
              size={styles.extrasGalleryItemImage.height * 0.7}
              type="Circle"
              color={Colors.backgroundColorTransparent}
            />
          </View>
        </View>
      </TouchableHighlightWrapper>
    );
  },
);

const styles = StyleSheet.create({
  extrasGalleryItemImage: {
    zIndex: 0,
    width: scaleSize(749),
    height: scaleSize(424),
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSpinnerStyle: {
    backgroundColor: Colors.defaultBlue,
    opacity: 0.3,
  },
  extrasGalleryItemFocusedContainer: {
    backgroundColor: Colors.defaultBlue,
  },
});

export default ExtrasVideoButton;
