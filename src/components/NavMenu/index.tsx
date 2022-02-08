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
  View,
  BackHandler,
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import NavMenuItem from '@components/NavMenu/components/NavMenuItem';
import { navigate, getCurrentRoute } from '@navigations/navigationContainer';
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
import RohText from '@components/RohText';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';
import { globalModalManager } from '@components/GlobalModal';
import { WarningOfExitModal } from '@components/GlobalModal/variants';
import { useDispatch } from 'react-redux';
import {
  clearEventState,
  getEventListLoopStop,
} from '@services/store/events/Slices';
import { clearAuthState, endLoginLoop } from '@services/store/auth/Slices';
import { useFeature } from 'flagged';

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
    setNavMenuFocus: () => void;
    setNavMenuAccessible: () => void;
    setNavMenuNotAccessible: () => void;
    setNextFocusRightValue: (nodeValue: number, screenName: string) => void;
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
  setNavMenuFocus: () => {
    if (typeof navMenuRef.current?.setNavMenuFocus === 'function') {
      navMenuRef.current.setNavMenuFocus();
    }
  },
  setNavMenuAccessible: () => {
    if (typeof navMenuRef.current?.setNavMenuAccessible === 'function') {
      navMenuRef.current.setNavMenuAccessible();
    }
  },
  setNavMenuNotAccessible: () => {
    if (typeof navMenuRef.current?.setNavMenuNotAccessible === 'function') {
      navMenuRef.current.setNavMenuNotAccessible();
    }
  },
  setNextFocusRightValue: (nodeValue: number, screenName: string) => {
    if (typeof navMenuRef.current?.setNextFocusRightValue === 'function') {
      navMenuRef.current.setNextFocusRightValue(nodeValue, screenName);
    }
  },
});

