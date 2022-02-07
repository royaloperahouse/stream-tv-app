import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, VirtualizedList } from 'react-native';
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
import { useIsFocused } from '@react-navigation/native';
import { navMenuManager } from '@components/NavMenu';

type THomePageScreenProps = {};
const HomePageScreen: React.FC<THomePageScreenProps> = ({
  navigation,
  route,
}) => {
  const { data: myList, ejected: myListEjected } = useMyList();
  const { data: continueWatchingList, ejected: continueWatchingListEjected } =
    useContinueWatchingList();
  const { data, eventsLoaded } = useSelector(
    digitalEventsForHomePageSelector(myList, continueWatchingList),
  );
  const previewRef = useRef(null);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    if (
      isFocused &&
      myListEjected &&
      continueWatchingListEjected &&
      eventsLoaded
    ) {
      if (!data.length) {
        navMenuManager.setNavMenuAccessible();
        navMenuManager.showNavMenu();
        navMenuManager.setNavMenuFocus();
      }
    }
  }, [
    isFocused,
    route,
    data.length,
    navigation,
    continueWatchingListEjected,
    myListEjected,
    eventsLoaded,
  ]);

  if (!data.length || !continueWatchingListEjected || !myListEjected) {
    return null;
  }
  return (
    <View style={styles.root}>
      <Preview ref={previewRef} />
      <View>
        <RailSections
          containerStyle={styles.railContainerStyle}
          headerContainerStyle={styles.railHeaderContainerStyle}
          sectionIndex={route?.params?.sectionIndex || 0}
          railStyle={styles.railStyle}
          sections={data}
          sectionKeyExtractor={item => item.sectionIndex?.toString()}
          renderHeader={section => (
            <DigitalEventSectionHeader>
              {section.title}
            </DigitalEventSectionHeader>
          )}
          renderItem={({
            item,
            section,
            index,
            scrollToRail,
            isFirstRail,
            isLastRail,
            sectionIndex,
          }) => (
            <DigitalEventItem
              event={item}
              ref={previewRef}
              screenNameFrom={route.name}
              canMoveUp={!isFirstRail}
              hasTVPreferredFocus={
                route.params === undefined
                  ? isFirstRail && index === 0
                  : route.params.fromEventDetails &&
                    sectionIndex === route.params.sectionIndex &&
                    index === 0
              }
              canMoveRight={index !== section.data.length - 1}
              canMoveDown={!isLastRail}
              onFocus={scrollToRail}
              continueWatching={section.title === continueWatchingRailTitle}
              eventGroupTitle={section.title}
              sectionIndex={sectionIndex}
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
