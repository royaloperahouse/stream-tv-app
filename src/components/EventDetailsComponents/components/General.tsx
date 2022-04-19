import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useLayoutEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import FastImage from 'react-native-fast-image';
import { TEventContainer } from '@services/types/models';
import get from 'lodash.get';
import Watch from '@assets/svg/eventDetails/Watch.svg';
import AddToMyList from '@assets/svg/eventDetails/AddToMyList.svg';
import Trailer from '@assets/svg/eventDetails/Trailer.svg';
import ActionButtonList, {
  EActionButtonListType,
  TActionButtonListRef,
} from '../commonControls/ActionButtonList';

import {
  hasMyListItem,
  removeIdFromMyList,
  addToMyList,
} from '@services/myList';

import { globalModalManager } from '@components/GlobalModal';
import {
  NonSubscribedModeAlert,
  СontinueWatchingModal,
  ErrorModal,
  RentalStateStatusModal,
} from '@components/GlobalModal/variants';
import {
  NonSubscribedStatusError,
  NotRentedItemError,
  UnableToCheckRentalStatusError,
} from '@utils/customErrors';
import Prismic from '@prismicio/client';
import { fetchVideoURL, getAccessToWatchVideo } from '@services/apiClient';
import { getVideoDetails } from '@services/prismicApiClient';
import { getBitMovinSavedPosition } from '@services/bitMovinPlayer';
import {
  resumeRollbackTime,
  minResumeTime,
} from '@configs/bitMovinPlayerConfig';
import TVEventHandler from 'react-native/Libraries/Components/AppleTV/TVEventHandler';
import { promiseWait } from '@utils/promiseWait';
import { needSubscribedModeInfoUpdateSelector } from '@services/store/auth/Selectors';
import { shallowEqual, useSelector } from 'react-redux';
import moment from 'moment';
import CountDown from '@components/EventDetailsComponents/commonControls/CountDown';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '@themes/Styleguide';
import { OverflowingContainer } from '@components/OverflowingContainer';

export type TGeneralRef = Partial<{ focusOnFirstAvalibleButton: () => void }>;

type Props = {
  event: TEventContainer;
  nextScreenText: string;
  isBMPlayerShowing: boolean;
  continueWatching: boolean;
  showPlayer: (...args: any[]) => void;
};

