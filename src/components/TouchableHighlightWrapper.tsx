import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  findNodeHandle,
  NativeSyntheticEvent,
  TargetedEvent,
  TouchableHighlight,
  TouchableHighlightProps,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import { navMenuManager } from '@components/NavMenu';

type TTouchableHighlightWrapperProps = TouchableHighlightProps & {
  canMoveUp?: boolean;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  canMoveDown?: boolean;
  styleFocused?: TouchableHighlightProps['style'];
};

const TouchableHighlightWrapper = forwardRef<
  any,
  TTouchableHighlightWrapperProps
>((props, ref) => {
  const {
    children,
    canMoveUp = true,
    canMoveLeft = true,
    canMoveRight = true,
    canMoveDown = true,
    styleFocused = {},
    onFocus,
    onBlur,
    onPress,
    style = {},
    ...restProps
  } = props;
  const [focused, setFocused] = useState(false);
  const onPressRef = useRef<number>(0);
  const touchableHighlightRef = useRef<TouchableHighlight>(null);
  useImperativeHandle(
    ref,
    () => ({
      getNode: () => {
        if (touchableHighlightRef.current) {
          return findNodeHandle(touchableHighlightRef.current);
        }
      },
    }),
    [],
  );
  const movingAccessibility: { [key: string]: number | null } = {};
  if (!canMoveUp) {
    movingAccessibility.nextFocusUp = findNodeHandle(
      touchableHighlightRef.current,
    );
  }
  if (!canMoveLeft) {
    movingAccessibility.nextFocusLeft = findNodeHandle(
      touchableHighlightRef.current,
    );
  }
  if (!canMoveRight) {
    movingAccessibility.nextFocusRight = findNodeHandle(
      touchableHighlightRef.current,
    );
  }
  if (!canMoveDown) {
    movingAccessibility.nextFocusDown = findNodeHandle(
      touchableHighlightRef.current,
    );
  }
  const onFocusHandler = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>): void => {
      navMenuManager.setNavMenuBlur();
      setFocused(true);
      if (typeof onFocus === 'function') {
        onFocus(event);
      }
    },
    [onFocus],
  );

  const onBlurHandler = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>): void => {
      setFocused(false);
      if (typeof onBlur === 'function') {
        onBlur(event);
      }
    },
    [onBlur],
  );
  const onPressHandler = useCallback(
    (event: GestureResponderEvent): void => {
      if (
        Platform.isTV &&
        Platform.OS === 'android' &&
        onPressRef.current < 2
      ) {
        onPressRef.current += 1;
        return;
      }
      if (typeof onPress === 'function') {
        onPress(event);
      }
      onPressRef.current = 0;
    },
    [onPress],
  );
  return (
    <TouchableHighlight
      {...restProps}
      {...movingAccessibility}
      onPress={onPressHandler}
      ref={touchableHighlightRef}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      style={[style, focused && styleFocused]}>
      {children}
    </TouchableHighlight>
  );
});

export default TouchableHighlightWrapper;
