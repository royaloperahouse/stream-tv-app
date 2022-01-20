import React, { useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { digitalEventsForHomePageSelector } from '@services/store/events/Selectors';
import {
  DigitalEventItem,
  Preview,
  DigitalEventSectionHeader,
  RailSections,
} from '@components/EventListComponents';
import { scaleSize } from '@utils/scaleSize';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';
import { useMyList } from '@hooks/useMyList';
import { useContinueWatchingList } from '@hooks/useContinueWatchingList';
import { continueWatchingRailTitle } from '@configs/bitMovinPlayerConfig';
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import { navMenuManager } from '@components/NavMenu';

type THomePageScreenProps = {};
const HomePageScreen: React.FC<THomePageScreenProps> = () => {
  const myList = useMyList();
  const continueWatchingList = useContinueWatchingList();
  const data = useSelector(
    digitalEventsForHomePageSelector(myList, continueWatchingList),
  );
  const previewRef = useRef(null);
  const isFocused = useIsFocused();
  const route = useRoute<RouteProp<any, string>>();
  useLayoutEffect(() => {
    if (isFocused && route?.params?.fromEventDetails && !data.length) {
      navMenuManager.setNavMenuAccessible();
      navMenuManager.showNavMenu();
      navMenuManager.setNavMenuFocus();
    }
  }, [isFocused, route, data.length]);
  if (!data.length) {
    return null;
  }
  return (
    <View style={styles.root}>
      <Preview ref={previewRef} />
      <View>
        <RailSections
          containerStyle={styles.railContainerStyle}
          headerContainerStyle={styles.railHeaderContainerStyle}
          railStyle={styles.railStyle}
          sections={data}
          sectionKeyExtractor={item => item.sectionIndex?.toString()}
          renderHeader={section => (
            <DigitalEventSectionHeader>
              {section.title}
            </DigitalEventSectionHeader>
          )}
          renderItem={({ item, section, index, scrollToRail, isFirstRail }) => (
            <DigitalEventItem
              event={item}
              ref={previewRef}
              screenNameFrom={route.name}
              canMoveUp={!isFirstRail}
              hasTVPreferredFocus={isFirstRail && index === 0}
              canMoveRight={index !== section.data.length - 1}
              onFocus={scrollToRail}
              continueWatching={section.title === continueWatchingRailTitle}
              eventGroupTitle={section.title}
            />
          )}
        />
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
    justifyContent: 'flex-end',
  },
  railContainerStyle: {
    top: 0,
    height: Dimensions.get('window').height - scaleSize(600),
    width:
      Dimensions.get('window').width -
      (widthWithOutFocus + marginRightWithOutFocus + marginLeftStop),
  },
  railHeaderContainerStyle: {},
  railStyle: {
    paddingTop: scaleSize(30),
  },
});

export default HomePageScreen;