const NavMenu: React.FC<TNavMenuProps> = ({ navMenuConfig }) => {
  const canExit = useFeature('canExit');
  const navMenuMountedRef = useRef<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [isMenuFocused, setIsMenuFocused] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuid] = useState<string>(
    navMenuConfig.find(route => route.isDefault)?.navMenuScreenName ||
      navMenuConfig[0].navMenuScreenName,
  );
  const [nextFocusRightMapping, setNextFocusRightMapping] = useState(() =>
    navMenuConfig.reduce<{ [key: string]: number | null }>((acc, route) => {
      acc[route.navMenuScreenName] = null;
      return acc;
    }, {}),
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
  const exitOfAppInterpolation: Animated.AnimatedInterpolation =
    menuAnimation.interpolate({
      inputRange: [breakPointWithOutFocus, breakPointWithFocus],
      outputRange: [breakPointInvisble, breakPointWithFocus],
      extrapolateLeft: 'clamp',
    });
  const flatListRef = useRef<FlatList | null>(null);
  const selectedItemIndexRef = useRef<number>(
    navMenuConfig.findIndex(route => route.isDefault) === -1
      ? 0
      : navMenuConfig.findIndex(route => route.isDefault),
  );

  const onBlurRef = useRef<boolean>(false);
  const exitOfAppButtonGotFocus = useRef<boolean>(false);
  const activeItemRef = useRef<TouchableHighlight | null>(null);
  const [isMenuAccessible, setMenuAccessible] = useState<boolean>(true);
  const exitOfAppButtonRef = useRef<TTouchableHighlightWrapperRef>(null);
  const dispatch = useDispatch();
  const exitOfApp = useCallback(
    (isGlobakHandler?: boolean) => {
      globalModalManager.openModal({
        hasBackground: true,
        hasLogo: true,
        contentComponent: WarningOfExitModal,
        contentProps: {
          confirmActionHandler: () => {
            globalModalManager.closeModal(() => {
              dispatch(getEventListLoopStop());
              dispatch(endLoginLoop());
              dispatch(clearAuthState());
              dispatch(clearEventState());
              BackHandler.exitApp();
            });
          },
          rejectActionHandler: () => {
            globalModalManager.closeModal(() => {
              if (isGlobakHandler) {
                return;
              }
              if (
                typeof exitOfAppButtonRef?.current?.getRef === 'function' &&
                typeof exitOfAppButtonRef.current.getRef()?.current
                  ?.setNativeProps === 'function'
              ) {
                exitOfAppButtonRef.current
                  .getRef()
                  .current?.setNativeProps({ hasTVPreferredFocus: true });
              }
            });
          },
        },
      });
    },
    [dispatch],
  );
  const exitOfAppPressHandler = () => {
    exitOfApp();
  };
  useImperativeHandle(
    navMenuRef,
    () => ({
      showNavMenu: () => {
        setIsMenuVisible(true);
      },
      hideNavMenu: () => {
        setMenuAccessible(false);
        setIsMenuVisible(false);
      },
      setNavMenuBlur: () => {
        if (onBlurRef.current) {
          setIsMenuFocused(false);
          onBlurRef.current = false;
        }
      },
      setNavMenuAccessible: () => {
        setMenuAccessible(true);
      },
      setNavMenuNotAccessible: () => {
        setMenuAccessible(false);
      },
      setNextFocusRightValue: (nodeValue: number, screenName: string) => {
        setNextFocusRightMapping(prevState => ({
          ...prevState,
          [screenName]: nodeValue,
        }));
      },
      setNavMenuFocus: () => {
        setIsMenuFocused(true);
      },
    }),
    [],
  );
  const setMenuBlur = useCallback(() => {
    onBlurRef.current = true;
  }, []);

  const setMenuFocus = useCallback(
    (id: string, index: number, ref: React.RefObject<TouchableHighlight>) => {
      if (onBlurRef.current || exitOfAppButtonGotFocus.current) {
        setActiveMenuid(id);
        navigate(id, { fromEventDetails: false });
        activeItemRef.current = ref.current;
        selectedItemIndexRef.current = index;
        exitOfAppButtonGotFocus.current = false;
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
    const backButtonCallback = () => {
      const routeState = getCurrentRoute();
      if (!isMenuFocused) {
        setIsMenuFocused(true);
        setMenuAccessible(true);
        flatListRef.current?.scrollToIndex({
          animated: false,
          index: selectedItemIndexRef.current,
          viewPosition: 0,
        });
        if (activeItemRef.current?.setNativeProps) {
          activeItemRef.current.setNativeProps({ hasTVPreferredFocus: true });
        }
        return true;
      }
      if (
        canExit &&
        routeState &&
        navMenuConfig.some(route => route.navMenuScreenName === routeState.name)
      ) {
        exitOfApp(true);
      }
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', backButtonCallback);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonCallback);
    };
  }, [navMenuConfig, exitOfApp, canExit, isMenuFocused]);
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
    if (!navMenuMountedRef.current || menuFocusAnimationInProcess.current) {
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
    navMenuMountedRef.current = true;
    return () => {
      if (navMenuMountedRef && navMenuMountedRef.current) {
        navMenuMountedRef.current = false;
      }
    };
  }, []);
  return (
    <View>
      <Animated.View
        style={[
          styles.root,
          {
            marginLeft: marginLeftInterpolation,
            marginRight: marginRightInterpolation,
            width: menuFocusInterpolate,
          },
        ]}>
        <FlatList
          ref={flatListRef}
          data={navMenuConfig}
          keyExtractor={item => item.navMenuScreenName}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              if (!navMenuMountedRef || !navMenuMountedRef.current) {
                return;
              }
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
              isVisible={isMenuVisible && isMenuAccessible}
              nextFocusRight={
                nextFocusRightMapping[item.navMenuScreenName] ?? undefined
              }
            />
          )}
        />
      </Animated.View>
      {canExit && isMenuFocused && (
        <Animated.View
          style={[
            styles.exitOfAppContainer,
            {
              opacity: exitOfAppInterpolation,
              width: menuFocusInterpolate,
              marginLeft: marginLeftInterpolation,
              marginRight: marginRightInterpolation,
            },
          ]}>
          <TouchableHighlightWrapper
            accessible={isMenuFocused}
            onPress={exitOfAppPressHandler}
            ref={exitOfAppButtonRef}
            style={styles.exitOfAppButton}
            onFocus={() => {
              onBlurRef.current = false;
              exitOfAppButtonGotFocus.current = true;
              setActiveMenuid('');
            }}
            styleFocused={styles.exitOfAppButtonActive}
            canCollapseNavMenu={false}
            canMoveDown={false}
            canMoveRight={false}
            canMoveLeft={false}>
            <RohText style={styles.exitOfAppText}>Exit ROH Stream</RohText>
          </TouchableHighlightWrapper>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('window').height - scaleSize(190) - scaleSize(80),
    marginTop: scaleSize(190),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  exitOfAppContainer: {
    marginBottom: scaleSize(58),
  },
  exitOfAppText: {
    fontSize: scaleSize(22),
    lineHeight: scaleSize(28),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
    textTransform: 'uppercase',
  },
  exitOfAppButton: {
    opacity: 0.5,
  },
  exitOfAppButtonActive: {
    opacity: 1,
  },
});

export default NavMenu;
