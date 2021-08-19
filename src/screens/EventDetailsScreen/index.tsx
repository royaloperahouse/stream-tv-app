import React, { useState, useCallback, useRef } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { TEventContainer } from '@services/types/models';
import collectionOfEventDetailsSections, {
  eventDetailsSectionsConfig,
  TEventDitailsSection,
} from '@configs/eventDetailsConfig';
import GoBack from '@components/GoBack';

type TEventDetalsScreenProps = StackScreenProps<
  { eventDetails: { event: TEventContainer } },
  'eventDetails'
>;
const EventDetailsScreen: React.FC<TEventDetalsScreenProps> = ({ route }) => {
  const [isBMPlayerShowing, setIsBMPlayerShowing] = useState<boolean>(false);
  const { event } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);

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
    [isBMPlayerShowing, event],
  );

  if (isBMPlayerShowing) {
    return null;
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
});

export default EventDetailsScreen;
