import React, { useCallback, useRef } from 'react';
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

import { useFocusEffect } from '@react-navigation/native';
import MoveToTopSectionButton, {
  TMoveToTopSectionButtonRef,
} from '@components/EventDetailsComponents/commonControls/MoveToTopSectionButton';
import { scaleSize } from '@utils/scaleSize';
import { goBackButtonuManager } from '@components/GoBack';
import { globalModalManager } from '@components/GlobalModal';
import { ErrorModal, PlayerModal } from '@components/GlobalModal/variants';
import { TBMPlayerErrorObject } from '@services/types/bitmovinPlayer';
type TEventDetailsScreenProps = StackScreenProps<
  { eventDetails: { event: TEventContainer; continueWatching?: boolean } },
  'eventDetails'
>;

const EventDetailsScreen: React.FC<TEventDetailsScreenProps> = ({ route }) => {
  const { event, continueWatching } = route.params;
  const VirtualizedListRef = useRef<VirtualizedList<any>>(null);
  const eventDetailsScreenMounted = useRef<boolean>(false);
  const generalSectionRef = useRef<TGeneralRef>(null);
  const moveToTopSectionButtonRef = useRef<TMoveToTopSectionButtonRef>(null);

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

  const openPlayer = useCallback(
    ({
      url,
      poster = '',
      offset = '0.0',
      title: playerTitle = '',
      subtitle = '',
      onClose = () => {},
      analytics = {},
      guidance = '',
      guidanceDetails = [],
    }) => {
      goBackButtonuManager.hideGoBackButton();
      globalModalManager.openModal({
        contentComponent: PlayerModal,
        contentProps: {
          autoPlay: true,
          configuration: {
            url,
            poster,
            offset,
          },
          title: playerTitle,
          subtitle,
          onClose,
          analytics,
          guidance,
          guidanceDetails,
        },
      });
    },
    [],
  );

  const closeModal = useCallback((ref, clearLoadingState) => {
    if (typeof ref?.current?.setNativeProps === 'function') {
      ref.current.setNativeProps({
        hasTVPreferredFocus: true,
      });
    }
    goBackButtonuManager.showGoBackButton();
    if (typeof clearLoadingState === 'function') {
      clearLoadingState();
    }
  }, []);

  const closePlayer = useCallback(
    ({
        savePositionCB,
        videoId,
        eventId,
        ref,
        clearLoadingState,
        closeModalCB = closeModal,
      }) =>
      async (error: TBMPlayerErrorObject | null, time: string) => {
        if (typeof savePositionCB === 'function') {
          await savePositionCB({ time, videoId, eventId });
        }
        if (error) {
          globalModalManager.openModal({
            contentComponent: ErrorModal,
            contentProps: {
              confirmActionHandler: () => {
                globalModalManager.closeModal(() => {
                  if (typeof closeModalCB === 'function') {
                    closeModalCB(ref, clearLoadingState);
                  }
                });
              },
              title: 'Player Error',
              subtitle: `Something went wrong.\n${error.errCode}: ${
                error.errMessage
              }\n${error.url || ''}`,
            },
          });
        } else {
          globalModalManager.closeModal(() => {
            if (typeof closeModalCB === 'function') {
              closeModalCB(ref, clearLoadingState);
            }
          });
        }
      },
    [closeModal],
  );

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
              continueWatching={Boolean(continueWatching)}
              nextScreenText={item.nextSectionTitle}
              ref={generalSectionRef}
              openPlayer={openPlayer}
              closePlayer={closePlayer}
              closeModal={closeModal}
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
              openPlayer={openPlayer}
              closePlayer={closePlayer}
              closeModal={closeModal}
            />
          );
        }
      }
    },
    [
      event,
      continueWatching,
      hideMoveToTopSectionButton,
      setScreenAvailabilety,
      showMoveToTopSectionButton,
      closePlayer,
      openPlayer,
      closeModal,
    ],
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

  return (
    <View style={styles.rootContainer}>
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
      <GoBack />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    height: Dimensions.get('window').height,
    flexDirection: 'row-reverse',
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
