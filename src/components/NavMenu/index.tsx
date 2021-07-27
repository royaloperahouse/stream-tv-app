import React, {
  useState,
  useRef,
  useCallback,
  createRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import NavMenuItem from '@components/NavMenu/components/NavMenuItem';
import { navigate } from '@navigations/navigationContainer';
import { TRoute } from '@services/types/models';

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

const navMenuRef =
  createRef<Partial<{ showNavMenu: () => void; hideNavMenu: () => void }>>();

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
});

const NavMenu: React.FC<TNavMenuProps> = ({ navMenuConfig }) => {
  const [isMenuVisibl, setIsMenuVisibl] = useState<boolean>(true);
  const [isMenuFocused, setIsMenuFocused] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuid] = useState<string>(
    navMenuConfig.find(route => route.isDefault)?.navMenuScreenName ||
      navMenuConfig[0].navMenuScreenName,
  );
  const flatListRef = useRef<FlatList | null>(null);
  const selectedItemIndexRef = useRef<number>(
    navMenuConfig.findIndex(route => route.isDefault) === -1
      ? 0
      : navMenuConfig.findIndex(route => route.isDefault),
  );

  const blurTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const activeItemRef = useRef<TouchableHighlight | null>(null);
  useImperativeHandle(
    navMenuRef,
    () => ({
      showNavMenu: () => {
        setIsMenuVisibl(true);
      },
      hideNavMenu: () => {
        setIsMenuVisibl(false);
      },
    }),
    [],
  );
  const setMenuBlure = useCallback(() => {
    blurTimeoutIdRef.current = setTimeout(() => {
      setIsMenuFocused(false);
      blurTimeoutIdRef.current = null;
    }, 100);
  }, []);

  const setMenuFocuse = useCallback(
    (id: string, index: number, ref: React.RefObject<TouchableHighlight>) => {
      if (blurTimeoutIdRef.current) {
        clearTimeout(blurTimeoutIdRef.current);
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

  const navigateTo = useCallback(
    (id: string, index: number, ref: React.RefObject<TouchableHighlight>) => {
      setMenuFocuse(id, index, ref);
    },
    [setMenuFocuse],
  );
  const dynamicStyles = StyleSheet.create({
    root: {
      minWidth: isMenuVisibl ? scaleSize(100) : 1,
      marginRight: isMenuVisibl ? scaleSize(30) : 0,
      marginLeft: isMenuVisibl ? scaleSize(60) : 0,
    },
  });
  return (
    <View style={[styles.root, dynamicStyles.root]}>
      {isMenuVisibl && (
        <FlatList
          ref={flatListRef}
          data={navMenuConfig}
          keyExtractor={item => item.navMenuScreenName}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <NavMenuItem
              index={index}
              id={item.navMenuScreenName}
              isActive={item.navMenuScreenName === activeMenuId}
              SvgIconActiveComponent={item.SvgIconActiveComponent}
              SvgIconInActiveComponent={item.SvgIconInActiveComponent}
              navMenuTitle={item.navMenuTitle}
              onFocuse={navigateTo}
              onBlur={setMenuBlure}
              isDefault={item.isDefault}
              isMenuShow={isMenuFocused}
              isLastItem={index === navMenuConfig.length - 1}
              setActiveMunuItemRef={setActiveMunuItemRef}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('window').height - scaleSize(190),
    marginTop: scaleSize(190),
  },
});

export default NavMenu;