const General = forwardRef<TGeneralRef, Props>(
  ({ event, showPlayer, continueWatching }, ref) => {
    const isFocused = useIsFocused();
    const nowDate = moment.utc(moment());
    const [closeCountDown, setCloseCountDown] = useState(false);
    const publishingDate = moment.utc(
      get(
        event.data,
        'diese_activity.asset_availability_window.startDateTime',
        null,
      ),
    );
    const showCountDownTimer =
      isFocused &&
      !closeCountDown &&
      publishingDate.isValid() &&
      publishingDate.isAfter(nowDate);
    const tvEventHandler = useRef<typeof TVEventHandler>(new TVEventHandler());
    const performanceVideoInFocus = useRef<
      TouchableHighlight | null | undefined
    >(null);
    const trailerVideoInFocus = useRef<TouchableHighlight | null | undefined>(
      null,
    );
    const generalMountedRef = useRef<boolean | undefined>(false);
    const addOrRemoveBusyRef = useRef<boolean>(true);
    const watchNowButtonRef = useRef<TActionButtonListRef>(null);

    const [existInMyList, setExistInMyList] = useState<boolean>(false);
    const needSubscribedModeInfoUpdate = useSelector(
      needSubscribedModeInfoUpdateSelector,
      shallowEqual,
    );
    const [showContinueWatching, setShowContinueWatching] =
      useState<boolean>(false);
    const [hideWatchTrailerButton, setHideWatchTrailerButton] =
      useState<boolean>(true);
    const title: string =
      get(event.data, ['vs_title', '0', 'text'], '').replace(
        /(<([^>]+)>)/gi,
        '',
      ) ||
      get(event.data, ['vs_event_details', 'title'], '').replace(
        /(<([^>]+)>)/gi,
        '',
      );

    const shortDescription = (
      event.data.vs_description.reduce((acc, description) => {
        acc += description.text + '\n';
        return acc;
      }, '') || get(event, ['vs_event_details', 'description'], '')
    ).replace(/(<([^>]+)>)/gi, '');

    const snapshotImageUrl = get(
      event.data,
      ['vs_event_image', 'high_event_image', 'url'],
      '',
    );

    const videos = get(event.data, 'vs_videos', []).map(
      ({ video }) => video.id,
    );
    const vs_guidance = get(event.data, 'vs_guidance', '');
    const vs_guidance_details = get(event.data, 'vs_guidance_details', []);

    const updateContinueWatching = async () => {
      if (continueWatching) {
        return;
      }
      try {
        const videoFromPrismic = needSubscribedModeInfoUpdate
          ? await getAccessToWatchVideo(
              getVideoDetails({
                queryPredicates: [
                  Prismic.predicates.any('document.id', videos),
                ],
              }),
            )
          : (
              await getVideoDetails({
                queryPredicates: [
                  Prismic.predicates.any('document.id', videos),
                ],
              })
            ).results.find(
              (prismicResponseResult: any) =>
                prismicResponseResult.data?.video?.video_type === 'performance',
            );

        const videoPositionInfo = await getBitMovinSavedPosition(
          videoFromPrismic?.id || '',
          event.id,
        );
        if (
          videoPositionInfo !== null &&
          parseInt(videoPositionInfo.position) > minResumeTime &&
          generalMountedRef &&
          generalMountedRef.current
        ) {
          setShowContinueWatching(true);
        }
      } catch (err: any) {}
    };

    const getPerformanceVideoUrl = useCallback(
      async (
        ref?: RefObject<TouchableHighlight>,
        clearLoadingState?: () => void,
      ) => {
        try {
          if (!videos.length) {
            throw new Error('Something went wrong');
          }
          if (needSubscribedModeInfoUpdate) {
            globalModalManager.openModal({
              contentComponent: RentalStateStatusModal,
              contentProps: {
                title,
              },
            });
          }

          const videoFromPrismic = needSubscribedModeInfoUpdate
            ? await promiseWait(
                getAccessToWatchVideo(
                  getVideoDetails({
                    queryPredicates: [
                      Prismic.predicates.any('document.id', videos),
                    ],
                  }),
                ),
              )
            : (
                await getVideoDetails({
                  queryPredicates: [
                    Prismic.predicates.any('document.id', videos),
                  ],
                })
              ).results.find(
                (prismicResponseResult: any) =>
                  prismicResponseResult.data?.video?.video_type ===
                  'performance',
              );

          const manifestInfo = await fetchVideoURL(videoFromPrismic.id);
          if (!manifestInfo?.data?.data?.attributes?.hlsManifestUrl) {
            throw new Error('Something went wrong');
          }
          const videoPositionInfo = await getBitMovinSavedPosition(
            videoFromPrismic.id,
            event.id,
          );
          if (
            videoPositionInfo &&
            videoPositionInfo?.position &&
            parseInt(videoPositionInfo?.position) > minResumeTime
          ) {
            const fromTime = new Date(0);
            const intPosition = parseInt(videoPositionInfo.position);
            const rolledBackPos = intPosition - resumeRollbackTime;
            fromTime.setSeconds(intPosition);
            globalModalManager.openModal({
              contentComponent: СontinueWatchingModal,
              contentProps: {
                confirmActionHandler: () => {
                  globalModalManager.closeModal(() => {
                    showPlayer({
                      videoId: videoFromPrismic.id,
                      url: manifestInfo.data.data.attributes.hlsManifestUrl,
                      title:
                        videoFromPrismic.data?.video_title[0]?.text ||
                        title ||
                        '',
                      poster:
                        'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
                      subtitle: '',
                      position: rolledBackPos.toString(),
                      eventId: event.id,
                      savePosition: true,
                    });
                  });
                },
                rejectActionHandler: () => {
                  globalModalManager.closeModal(() => {
                    showPlayer({
                      videoId: videoFromPrismic.id,
                      url: manifestInfo.data.data.attributes.hlsManifestUrl,
                      title:
                        videoFromPrismic.data?.video_title[0]?.text ||
                        title ||
                        '',
                      poster:
                        'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
                      subtitle: '',
                      position: '0.0',
                      eventId: event.id,
                      savePosition: true,
                    });
                  });
                },
                cancelActionHandler: () => {
                  globalModalManager.closeModal(() => {
                    if (typeof clearLoadingState === 'function') {
                      clearLoadingState();
                    }
                    if (typeof ref?.current?.setNativeProps === 'function') {
                      ref.current.setNativeProps({
                        hasTVPreferredFocus: true,
                      });
                    }
                  });
                },
                videoTitle: title,
                fromTime: fromTime.toISOString().substr(11, 8),
              },
            });
            return;
          }
          globalModalManager.closeModal(() => {
            showPlayer({
              videoId: videoFromPrismic.id,
              url: manifestInfo.data.data.attributes.hlsManifestUrl,
              title: videoFromPrismic.data?.video_title[0]?.text || title || '',
              poster:
                'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
              subtitle: '',
              position: '0.0',
              eventId: event.id,
              savePosition: true,
            });
          });
        } catch (err: any) {
          globalModalManager.openModal({
            contentComponent:
              err instanceof NonSubscribedStatusError
                ? NonSubscribedModeAlert
                : ErrorModal,
            contentProps: {
              confirmActionHandler: () => {
                globalModalManager.closeModal(() => {
                  if (typeof clearLoadingState === 'function') {
                    clearLoadingState();
                  }
                  if (typeof ref?.current?.setNativeProps === 'function') {
                    ref.current.setNativeProps({
                      hasTVPreferredFocus: true,
                    });
                  }
                });
              },
              title:
                err instanceof NonSubscribedStatusError ||
                err instanceof NotRentedItemError ||
                err instanceof UnableToCheckRentalStatusError
                  ? err.message
                  : 'Player Error',
              subtitle:
                err instanceof NonSubscribedStatusError ||
                err instanceof NotRentedItemError ||
                err instanceof UnableToCheckRentalStatusError
                  ? undefined
                  : err.message,
            },
          });
        }
      },
      [event.id, showPlayer, title, videos, needSubscribedModeInfoUpdate],
    );

    const getTrailerVideoUrl = async (
      ref?: RefObject<TouchableHighlight>,
      clearLoadingState?: () => void,
    ) => {
      try {
        if (!videos.length) {
          throw new Error('Something went wrong');
        }
        const prismicResponse = await getVideoDetails({
          queryPredicates: [Prismic.predicates.any('document.id', videos)],
        });

        const videoFromPrismic = prismicResponse.results.find(
          prismicResponseResult =>
            prismicResponseResult.data?.video?.video_type === 'trailer',
        );
        if (videoFromPrismic === undefined) {
          throw new Error('Something went wrong');
        }
        const manifestInfo = await fetchVideoURL(videoFromPrismic.id);
        if (!manifestInfo?.data?.data?.attributes?.hlsManifestUrl) {
          throw new Error('Something went wrong');
        }
        showPlayer({
          videoId: videoFromPrismic.id,
          url: manifestInfo.data.data.attributes.hlsManifestUrl,
          title: videoFromPrismic.data?.video_title[0]?.text || title || '',
          poster:
            'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
          subtitle: '',
          eventId: event.id,
          position: '0.0',
        });
      } catch (err: any) {
        globalModalManager.openModal({
          contentComponent: ErrorModal,
          contentProps: {
            confirmActionHandler: () => {
              globalModalManager.closeModal(() => {
                if (typeof clearLoadingState === 'function') {
                  clearLoadingState();
                }
                if (typeof ref?.current?.setNativeProps === 'function') {
                  ref.current.setNativeProps({ hasTVPreferredFocus: true });
                }
              });
            },
            title: 'Player Error',
            subtitle: err.message,
          },
        });
      }
    };

    const addOrRemoveItemIdFromMyListHandler = () => {
      if (addOrRemoveBusyRef.current) {
        return;
      }
      addOrRemoveBusyRef.current = true;
      (existInMyList ? removeIdFromMyList : addToMyList)(event.id, () => {
        hasMyListItem(event.id)
          .then(isExist => {
            if (generalMountedRef.current) {
              setExistInMyList(isExist);
            }
          })
          .finally(() => {
            if (generalMountedRef.current) {
              addOrRemoveBusyRef.current = false;
            }
          });
      });
    };

    const setPerformanceVideoInFocus = useCallback(
      (ref?: RefObject<TouchableHighlight>) => {
        performanceVideoInFocus.current = ref?.current;
      },
      [],
    );
    const setTrailerVideoInFocus = useCallback(
      (ref?: RefObject<TouchableHighlight>) => {
        trailerVideoInFocus.current = ref?.current;
      },
      [],
    );

    const setPerformanceVideoBlur = useCallback(() => {
      performanceVideoInFocus.current = null;
    }, []);
    const setTrailerVideoBlur = useCallback(() => {
      trailerVideoInFocus.current = null;
    }, []);

    const actionButtonListFactory = (typeOfList: EActionButtonListType) => {
      const buttonListCollection: {
        [key: string]: Array<{
          key: string;
          text: string;
          hasTVPreferredFocus?: boolean;
          onPress: (
            ref?: React.RefObject<TouchableHighlight> | undefined,
            clearLoadingState?: () => void,
          ) => Promise<void> | void;
          onFocus?: (
            ref?: React.RefObject<TouchableHighlight> | undefined,
          ) => void;
          onBlur?: () => void;
          Icon: any;
          showLoader?: boolean;
          freezeButtonAfterPressing?: boolean;
        }>;
      } = {
        [EActionButtonListType.common]: [
          {
            key: 'WatchNow',
            text:
              continueWatching || showContinueWatching
                ? 'Continue watching'
                : 'Watch now',
            hasTVPreferredFocus: true,
            onPress: getPerformanceVideoUrl,
            onFocus: setPerformanceVideoInFocus,
            onBlur: setPerformanceVideoBlur,
            Icon: Watch,
            showLoader: true,
            freezeButtonAfterPressing: true,
          },
          {
            key: 'AddToMyList',
            text: (existInMyList ? 'Remove from' : 'Add to') + ' my list',
            onPress: addOrRemoveItemIdFromMyListHandler,
            Icon: AddToMyList,
            hasTVPreferredFocus: showCountDownTimer,
          },
          {
            key: 'WatchTrailer',
            text: 'Watch trailer',
            onPress: getTrailerVideoUrl,
            onFocus: setTrailerVideoInFocus,
            onBlur: setTrailerVideoBlur,
            showLoader: true,
            freezeButtonAfterPressing: true,
            Icon: Trailer,
          },
        ].filter(item => {
          if (showCountDownTimer && item.key === 'WatchNow') {
            return false;
          }
          return true;
        }),
        [EActionButtonListType.withoutTrailers]: [
          {
            key: 'WatchNow',
            text:
              continueWatching || showContinueWatching
                ? 'Continue watching'
                : 'Watch now',
            hasTVPreferredFocus: true,
            onPress: getPerformanceVideoUrl,
            onFocus: setPerformanceVideoInFocus,
            onBlur: setPerformanceVideoBlur,
            showLoader: true,
            freezeButtonAfterPressing: true,
            Icon: Watch,
          },
          {
            key: 'AddToMyList',
            text: (existInMyList ? 'Remove from' : 'Add to') + ' my list',
            onPress: addOrRemoveItemIdFromMyListHandler,
            Icon: AddToMyList,
            hasTVPreferredFocus: showCountDownTimer,
          },
        ].filter(item => {
          if (showCountDownTimer && item.key === 'WatchNow') {
            return false;
          }
          return true;
        }),
      };
      if (typeOfList in buttonListCollection) {
        return buttonListCollection[typeOfList];
      }
      return buttonListCollection[EActionButtonListType.common];
    };

    const showWatchTrailerButton = async () => {
      if (!videos.length) {
        setHideWatchTrailerButton(false);
      }
      const prismicResponse = await getVideoDetails({
        queryPredicates: [Prismic.predicates.any('document.id', videos)],
      });

      const videoFromPrismic = prismicResponse.results.find(
        prismicResponseResult =>
          prismicResponseResult.data?.video?.video_type === 'trailer',
      );
      if (!generalMountedRef.current) {
        return;
      }
      setHideWatchTrailerButton(!videoFromPrismic);
    };

    useEffect(() => {
      hasMyListItem(event.id)
        .then(isExist => setExistInMyList(isExist))
        .finally(() => {
          addOrRemoveBusyRef.current = false;
        });
    }, [event.id]);

    useImperativeHandle(
      ref,
      () => ({
        focusOnFirstAvalibleButton: () => {
          if (
            typeof watchNowButtonRef.current?.focusOnFirstAvalibleButton ===
            'function'
          ) {
            watchNowButtonRef.current.focusOnFirstAvalibleButton();
          }
        },
      }),
      [],
    );

    useLayoutEffect(() => {
      generalMountedRef.current = true;
      return () => {
        if (generalMountedRef.current) {
          generalMountedRef.current = false;
        }
      };
    }, []);

    useEffect(() => {
      updateContinueWatching();
      showWatchTrailerButton();
    }, []);

    /* todo disable tvEventHandler on section blur and enable when section in focus

  useLayoutEffect(() => {
    tvEventHandler.current?.enable(null, async (_: any, eve: any) => {
      if (eve?.eventType !== 'playPause' || showCountDownTimer) {
        return;
      }
      if (eve.eventKeyAction === 1) {
        tvEventFireCounter.current = 0;
        await getPerformanceVideoUrl(watchNowButtonRef);
        return;
      }
      tvEventFireCounter.current += 1;
    });
    return () => {
      tvEventHandler?.current.disable();
    };
  }, [getPerformanceVideoUrl, showCountDownTimer]); */

    return (
      <View style={styles.generalContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.descriptionContainer}>
            <OverflowingContainer
              fixedHeight
              contentMaxVisibleHeight={scaleSize(368)}>
              <RohText style={styles.title} numberOfLines={2}>
                {title.toUpperCase()}
              </RohText>
              <RohText style={styles.description}>{shortDescription}</RohText>
              {Boolean(vs_guidance) && (
                <RohText style={styles.description}>{vs_guidance}</RohText>
              )}
              {Array.isArray(vs_guidance_details) &&
              vs_guidance_details.length ? (
                <RohText style={styles.description}>
                  {vs_guidance_details.reduce(
                    (acc: string, guidance_detail: any, i: number) => {
                      if (guidance_detail.text) {
                        acc +=
                          guidance_detail.type === 'paragraph'
                            ? guidance_detail.text + '\n'
                            : i > 0
                            ? ' ' + guidance_detail.text
                            : guidance_detail.text;
                      }
                      return acc;
                    },
                    '',
                  )}
                </RohText>
              ) : null}
            </OverflowingContainer>
            {showCountDownTimer && (
              <CountDown
                publishingDate={publishingDate}
                nowDate={nowDate}
                finishCB={() => {
                  setCloseCountDown(true);
                }}
              />
            )}
            <View style={styles.buttonsContainer}>
              <ActionButtonList
                ref={watchNowButtonRef}
                buttonsFactory={actionButtonListFactory}
                type={
                  hideWatchTrailerButton
                    ? EActionButtonListType.withoutTrailers
                    : EActionButtonListType.common
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.snapshotContainer}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={styles.snapshotContainer}
            source={{ uri: snapshotImageUrl }}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    width: '100%',
    flexDirection: 'row',
  },
  contentContainer: {
    width: scaleSize(785),
    height: '100%',
  },
  descriptionContainer: {
    flex: 1,
    marginTop: scaleSize(230),
    marginRight: scaleSize(130),
    width: scaleSize(615),
  },
  downContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(50),
    marginBottom: scaleSize(60),
  },
  snapshotContainer: {
    width: scaleSize(975),
    height: Dimensions.get('window').height,
    zIndex: 0,
  },
  pageTitle: {
    color: 'white',
    fontSize: scaleSize(22),
    textTransform: 'uppercase',
  },
  title: {
    color: 'white',
    fontSize: scaleSize(48),
    marginTop: scaleSize(24),
    marginBottom: scaleSize(24),
    textTransform: 'uppercase',
  },
  ellipsis: {
    color: 'white',
    fontSize: scaleSize(22),
    textTransform: 'uppercase',
  },
  description: {
    color: 'white',
    fontSize: scaleSize(22),
    marginTop: scaleSize(12),
  },
  info: {
    color: 'white',
    fontSize: scaleSize(20),
    textTransform: 'uppercase',
    marginTop: scaleSize(24),
  },
  buttonsContainer: {
    width: '100%',
    height: scaleSize(272),
    marginTop: scaleSize(50),
  },
  guidanceContainer: {},
  guidanceSubTitle: {
    fontSize: scaleSize(26),
    color: Colors.defaultTextColor,
  },
});

export default General;
