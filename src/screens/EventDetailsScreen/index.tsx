import React, { useCallback, useRef, useState } from 'react';
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
  goBackButtonWidth,
} from '@configs/eventDetailsConfig';
import { isTVOS } from '@configs/globalConfig';
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
  const movedToTopSection = useRef<boolean>(false);

  const moveToTopSectionButtonRef = useRef<TMoveToTopSectionButtonRef>(null);
  const listOfFocusedRefs = useRef<
    Array<
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number
    >
  >([]);
  const moveToTopSectionCB = useCallback(() => {
    if (
      typeof VirtualizedListRef.current?.scrollToOffset === 'function' &&
      movedToTopSection.current === false
    ) {
      movedToTopSection.current = true;
      VirtualizedListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, []);

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

  const setRefToMovingUp = useCallback(
    (
      index,
      cp:
        | React.Component<any, any, any>
        | React.ComponentClass<any, any>
        | null
        | number,
    ) => {
      listOfFocusedRefs.current[index] = cp;
    },
    [],
  );
  const getPrevRefToMovingUp = useCallback((index: number) => {
    for (let i = index - 1; i >= 0; i--) {
      if (
        listOfFocusedRefs.current[i] !== null &&
        typeof listOfFocusedRefs.current[i] !== 'number' &&
        listOfFocusedRefs.current[i] !== undefined
      ) {
        return [listOfFocusedRefs.current[i]];
      }
    }
    return [];
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
              continueWatching={Boolean(continueWatching)}
              nextScreenText={item.nextSectionTitle}
              ref={generalSectionRef}
              openPlayer={openPlayer}
              closePlayer={closePlayer}
              closeModal={closeModal}
              setRefToMovingUp={setRefToMovingUp}
              index={index}
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
              hideMoveToTopSectionButton={hideMoveToTopSectionButton}
              showMoveToTopSectionButton={showMoveToTopSectionButton}
              openPlayer={openPlayer}
              closePlayer={closePlayer}
              closeModal={closeModal}
              setRefToMovingUp={setRefToMovingUp}
              getPrevRefToMovingUp={getPrevRefToMovingUp}
              index={index}
            />
          );
        }
      }
    },
    [
      event,
      continueWatching,
      hideMoveToTopSectionButton,
      showMoveToTopSectionButton,
      closePlayer,
      openPlayer,
      closeModal,
      getPrevRefToMovingUp,
      setRefToMovingUp,
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
      {!isTVOS && <GoBack />}
      <View style={styles.contentContainer}>
        <VirtualizedList
          ref={VirtualizedListRef}
          style={styles.scrollView}
          keyExtractor={item => item.key}
          initialNumToRender={1}
          ListFooterComponent={() =>
            console.log('dsdsdqqqq') ||
            collectionOfEventDetailsSections.length > 1 ? (
              <View style={styles.moveToTopSectionButton}>
                <MoveToTopSectionButton
                  ref={moveToTopSectionButtonRef}
                  focusCallback={moveToTopSectionCB}
                  screensNames={collectionOfEventDetailsSections
                    .slice(1)
                    .map(section => section.key)}
                />
              </View>
            ) : null
          }
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
              VirtualizedListRef.current?.scrollToIndex({
                animated: false,
                index: itemForScrolling.index,
              });
            }
            if (
              info.viewableItems.length === 1 &&
              movedToTopSection.current &&
              typeof generalSectionRef.current?.focusOnFirstAvalibleButton ===
                'function' &&
              info.viewableItems[0].index === 0
            ) {
              generalSectionRef.current.focusOnFirstAvalibleButton();
              movedToTopSection.current = false;
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
                animated: false,
                index: info.index,
              });
            });
          }}
        />
      </View>
      {isTVOS && <GoBack />}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    height: Dimensions.get('window').height,
    flexDirection: isTVOS ? 'row-reverse' : 'row',
  },
  contentContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width - goBackButtonWidth,
    //flexDirection: isTVOS ? 'column-reverse' : 'column',
  },
  scrollView: {
    flex: 1,
  },
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  moveToTopSectionButton: {
    top: -scaleSize(60),
    left: 0,
  },
});

export default EventDetailsScreen;
