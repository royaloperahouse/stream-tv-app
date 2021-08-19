import React, {
  useState,
  useRef,
  useCallback,
  createRef,
  useImperativeHandle,
  useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableHighlight,
  Animated,
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import NavMenuItem from '@components/NavMenu/components/NavMenuItem';
import { navigate } from '@navigations/navigationContainer';
import { TRoute } from '@services/types/models';
import {
  widthInvisble,
  widthWithFocus,
  widthWithOutFocus,
  breakPointInvisble,
  breakPointWithFocus,
  breakPointWithOutFocus,
  marginRightWithFocus,
  marginRightWithOutFocus,
  opacityOfItemTextStart,
  opacityOfItemTextStop,
  opacityOfItemIconStart,
  opacityOfItemIconStop,
  focusAnimationDuration,
  visibleAnimationDuration,
  marginLeftStart,
  marginLeftStop,
  marginRightInvisble,
} from '@configs/navMenuConfig';
//import { log } from '@utils/loger';
type TNavMenuProps = {
  navMenuConfig: Array<{
    navMenuScreenName: TRoute['navMenuScreenName'];
    SvgIconActiveComponent: TRoute['SvgIconActiveComponent'];
    SvgIconInActiveComponent: TRoute['SvgIconInActiveComponent'];
    navMenuTitle: TRoute['navMenuTitle'];
    position: TRoute['position'];
    isDefault: TRoute['isDefault'];
  }>;
};

const navMenuRef = createRef<
  Partial<{
    showNavMenu: () => void;
    hideNavMenu: () => void;
    setNavMenuBlur: () => void;
  }>
>();

export const navMenuManager = Object.freeze({
  showNavMenu: () => {
    if (typeof navMenuRef.current?.showNavMenu === 'function') {
      navMenuRef.current.showNavMenu();
    }
  },
  hideNavMenu: () => {
    if (typeof navMenuRef.current?.hideNavMenu === 'function') {
      navMenuRef.current.hideNavMenu();
    }
  },
  setNavMenuBlur: () => {
    if (typeof navMenuRef.current?.setNavMenuBlur === 'function') {
      navMenuRef.current.setNavMenuBlur();
    }
  },
});

const NavMenu: React.FC<TNavMenuProps> = ({ navMenuConfig }) => {
  const navMenuMountedRef = useRef<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [isMenuFocused, setIsMenuFocused] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuid] = useState<string>(
    navMenuConfig.find(route => route.isDefault)?.navMenuScreenName ||
      navMenuConfig[0].navMenuScreenName,
  );
  const menuAnimation = useRef<Animated.Value>(
    new Animated.Value(breakPointWithOutFocus),
  ).current;
  const menuFocusAnimationInProcess = useRef<boolean>(false);
  const menuVisibleAnimationInProcess = useRef<boolean>(false);
  const menuFocusInterpolate: Animated.AnimatedInterpolation =
    menuAnimation.interpolate({
      inputRange: [
        breakPointInvisble,
        breakPointWithOutFocus,
        breakPointWithFocus,
      ],
      outputRange: [widthInvisble, widthWithOutFocus, widthWithFocus],
    });
  const menuItemInterpolation: Animated.AnimatedInterpolation =
    menuFocusInterpolate.interpolate({
      inputRange: [widthWithOutFocus, widthWithFocus],
      outputRange: [opacityOfItemTextStart, opacityOfItemTextStop],
      extrapolate: 'clamp',
    });
  const menuItemIconInterpolation: Animated.AnimatedInterpolation =
    menuAnimation.interpolate({
      inputRange: [breakPointInvisble, breakPointWithOutFocus],
      outputRange: [opacityOfItemIconStart, opacityOfItemIconStop],
      extrapolate: 'clamp',
    });
  const marginLeftInterpolation: Animated.AnimatedInterpolation =
    menuAnimation.interpolate({
      inputRange: [breakPointInvisble, breakPointWithOutFocus],
      outputRange: [marginLeftStart, marginLeftStop],
      extrapolateRight: 'clamp',
    });
  const marginRightInterpolation: Animated.AnimatedInterpolation =
    menuAnimation.interpolate({
      inputRange: [
        breakPointInvisble,
        breakPointWithOutFocus,
        breakPointWithFocus,
      ],
      outputRange: [
        marginRightInvisble,
        marginRightWithOutFocus,
        marginRightWithFocus,
      ],
    });
  const flatListRef = useRef<FlatList | null>(null);
  const selectedItemIndexRef = useRef<number>(
    navMenuConfig.findIndex(route => route.isDefault) === -1
      ? 0
      : navMenuConfig.findIndex(route => route.isDefault),
  );

  const onBlurRef = useRef<boolean>(false);
  const activeItemRef = useRef<TouchableHighlight | null>(null);
  useImperativeHandle(
    navMenuRef,
    () => ({
      showNavMenu: () => {
        setIsMenuFocused(true);
        setIsMenuVisible(true);
      },
      hideNavMenu: () => {
        setIsMenuVisible(false);
      },
      setNavMenuBlur: () => {
        if (onBlurRef.current) {
          setIsMenuFocused(false);
          onBlurRef.current = false;
        }
      },
    }),
    [],
  );
  const setMenuBlur = useCallback(() => {
    onBlurRef.current = true;
  }, []);

  const setMenuFocus = useCallback(
    (id: string, index: number, ref: React.RefObject<TouchableHighlight>) => {
      if (onBlurRef.current) {
        setActiveMenuid(id);
        navigate(id);
        activeItemRef.current = ref.current;
        selectedItemIndexRef.current = index;
        return;
      }
      setIsMenuFocused(true);
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: selectedItemIndexRef.current,
        viewPosition: 0,
      });
      if (activeItemRef.current?.setNativeProps) {
        activeItemRef.current.setNativeProps({ hasTVPreferredFocus: true });
      }
    },
    [],
  );

  const setActiveMunuItemRef = useCallback(
    (ref: React.RefObject<TouchableHighlight>) => {
      activeItemRef.current = ref.current;
    },
    [],
  );

  useLayoutEffect(() => {
    if (
      !navMenuMountedRef.current ||
      menuVisibleAnimationInProcess.current ||
      menuFocusAnimationInProcess.current
    ) {
      return;
    }
    menuFocusAnimationInProcess.current = true;
    Animated.timing(menuAnimation, {
      toValue: isMenuFocused ? breakPointWithFocus : breakPointWithOutFocus,
      duration: focusAnimationDuration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished && !menuVisibleAnimationInProcess.current) {
        menuAnimation.setValue(
          isMenuFocused ? breakPointWithOutFocus : breakPointWithFocus,
        );
      }
      menuFocusAnimationInProcess.current = false;
    });
  }, [isMenuFocused, menuAnimation]);

  useLayoutEffect(() => {
    if (
      !navMenuMountedRef.current ||
      menuVisibleAnimationInProcess.current ||
      menuFocusAnimationInProcess.current
    ) {
      return;
    }
    menuVisibleAnimationInProcess.current = true;
    Animated.timing(menuAnimation, {
      toValue: isMenuVisible ? breakPointWithOutFocus : breakPointInvisble,
      duration: visibleAnimationDuration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) {
        menuAnimation.setValue(
          isMenuVisible ? breakPointInvisble : breakPointWithOutFocus,
        );
      }
      menuVisibleAnimationInProcess.current = false;
    });
  }, [isMenuVisible, menuAnimation]);

  useLayoutEffect(() => {
    navMenuMountedRef.current = true;
  }, []);
  return (
    <Animated.View
      style={[
        styles.root,
        {
          marginLeft: marginLeftInterpolation,
          marginRight: marginRightInterpolation,
          width: menuFocusInterpolate,
        },
      ]}>
      {
        <FlatList
          ref={flatListRef}
          data={navMenuConfig}
          keyExtractor={item => item.navMenuScreenName}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index !== -1 ? info.index : 0,
                animated: false,
              });
            });
          }}
          renderItem={({ item, index }) => (
            <NavMenuItem
              index={index}
              id={item.navMenuScreenName}
              isActive={item.navMenuScreenName === activeMenuId}
              SvgIconActiveComponent={item.SvgIconActiveComponent}
              SvgIconInActiveComponent={item.SvgIconInActiveComponent}
              navMenuTitle={item.navMenuTitle}
              onFocus={setMenuFocus}
              onBlur={setMenuBlur}
              isDefault={item.isDefault}
              isLastItem={index === navMenuConfig.length - 1}
              setActiveMunuItemRef={setActiveMunuItemRef}
              labelOpacityValue={menuItemInterpolation}
              iconOpacityValue={menuItemIconInterpolation}
              isVisible={isMenuVisible}
            />
          )}
        />
      }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('window').height - scaleSize(190),
    marginTop: scaleSize(190),
    overflow: 'hidden',
  },
});

export default NavMenu;
