import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  RefObject,
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
  styleFocused?: { [key: string]: any };
  styleBlured?: TouchableHighlightProps['style'];
  children: React.ReactNode;
  nextFocusLeft?: number;
  nextFocusUp?: number;
  nextFocusRight?: number;
  nextFocusDown?: number;
  canCollapseNavMenu?: boolean;
  style?: { [key: string]: any } | Array<{ [key: string]: any }>;
};

export type TTouchableHighlightWrapperRef = {
  getNode?: () => number;
  getRef?: () => RefObject<TouchableHighlight>;
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
    accessible = true,
    styleBlured = {},
    canCollapseNavMenu = true,
    underlayColor,
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
      getRef: () => {
        if (touchableHighlightRef.current) {
          return touchableHighlightRef;
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
      const focusEventCB = (ev: NativeSyntheticEvent<TargetedEvent>) => {
        if (canCollapseNavMenu) {
          navMenuManager.setNavMenuBlur();
        }
        setFocused(true);
        if (typeof onFocus === 'function') {
          onFocus(ev);
        }
        navMenuManager.setNavMenuAccessible();
      };
      if (Platform.OS === 'ios' && Platform.isTV) {
        setTimeout(() => {
          focusEventCB(event);
        }, 0);
      } else {
        focusEventCB(event);
      }
    },
    [onFocus, canCollapseNavMenu],
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

  const underlayColorFromStyle = style
    ? Array.isArray(style)
      ? style.reduce<undefined | string>((acc, styleObj) => {
          if (styleObj.backgroundColor) {
            acc = styleObj.backgroundColor;
          }
          return acc;
        }, undefined)
      : style.backgroundColor
    : undefined;

  const underlayColorFromStyleFocused = styleFocused
    ? Array.isArray(styleFocused)
      ? styleFocused.reduce<undefined | string>((acc, styleObj) => {
          if (styleObj.backgroundColor) {
            acc = styleObj.backgroundColor;
          }
          return acc;
        }, undefined)
      : styleFocused.backgroundColor
    : undefined;
  return (
    <TouchableHighlight
      {...restProps}
      {...movingAccessibility}
      accessible={accessible}
      onPress={onPressHandler}
      ref={touchableHighlightRef}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      underlayColor={
        underlayColorFromStyleFocused ||
        underlayColorFromStyle ||
        underlayColor ||
        'transperent'
      }
      style={[style, focused ? styleFocused : styleBlured]}>
      {children}
    </TouchableHighlight>
  );
});

export default TouchableHighlightWrapper;
