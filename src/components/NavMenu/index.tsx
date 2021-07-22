import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import NavMenuItem from '@components/NavMenu/components/NavMenuItem';
import { routes } from '@navigations/routes';
import { navigate } from '@navigations/navigationContainer';
import { useCallback } from 'react';
type TNavMenuProps = {};

const NavMenu: React.FC<TNavMenuProps> = () => {
  const [isMenuVisibl, setIsMenuVisibl] = useState(true);
  const [isMenuFocused, setIsMenuFocused] = useState(false);
  const [activeMenuId, setActiveMenuid] = useState(
    routes.find(route => route.isDefault)?.navMenuScreenName ||
      routes[0].navMenuScreenName,
  );
  const flatListRef = useRef<any>();
  const selectedItemIndexRef = useRef<number>();
  const dinemicMenuStyle = StyleSheet.create({
    menuContainer: {
      width: isMenuVisibl ? 'auto' : 0,
    },
  });
  const navigateTo = useCallback((id: string, index: number) => {
    navigate(id);
    setActiveMenuid(id);
    setIsMenuFocused(true);
    selectedItemIndexRef.current = index;
  }, []);
  const menuItems = routes.sort((a, b) => a.position - b.position);
  return (
    <View style={[styles.root, dinemicMenuStyle.menuContainer]}>
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
  },
  visibleMenuStyle: {},
});

export default NavMenu;
