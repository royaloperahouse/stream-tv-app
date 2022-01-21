import React, { useRef, useLayoutEffect } from 'react';
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
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import { navMenuManager } from '@components/NavMenu';

type TOperaMusicScreenProps = {};
const OperaMusicScreen: React.FC<TOperaMusicScreenProps> = () => {
  const data = useSelector(digitalEventsForOperaAndMusicSelector);
  const previewRef = useRef<TPreviewRef | null>(null);
  const runningOnceRef = useRef<boolean>(false);
  const isFocused = useIsFocused();
  const route = useRoute<RouteProp<any, string>>();
  useLayoutEffect(() => {
    if (isFocused && route?.params?.fromEventDetails && !data.length) {
      navMenuManager.setNavMenuAccessible();
      navMenuManager.showNavMenu();
      navMenuManager.setNavMenuFocus();
    }
  }, [isFocused, route, data.length]);
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
          railStyle={styles.railStyle}
          sections={data}
          sectionKeyExtractor={item => item.sectionIndex?.toString()}
          renderHeader={section => (
            <DigitalEventSectionHeader>
              {section.title}
            </DigitalEventSectionHeader>
          )}
          renderItem={({ item, section, index, scrollToRail }) => (
            <DigitalEventItem
              screenNameFrom={route.name}
              event={item}
              ref={previewRef}
              canMoveUp={section.sectionIndex !== 0}
              canMoveRight={index !== section.data.length - 1}
              onFocus={scrollToRail}
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

export default OperaMusicScreen;
