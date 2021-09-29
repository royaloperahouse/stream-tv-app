import React, { useState, useCallback, useRef } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {
  View,
  StyleSheet,
  Dimensions,
  VirtualizedList,
  ViewToken,
} from 'react-native';
import { TEventContainer } from '@services/types/models';
import collectionOfEventDetailsSections, {
  eventDetailsSectionsConfig,
  TEventDetailsSection,
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
  const VirtualizedListRef = useRef<VirtualizedList<any>>(null);
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
    (item: TEventDetailsSection, index: number): JSX.Element | null => {
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
            />
          );
        }
        default: {
          return (
            <Component
              key={item?.key || index}
              event={event}
              nextScreenText={item?.nextSectionTitle}
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
      <VirtualizedList
        ref={VirtualizedListRef}
        style={styles.scrollView}
        keyExtractor={(item, index) => item[index].key}
        initialNumToRender={0}
        data={collectionOfEventDetailsSections}
        renderItem={({ item, index }) => {
          return sectionsFactory(item[index], index);
        }}
        getItemCount={data => data?.length || 0}
        windowSize={Dimensions.get('window').height}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 5,
        }}
        onViewableItemsChanged={info => {
          console.log(info, 'info');
          let itemForScrolling: ViewToken | undefined;
          if (
            info.viewableItems.length > 1 &&
            info.changed.length &&
            (itemForScrolling = info.changed.find(item => item.isViewable)) !==
              undefined &&
            itemForScrolling.index !== null
          ) {
            VirtualizedListRef.current?.scrollToIndex({
              animated: true,
              index: itemForScrolling.index,
            });
          }
        }}
        getItem={data => [...data]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
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
});

export default EventDetailsScreen;
