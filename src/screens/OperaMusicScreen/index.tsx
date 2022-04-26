import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { digitalEventsForOperaAndMusicSelector } from '@services/store/events/Selectors';
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
import { TPreviewRef } from '@components/EventListComponents/components/Preview';
import { useIsFocused } from '@react-navigation/native';
import { navMenuManager } from '@components/NavMenu';

type TOperaMusicScreenProps = {};
const OperaMusicScreen: React.FC<TOperaMusicScreenProps> = ({
  navigation,
  route,
}) => {
  const { data, eventsLoaded } = useSelector(
    digitalEventsForOperaAndMusicSelector,
  );
  const previewRef = useRef<TPreviewRef | null>(null);
  const runningOnceRef = useRef<boolean>(false);
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused && eventsLoaded) {
      if (!data.length) {
        navMenuManager.setNavMenuAccessible();
        navMenuManager.showNavMenu();
        navMenuManager.setNavMenuFocus();
      }
    }
  }, [isFocused, route, data.length, navigation, eventsLoaded]);
  useLayoutEffect(() => {
    if (
      typeof previewRef.current?.setDigitalEvent === 'function' &&
      data.length &&
      !runningOnceRef.current
    ) {
      runningOnceRef.current = true;
      previewRef.current.setDigitalEvent(data[0]?.data[0]);
    }
  }, [data]);
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
          sectionIndex={route.params.sectionIndex || 0}
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
            sectionIndex,
            isFirstRail,
            isLastRail,
            scrollToRail,
          }) => (
            <DigitalEventItem
              screenNameFrom={route.name}
              event={item}
              hasTVPreferredFocus={
                route.params.fromEventDetails &&
                sectionIndex === route.params.sectionIndex &&
                index === 0
              }
              ref={previewRef}
              onFocus={scrollToRail}
              canMoveUp={!isFirstRail}
              canMoveDown={!isLastRail}
              canMoveRight={index !== section.data.length - 1}
              eventGroupTitle={section.title}
              sectionIndex={sectionIndex}
              lastItem={index === section.data.length - 1}
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

export default OperaMusicScreen;
