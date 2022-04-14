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
  TGeneralRef,
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
import MoveToTopSectionButton, {
  TMoveToTopSectionButtonRef,
} from '@components/EventDetailsComponents/commonControls/MoveToTopSectionButton';
import { scaleSize } from '@utils/scaleSize';

type TEventDetailsScreenProps = StackScreenProps<
  { eventDetails: { event: TEventContainer } },
  'eventDetails'
>;

const EventDetailsScreen: React.FC<TEventDetailsScreenProps> = ({ route }) => {
  const [bMPlayerShowingData, setIsBMPlayerShowing] =
    useState<TBMPlayerShowingData | null>(null);
  const [bMPlayerError, setBMPlayerError] =
    useState<TBMPlayerErrorObject | null>(null);
  const isBMPlayerShowingRef = useRef<boolean>(false);
  const { event, continueWatching } = route.params;
  const VirtualizedListRef = useRef<VirtualizedList<any>>(null);
  const eventDetailsScreenMounted = useRef<boolean>(false);
  const showPlayer = useCallback((playerItem: TBMPlayerShowingData) => {
    if (!isBMPlayerShowingRef.current && eventDetailsScreenMounted.current) {
      setIsBMPlayerShowing(playerItem);
      isBMPlayerShowingRef.current = true;
    }
  }, []);
  const generalSectionRef = useRef<TGeneralRef>(null);
  const moveToTopSectionButtonRef = useRef<TMoveToTopSectionButtonRef>(null);
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

  const moveToTopSectionCB = useCallback(() => {
    if (typeof VirtualizedListRef.current?.scrollToOffset === 'function') {
      typeof VirtualizedListRef.current.scrollToOffset({ offset: 0 });
    }
    if (
      typeof generalSectionRef.current?.focusOnFirstAvalibleButton ===
      'function'
    ) {
      generalSectionRef.current.focusOnFirstAvalibleButton();
    }
  }, []);

  const setScreenAvailabilety = useCallback(
    (screenName: string, availabilety?: boolean) => {
      if (
        typeof moveToTopSectionButtonRef.current?.setScreenAvailabilety ===
        'function'
      ) {
        typeof moveToTopSectionButtonRef.current.setScreenAvailabilety(
          screenName,
          availabilety,
        );
      }
    },
    [],
  );

  const hideMoveToTopSectionButton = useCallback(() => {
    if (typeof moveToTopSectionButtonRef.current?.hideButton === 'function') {
      moveToTopSectionButtonRef.current.hideButton();
    }
  }, []);

  const showMoveToTopSectionButton = useCallback(() => {
    if (typeof moveToTopSectionButtonRef.current?.showButton === 'function') {
      moveToTopSectionButtonRef.current.showButton();
    }
  }, []);

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
              continueWatching={continueWatching}
              isBMPlayerShowing={bMPlayerShowingData !== null}
              nextScreenText={item.nextSectionTitle}
              ref={generalSectionRef}
            />
          );
        }
        default: {
          return (
            <Component
              key={item?.key || index}
              screenName={item.key}
              event={event}
              nextScreenText={item?.nextSectionTitle}
              setScreenAvailabilety={setScreenAvailabilety}
              hideMoveToTopSectionButton={hideMoveToTopSectionButton}
              showMoveToTopSectionButton={showMoveToTopSectionButton}
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
          title: 'Player Error',
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
          url: bMPlayerShowingData.url,
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
        guidance={event.data.vs_guidance}
        guidanceDetails={event.data.vs_guidance_details}
      />
    );
  }
  return (
    <View style={styles.rootContainer}>
      <GoBack />
      <View>
        <View style={styles.moveToTopSectionButton}>
          <MoveToTopSectionButton
            ref={moveToTopSectionButtonRef}
            focusCallback={moveToTopSectionCB}
            screensNames={collectionOfEventDetailsSections
              .slice(1)
              .map(section => section.key)}
          />
        </View>
        <VirtualizedList
          ref={VirtualizedListRef}
          style={styles.scrollView}
          keyExtractor={item => item.key}
          initialNumToRender={0}
          data={collectionOfEventDetailsSections}
          renderItem={({ item, index }) => {
            return sectionsFactory(item, index);
          }}
          getItemCount={data => data?.length || 0}
          windowSize={3}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 1,
            waitForInteraction: false,
            minimumViewTime: 100, //In milliseconds
          }}
          onViewableItemsChanged={info => {
            let itemForScrolling: ViewToken | undefined;
            if (
              info.viewableItems.length > 1 &&
              info.changed.length &&
              (itemForScrolling = info.changed.find(
                item => item.isViewable,
              )) !== undefined &&
              itemForScrolling.index !== null
            ) {
              if (
                typeof moveToTopSectionButtonRef.current?.hideButton ===
                'function'
              ) {
                moveToTopSectionButtonRef.current.hideButton();
              }
              VirtualizedListRef.current?.scrollToIndex({
                animated: true,
                index: itemForScrolling.index,
              });
            }
            if (
              info.viewableItems.length === 1 &&
              typeof moveToTopSectionButtonRef.current?.setActiveScreenIndex ===
                'function' &&
              info.viewableItems[0].index !== null
            ) {
              moveToTopSectionButtonRef.current.setActiveScreenIndex(
                info.viewableItems[0].index - 1,
              );
            }
            if (
              !info.viewableItems.length &&
              typeof moveToTopSectionButtonRef.current?.hideButton ===
                'function'
            ) {
              moveToTopSectionButtonRef.current.hideButton();
            }
          }}
          getItem={(data, index) => data[index]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              if (
                !eventDetailsScreenMounted ||
                !eventDetailsScreenMounted.current ||
                info.index === undefined ||
                !VirtualizedListRef.current
              ) {
                return;
              }
              VirtualizedListRef.current.scrollToIndex({
                animated: true,
                index: info.index,
              });
            });
          }}
        />
      </View>
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
  moveToTopSectionButton: {
    position: 'absolute',
    bottom: scaleSize(60),
    left: 0,
  },
});

export default EventDetailsScreen;
