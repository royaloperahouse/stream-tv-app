import React, { useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, Dimensions, TVFocusGuideView } from 'react-native';
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
type TOperaMusicScreenProps = {};
const OperaMusicScreen: React.FC<TOperaMusicScreenProps> = () => {
  const data = useSelector(digitalEventsForOperaAndMusicSelector);
  const previewRef = useRef<TPreviewRef | null>(null);
  const runningOnceRef = useRef<boolean>(false);
  const viewRef = useRef<View>(null);
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
  console.log('opera & music', viewRef.current);
  return (
    <TVFocusGuideView 
      style={styles.root} 
      destinations={[viewRef.current]}
    >
      <Preview ref={previewRef} />
      <View ref={viewRef}>
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
              event={item}
              ref={previewRef}
              canMoveUp={section.sectionIndex !== 0}
              canMoveRight={index !== section.data.length - 1}
              hasTVPreferredFocus={section.sectionIndex === 0 && index === 0}
              onFocus={scrollToRail}
            />
          )}
        />
      </View>
    </TVFocusGuideView>
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
