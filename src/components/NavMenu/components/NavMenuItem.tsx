import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';

type TNavMenuItemProps = {
  id: string;
  isMenuShow?: boolean;
  isActive: boolean;
  SvgIconActiveComponent: any;
  SvgIconInActiveComponent: any;
  navMenuTitle: string;
  onFocuse: (id: string, index: number) => void;
  isDefault: boolean;
  index: number;
  isLastItem: boolean;
};
const NavMenuItem: React.FC<TNavMenuItemProps> = ({
  index,
  id,
  isActive,
  SvgIconActiveComponent,
  SvgIconInActiveComponent,
  navMenuTitle,
  onFocuse,
  isDefault,
  isMenuShow,
  isLastItem,
}) => {
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
  const onFocuseHandler = useCallback(() => {
    onFocuse(id, index);
  }, [onFocuse, id, index]);
  return (
    <TouchableHighlight
      onFocus={onFocuseHandler}
      hasTVPreferredFocus={false}
      style={dynemicStyles.touchableWrapperStyle}>
      <View style={styles.root}>
        <View style={[styles.iconContainer, dynemicStyles.iconContainer]}>
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
        </View>
        {isMenuShow && (
          <RohText style={[styles.titleText, dynemicStyles.titleText]}>
            {navMenuTitle.toUpperCase()}
          </RohText>
        )}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: scaleSize(50),
    alignItems: 'center',
  },
  iconContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize(20),
    paddingBottom: scaleSize(4),
  },
  titleText: {
    fontSize: scaleSize(24),
    letterSpacing: scaleSize(1),
    lineHeight: scaleSize(28),
    color: Colors.navIconDefault,
  },
});

export default NavMenuItem;
