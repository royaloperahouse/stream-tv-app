import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions, TVFocusGuideView } from 'react-native';
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
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TRailSectionsProps } from '@components/EventListComponents/components/RailSections';

type THomePageScreenProps = {};
const HomePageScreen: React.FC<THomePageScreenProps> = () => {
  const myList = useMyList();
  const data = useSelector(digitalEventsForHomePageSelector(myList));
  const previewRef = useRef(null);
  const viewRef = useRef<View>(null);
  if (!data.length) {
    return null;
  }

  console.log('homepage', viewRef.current);
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
              hasTVPreferredFocus={section.sectionIndex === 0 && index === 0}
              canMoveRight={index !== section.data.length - 1}
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

export default HomePageScreen;
