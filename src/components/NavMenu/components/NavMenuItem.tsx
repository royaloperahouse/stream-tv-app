import React, { useCallback, useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableHighlight, Animated } from 'react-native';
import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import { TRoute } from '@services/types/models';
type TNavMenuItemProps = {
  id: string;
  isActive: boolean;
  SvgIconActiveComponent: TRoute['SvgIconActiveComponent'];
  SvgIconInActiveComponent: TRoute['SvgIconInActiveComponent'];
  navMenuTitle: TRoute['navMenuTitle'];
  onFocus: (
    id: string,
    index: number,
    ref: React.RefObject<TouchableHighlight>,
  ) => void;
  isDefault: TRoute['isDefault'];
  index: number;
  isLastItem: boolean;
  onBlur: () => void;
  labelOpacityValue: Animated.AnimatedInterpolation;
  setActiveMunuItemRef: (ref: React.RefObject<TouchableHighlight>) => void;
  isVisible: boolean;
  iconOpacityValue: Animated.AnimatedInterpolation;
};
const NavMenuItem: React.FC<TNavMenuItemProps> = ({
  index,
  id,
  isActive,
  SvgIconActiveComponent,
  SvgIconInActiveComponent,
  navMenuTitle,
  onFocus,
  onBlur,
  isLastItem,
  labelOpacityValue,
  setActiveMunuItemRef,
  isVisible,
  iconOpacityValue,
}) => {
  const mountedComponentRef = useRef(false);
  const dynemicStyles = StyleSheet.create({
    touchableWrapperStyle: {
      marginBottom: isLastItem ? 0 : scaleSize(60),
    },
    iconContainer: {
      borderBottomWidth: isActive ? scaleSize(2) : 0,
      borderBottomColor: Colors.navIconActive,
    },
    titleText: { opacity: isActive ? 1 : 0.5 },
  });
  const touchRef = useRef<TouchableHighlight | null>(null);
  const onFocusHandler = useCallback(() => {
    onFocus(id, index, touchRef);
  }, [onFocus, id, index]);

  useLayoutEffect(() => {
    if (!mountedComponentRef.current && isActive) {
      setActiveMunuItemRef(touchRef);
    }
    mountedComponentRef.current = true;
  }, [setActiveMunuItemRef, isActive]);
  return (
    <TouchableHighlight
      ref={touchRef}
      onFocus={onFocusHandler}
      onBlur={onBlur}
      accessible={isVisible}
      style={dynemicStyles.touchableWrapperStyle}>
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.iconContainer,
            dynemicStyles.iconContainer,
            { opacity: iconOpacityValue },
          ]}>
          {isActive ? (
            <SvgIconActiveComponent
              width={scaleSize(40)}
              height={scaleSize(40)}
            />
          ) : (
            <SvgIconInActiveComponent
              width={scaleSize(40)}
              height={scaleSize(40)}
            />
          )}
        </Animated.View>
        <Animated.View
          style={[styles.titleContainer, { opacity: labelOpacityValue }]}>
          <RohText style={[styles.titleText, dynemicStyles.titleText]}>
            {navMenuTitle.toUpperCase()}
          </RohText>
        </Animated.View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: scaleSize(50),
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  iconContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize(20),
    paddingBottom: scaleSize(4),
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleText: {
    fontSize: scaleSize(24),
    letterSpacing: scaleSize(1),
    lineHeight: scaleSize(28),
    color: Colors.navIconDefault,
    width: scaleSize(350), // need to setup good value;
  },
});

export default NavMenuItem;
