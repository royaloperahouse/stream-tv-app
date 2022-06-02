import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import { Colors } from '@themes/Styleguide';
import getCollectionOfSettingsSections, {
  settingsTitle,
  getSettingsSectionsConfig,
} from '@configs/settingsConfig';
import { SettingsNavMenuItem } from '@components/SettingsComponents';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';
import { TTouchableHighlightWrapperRef } from '@components/TouchableHighlightWrapper';
import {
  NavMenuScreenRedirect,
  TNavMenuScreenRedirectRef,
} from '@components/NavmenuScreenRedirect';

type TSettingsScreenProps = {};
const SettingsScreen: React.FC<TSettingsScreenProps> = ({ route }) => {
  const [activeContentKey, setActiveContentKey] = useState<string>('');
  const activeItemRef = useRef<TTouchableHighlightWrapperRef>();
  const navMenuScreenRedirectRef = useRef<TNavMenuScreenRedirectRef>(null);
  const contentFactory = (contentKey: string) => {
    if (
      !contentKey ||
      !(contentKey in getSettingsSectionsConfig()) ||
      typeof getSettingsSectionsConfig()[contentKey].ContentComponent !==
        'function'
    ) {
      return View;
    }
    return getSettingsSectionsConfig()[contentKey].ContentComponent;
  };
  const Content = contentFactory(activeContentKey);

  return (
    <View style={styles.root}>
      <NavMenuScreenRedirect
        screenName={route.name}
        ref={navMenuScreenRedirectRef}
      />
      <View style={styles.mainContainer}>
        <View style={styles.navMenuContainer}>
          <RohText style={styles.pageTitle}>{settingsTitle}</RohText>
          <FlatList
            data={getCollectionOfSettingsSections()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <SettingsNavMenuItem
                id={item.key}
                isFirst={index === 0}
                isActive={item.key === activeContentKey}
                title={item.navMenuItemTitle}
                canMoveDown={
                  index !== getCollectionOfSettingsSections().length - 1
                }
                canMoveUp={index !== 0}
                onFocus={touchableRef => {
                  activeItemRef.current = touchableRef.current;
                  setActiveContentKey(item.key);
                }}
                onMount={(key, touchableRef) => {
                  navMenuScreenRedirectRef.current?.setDefaultRedirectFromNavMenu?.(
                    key,
                    touchableRef,
                  );
                }}
              />
            )}
          />
        </View>
        <View style={styles.contentContainer}>
          <Content
            listItemGetNode={activeItemRef.current?.getNode}
            listItemGetRef={activeItemRef.current?.getRef}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    width:
      Dimensions.get('window').width -
      (widthWithOutFocus + marginRightWithOutFocus + marginLeftStop),
    height: Dimensions.get('window').height,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mainContainer: {
    flexDirection: 'row',
    height: Dimensions.get('window').height - scaleSize(189),
    paddingRight: scaleSize(80),
    width: '100%',
  },
  navMenuContainer: {
    width: scaleSize(486),
    height: '100%',
  },
  pageTitle: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(48),
    marginBottom: scaleSize(24),
    textTransform: 'uppercase',
  },
  contentContainer: {
    flex: 1,
  },
});

export default SettingsScreen;
