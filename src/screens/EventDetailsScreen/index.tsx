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
import {
  getBitMovinSavedPosition,
  savePosition,
} from '@services/bitMovinPlayer';
import { TBMPlayerShowingData } from '@services/types/bitmovinPlayer';

import { useFocusEffect } from '@react-navigation/native';

type TEventDetalsScreenProps = StackScreenProps<
  { eventDetails: { event: TEventContainer } },
  'eventDetails'
>;

const EventDetailsScreen: React.FC<TEventDetalsScreenProps> = ({ route }) => {
  const [bMPlayerShowingData, setIsBMPlayerShowing] =
    useState<TBMPlayerShowingData | null>(null);
  const isBMPlayerShowingRef = useRef<boolean>(false);
  const { event } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const eventDetailsScreenMounted = useRef<boolean>(false);
  const showPlayer = useCallback((playerItem: TBMPlayerShowingData) => {
    getBitMovinSavedPosition(playerItem.videoId).then(restoredItem => {
      if (!isBMPlayerShowingRef.current && eventDetailsScreenMounted.current) {
        setIsBMPlayerShowing({
          ...playerItem,
          position: restoredItem?.position,
        });
        isBMPlayerShowingRef.current = true;
      }
    });
  }, []);

  const closePlayer = (time: string) => {
    savePosition({
      id: bMPlayerShowingData?.videoId || '',
      position: time,
    }).finally(() => {
      setIsBMPlayerShowing(null);
      isBMPlayerShowingRef.current = false;
    });
  };

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
              isBMPlayerShowing={bMPlayerShowingData !== null}
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
    [bMPlayerShowingData, event, showPlayer],
  );

  useFocusEffect(
    useCallback(() => {
      eventDetailsScreenMounted.current = true;
      return () => {
        if (eventDetailsScreenMounted?.current) {
          eventDetailsScreenMounted.current = false;
        }
      };
    }, []),
  );

  if (bMPlayerShowingData !== null) {
    return (
      <Player
        autoPlay
        configuration={{
          url: bMPlayerShowingData.url,
          poster: bMPlayerShowingData.poster,
          offset: bMPlayerShowingData.position,
        }}
        title={bMPlayerShowingData.title}
        subtitle={bMPlayerShowingData.subtitle}
        onClose={closePlayer}
        analytics={{
          videoId: bMPlayerShowingData.videoId,
          title: bMPlayerShowingData.title,
        }}
      />
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
});

export default EventDetailsScreen;
