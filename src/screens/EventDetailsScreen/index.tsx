import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
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
  removeBitMovinSavedPositionByIdAndEventId,
  savePosition,
} from '@services/bitMovinPlayer';
import {
  TBMPlayerShowingData,
  TBMPlayerErrorObject,
} from '@services/types/bitmovinPlayer';

import { useFocusEffect } from '@react-navigation/native';
import { globalModalManager } from '@components/GlobalModal';
import { ErrorModal } from '@components/GlobalModal/variants';

type TEventDetalsScreenProps = StackScreenProps<
  { eventDetails: { event: TEventContainer } },
  'eventDetails'
>;

const EventDetailsScreen: React.FC<TEventDetalsScreenProps> = ({ route }) => {
  const [bMPlayerShowingData, setIsBMPlayerShowing] =
    useState<TBMPlayerShowingData | null>(null);
  const [bMPlayerError, setBMPlayerError] =
    useState<TBMPlayerErrorObject | null>(null);
  const isBMPlayerShowingRef = useRef<boolean>(false);
  const { event } = route.params;
  const VirtualizedListRef = useRef<VirtualizedList<any>>(null);
  const eventDetailsScreenMounted = useRef<boolean>(false);
  const showPlayer = useCallback((playerItem: TBMPlayerShowingData) => {
    if (!isBMPlayerShowingRef.current && eventDetailsScreenMounted.current) {
      setIsBMPlayerShowing(playerItem);
      isBMPlayerShowingRef.current = true;
    }
  }, []);

  const closePlayer = async (
    error: TBMPlayerErrorObject | null,
    time: string,
  ) => {
    if (bMPlayerShowingData === null) {
      return;
    }
    const floatTime = parseFloat(time);
    if (bMPlayerShowingData.savePosition) {
      if (isNaN(floatTime) || floatTime === 0.0) {
        await removeBitMovinSavedPositionByIdAndEventId(
          bMPlayerShowingData.videoId,
          bMPlayerShowingData.eventId,
        );
      } else {
        await savePosition({
          id: bMPlayerShowingData.videoId,
          position: time,
          eventId: bMPlayerShowingData.eventId,
        });
      }
    }

    if (error) {
      setBMPlayerError(error);
      return;
    }
    setIsBMPlayerShowing(null);
    isBMPlayerShowingRef.current = false;
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

  useLayoutEffect(() => {
    if (bMPlayerError) {
      globalModalManager.openModal({
        contentComponent: ErrorModal,
        contentProps: {
          confirmActionHandler: () => {
            setIsBMPlayerShowing(null);
            isBMPlayerShowingRef.current = false;
            globalModalManager.closeModal(() => {
              setBMPlayerError(null);
            });
          },
          title: "Player's Error",
          subtitle: `Something went wrong.\n${bMPlayerError.errCode}: ${
            bMPlayerError.errMessage
          }\n${bMPlayerError.url || ''}`,
        },
      });
    }
  }, [bMPlayerError]);

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
          url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
          poster: bMPlayerShowingData.poster,
          offset: bMPlayerShowingData.position || '0.0',
        }}
        title={bMPlayerShowingData.title}
        subtitle={bMPlayerShowingData.subtitle}
        onClose={closePlayer}
        analytics={{
          videoId: bMPlayerShowingData.videoId,
          title: bMPlayerShowingData.title,
          userId: '',
          experiment: '',
          customData1: '',
          customData2: '',
          customData3: '',
          customData4: '',
          customData5: '',
          customData6: '',
          customData7: '',
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
        windowSize={2}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 1,
          waitForInteraction: false,
          minimumViewTime: 100, //In milliseconds
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
