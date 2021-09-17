import React, { useState, useCallback, useRef } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { TEventContainer } from '@services/types/models';
import collectionOfEventDetailsSections, {
  eventDetailsSectionsConfig,
  TEventDitailsSection,
} from '@configs/eventDetailsConfig';
import GoBack from '@components/GoBack';
import Player from '@components/Player';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';

type TEventDetalsScreenProps = StackScreenProps<
  { eventDetails: { event: TEventContainer } },
  'eventDetails'
>;
const EventDetailsScreen: React.FC<TEventDetalsScreenProps> = ({ route }) => {
  const [isBMPlayerShowing, setIsBMPlayerShowing] = useState<boolean>(false);
  const { event } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const showPlayer = useCallback(() => {
    setIsBMPlayerShowing(true);
  }, []);
  const closePlayer = useCallback(time => {
    console.log(time, ' time');
    setIsBMPlayerShowing(false);
  }, []);
  const sectionsFactory = useCallback(
    (item: TEventDitailsSection, index: number): JSX.Element | null => {
      const Component = item?.Component;
      if (Component === undefined) {
        return null;
      }
      switch (item?.key) {
        case eventDetailsSectionsConfig.general.key: {
          return (
            <Component
              key={item?.key || index}
              event={event}
              showPlayer={showPlayer}
              isBMPlayerShowing={isBMPlayerShowing}
              nextScreenText={item.nextSectionTitle}
              scrollToMe={() => {
                scrollViewRef.current?.scrollTo({
                  animated: true,
                  y: (index || 0) * Dimensions.get('window').height,
                });
              }}
            />
          );
        }
        default: {
          return (
            <Component
              key={item?.key || index}
              event={event}
              nextScreenText={item?.nextSectionTitle}
              scrollToMe={() =>
                scrollViewRef.current?.scrollTo({
                  animated: true,
                  y: (index || 0) * Dimensions.get('window').height,
                })
              }
            />
          );
        }
      }
    },
    [isBMPlayerShowing, event, showPlayer],
  );

  if (isBMPlayerShowing) {
    return (
    <View style={styles.root}>
      <RohText style={styles.rootText} bold>
        iOS bitmoving player coming soon
      </RohText>
    </View> 
    // <Player
    //   autoPlay
    //   configuration={{
    //     url: 'https://video-ingestor-output-bucket.s3.eu-west-1.amazonaws.com/6565/manifest.m3u8',
    //     poster:
    //       'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
    //   }}
    //   title="event title"
    //   subtitle="some event subtitle"
    //   onClose={closePlayer}
    //   analytics={{
    //     videoId: 'blahblahblah',
    //     title: 'Some video title',
    //     experiment: 'ROH TV app',
    //     customData1: '',
    //     customData2: '',
    //     customData3: '',
    //     customData4: '',
    //     customData5: '',
    //     customData6: '',
    //     customData7: '',
    //   }}
    // />
    );
  }
  return (
    <View style={styles.rootContainer}>
      <GoBack />
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        {collectionOfEventDetailsSections.map(sectionsFactory)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    height: Dimensions.get('window').height,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rootText: {
    color: 'white',
    fontSize: scaleSize(48),
  },
});

export default EventDetailsScreen;
