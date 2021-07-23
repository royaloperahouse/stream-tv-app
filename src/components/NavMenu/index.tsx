import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import NavMenuItem from '@components/NavMenu/components/NavMenuItem';
import { routes } from '@navigations/routes';
import { navigate } from '@navigations/navigationContainer';
import { log } from '@utils/loger';

type TNavMenuProps = {};

const NavMenu: React.FC<TNavMenuProps> = () => {
  const [isMenuVisibl, setIsMenuVisibl] = useState(true);
  const [isMenuFocused, setIsMenuFocused] = useState(false);
  const [activeMenuId, setActiveMenuid] = useState(
    routes.find(route => route.isDefault)?.navMenuScreenName ||
      routes[0].navMenuScreenName,
  );
  const flatListRef = useRef<any>();
  const selectedItemIndexRef = useRef<number>(1);
  const blurTimeoutIdRef = useRef<any>(null);
  const activeItemRef = useRef<any>(null);
  const setMenuBlure = useCallback(() => {
    blurTimeoutIdRef.current = setTimeout(() => {
      setIsMenuFocused(false);
      blurTimeoutIdRef.current = null;
    }, 100);
  }, []);

  const setMenuFocuse = useCallback((id: string, index: number, ref) => {
    if (blurTimeoutIdRef.current) {
      clearTimeout(blurTimeoutIdRef.current);
      setActiveMenuid(id);
      navigate(id);
      activeItemRef.current = ref.current;
      selectedItemIndexRef.current = index;
      return;
    }
    setIsMenuFocused(true);
    flatListRef.current.scrollToIndex({
      animated: false,
      index: selectedItemIndexRef.current,
      viewPosition: 0,
    });
    if (activeItemRef.current?.setNativeProps) {
      activeItemRef.current.setNativeProps({ hasTVPreferredFocus: true });
    }
  }, []);

  const navigateTo = useCallback(
    (id: string, index: number, ref) => {
      log('focuse', `${id} - ${index}`);
      setMenuFocuse(id, index, ref);
    },
    [setMenuFocuse],
  );

  const menuItems = routes.sort((a, b) => a.position - b.position);
  return (
    <View style={[styles.root]}>
      <FlatList
        ref={flatListRef}
        data={menuItems}
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
            isLastItem={index === menuItems.length - 1}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('window').height,
    minWidth: scaleSize(160),
    paddingTop: scaleSize(190),
    //width: 1,
  },
  visibleMenuStyle: {},
});

export default NavMenu;
