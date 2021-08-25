import React, { useRef } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { digitalEventsForHomePageSelector } from '@services/store/events/Selectors';
import {
  DigitalEventItem,
  Preview,
  DigitalEventSectionHeader,
  RailSections,
} from '@components/EventListComponents';
import { StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { Dimensions } from 'react-native';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';
import { useMyList } from '@hooks/useMyList';

type THomePageScreenProps = {};
const HomePageScreen: React.FC<THomePageScreenProps> = () => {
  const myList = useMyList();
  const data = useSelector(digitalEventsForHomePageSelector(myList));
  const previewRef = useRef(null);
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
              event={item}
              ref={previewRef}
              canMoveUp={section.sectionIndex !== 0}
              hasTVPreferredFocus={section.sectionIndex === 0 && index === 0}
              canMoveRight={index !== section.data.length - 1}
              onFocus={scrollToRail}
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
