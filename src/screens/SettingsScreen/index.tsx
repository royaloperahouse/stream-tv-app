import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TVFocusGuideView } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import { Colors } from '@themes/Styleguide';
import collectionOfSettingsSections, {
  settingsTitle,
  settingsSectionsConfig,
} from '@configs/settingsConfig';
import { SettingsNavMenuItem } from '@components/SettingsComponents';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';
import { TTouchableHighlightWrapperRef } from '@components/TouchableHighlightWrapper';

type TSettingsScreenProps = {};
const SettingsScreen: React.FC<TSettingsScreenProps> = () => {
  const [activeContentKey, setActiveContentKey] = useState<string>('');
  const activeItemRef = useRef<TTouchableHighlightWrapperRef>();
  const viewRef = useRef<View>(null);
  const contentFactory = (contentKey: string) => {
    if (
      !contentKey ||
      !(contentKey in settingsSectionsConfig) ||
      typeof settingsSectionsConfig[contentKey].ContentComponent !== 'function'
    ) {
      return View;
    }
    return settingsSectionsConfig[contentKey].ContentComponent;
  };
  const Content = contentFactory(activeContentKey);
  console.log('settings', viewRef.current);
  return (
    <TVFocusGuideView
      style={styles.root}
      destinations={[viewRef.current]}>
      <View style={styles.container}>
        <View style={styles.navMenuContainer}>
          <RohText style={styles.pageTitle}>{settingsTitle}</RohText>
          <FlatList
            data={collectionOfSettingsSections}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <SettingsNavMenuItem
                isActive={item.key === activeContentKey}
                title={item.navMenuItemTitle}
                canMoveDown={index !== collectionOfSettingsSections.length - 1}
                canMoveUp={index !== 0}
                onFocus={touchableRef => {
                  activeItemRef.current = touchableRef.current;
                  setActiveContentKey(item.key);
                }}
              />
            )}
          />
        </View>
        <View ref={viewRef} style={styles.contentContainer}>
          <Content listItemGetNode={activeItemRef.current?.getNode} />
        </View>
      </View>
    </TVFocusGuideView>
  );
};
const styles = StyleSheet.create({
  root: { flex: 1, marginTop: scaleSize(189) },
  container: {
    flexDirection: 'row',
    width:
      Dimensions.get('window').width -
      (widthWithOutFocus + marginRightWithOutFocus + marginLeftStop),
    height: Dimensions.get('window').height - scaleSize(189),
  },
  navMenuContainer: {
    width: scaleSize(486),
    marginRight: scaleSize(80),
    height: '100%',
  },
  pageTitle: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(48),
    marginBottom: scaleSize(24),
    textTransform: 'uppercase',
  },
  listContainer: {
    width:
      Dimensions.get('window').width -
      (widthWithOutFocus + marginRightWithOutFocus + marginLeftStop),
  },
  contentContainer: {
    flex: 1,
  },
});

export default SettingsScreen;
