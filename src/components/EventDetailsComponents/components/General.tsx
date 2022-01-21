import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useLayoutEffect,
  useCallback,
} from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import FastImage from 'react-native-fast-image';
import { TEventContainer } from '@services/types/models';
import get from 'lodash.get';
import GoDown from '../commonControls/GoDown';
import Watch from '@assets/svg/eventDetails/Watch.svg';
import AddToMyList from '@assets/svg/eventDetails/AddToMyList.svg';
import Trailer from '@assets/svg/eventDetails/Trailer.svg';
import ActionButtonList, {
  EActionButtonListType,
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
} from '@components/GlobalModal/variants';
import Prismic from '@prismicio/client';
import { getSubscribeInfo, fetchVideoURL } from '@services/apiClient';
import { getVideoDetails } from '@services/prismicApiClient';
import { getBitMovinSavedPosition } from '@services/bitMovinPlayer';
import {
  resumeRollbackTime,
  minResumeTime,
} from '@configs/bitMovinPlayerConfig';
import TVEventHandler from 'react-native/Libraries/Components/AppleTV/TVEventHandler';

type Props = {
  event: TEventContainer;
  nextScreenText: string;
  isBMPlayerShowing: boolean;
  continueWatching: boolean;
  showPlayer: (...args: any[]) => void;
};

const General: React.FC<Props> = ({
  event,
  showPlayer,
  nextScreenText = 'Some Screen',
  continueWatching,
}) => {
  const tvEventHandler = useRef<typeof TVEventHandler>(new TVEventHandler());
  const tvEventFireCounter = useRef<number>(0);
  const generalMountedRef = useRef<boolean | undefined>(false);
  const addOrRemoveBusyRef = useRef<boolean>(true);
  const watchNowButtonRef = useRef(null);
  const [existInMyList, setExistInMyList] = useState<boolean>(false);
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
  const shortDescription = get(
    event.data,
    ['vs_event_details', 'shortDescription'],
    '',
  ).replace(/(<([^>]+)>)/gi, '');
  const snapshotImageUrl = get(
    event.data,
    ['vs_event_image', 'high_event_image', 'url'],
    '',
  ).replace(
    /w=\d+&h=\d+$/i,
    `w=${scaleSize(975)}&h=${Dimensions.get('window').height}`,
  );

  const videos = get(event.data, 'vs_videos', []).map(({ video }) => video.id);

  const updateContinueWatching = async () => {
    if (continueWatching) {
      return;
    }
    const result = await Promise.all([
      getSubscribeInfo(),
      getVideoDetails({
        queryPredicates: [Prismic.predicates.any('document.id', videos)],
      }),
    ]);
    if (
      result[0].status >= 400 ||
      result[0]?.data?.data?.attributes?.isSubscriptionActive === undefined
    ) {
      return;
    }

    if (result[0]?.data?.data?.attributes?.isSubscriptionActive) {
      const videoFromPrismic = result[1].results.find(
        prismicResponseResult =>
          prismicResponseResult.data?.video?.video_type === 'performance',
      );

      if (videoFromPrismic === undefined) {
        return;
      }

      const videoPositionInfo = await getBitMovinSavedPosition(
        videoFromPrismic.id,
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
    }
  };

  const getPerformanceVideoUrl = useCallback(
    async (ref?: RefObject<TouchableHighlight>) => {
      try {
        if (!videos.length) {
          throw new Error('Something went wrong');
        }
        const result = await Promise.all([
          getSubscribeInfo(),
          getVideoDetails({
            queryPredicates: [Prismic.predicates.any('document.id', videos)],
          }),
        ]);
        if (
          result[0].status >= 400 ||
          result[0]?.data?.data?.attributes?.isSubscriptionActive === undefined
        ) {
          throw new Error('Something went wrong');
        }
        if (!result[0]?.data?.data?.attributes?.isSubscriptionActive) {
          globalModalManager.openModal({
            contentComponent: NonSubscribedModeAlert,
            contentProps: {
              confirmActionHandler: () => {
                globalModalManager.closeModal(() => {
                  if (typeof ref?.current?.setNativeProps === 'function') {
                    ref.current.setNativeProps({ hasTVPreferredFocus: true });
                  }
                });
              },
            },
          });
          return;
        }

        const videoFromPrismic = result[1].results.find(
          prismicResponseResult =>
            prismicResponseResult.data?.video?.video_type === 'performance',
        );

        if (videoFromPrismic === undefined) {
          throw new Error('Something went wrong');
        }

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
            hasBackground: true,
            hasLogo: true,
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
              videoTitle: title,
              fromTime: fromTime.toISOString().substr(11, 8),
            },
          });
          return;
        }
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
      } catch (err: any) {
        globalModalManager.openModal({
          contentComponent: ErrorModal,
          contentProps: {
            confirmActionHandler: () => {
              globalModalManager.closeModal(() => {
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
    },
    [event.id, showPlayer, title, videos],
  );

  const getTrailerVideoUrl = async (ref?: RefObject<TouchableHighlight>) => {
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

  const actionButtonListFactory = (typeOfList: EActionButtonListType) => {
    const buttonListCollection = {
      [EActionButtonListType.common]: [
        {
          key: 'WatchNow',
          text:
            continueWatching || showContinueWatching
              ? 'Continue watching'
              : 'Watch now',
          hasTVPreferredFocus: true,
          onPress: getPerformanceVideoUrl,
          onFocus: () => console.log('Watch now focus'),
          Icon: Watch,
        },
        {
          key: 'AddToMyList',
          text: (existInMyList ? 'Remove from' : 'Add to') + ' my list',
          onPress: addOrRemoveItemIdFromMyListHandler,
          onFocus: () => console.log('Add to my list focus'),
          Icon: AddToMyList,
        },
        {
          key: 'WatchTrailer',
          text: 'Watch trailer',
          onPress: getTrailerVideoUrl,
          onFocus: () => console.log('Watch trailer focus'),
          Icon: Trailer,
        },
      ],
      [EActionButtonListType.withoutTrailers]: [
        {
          key: 'WatchNow',
          text:
            continueWatching || showContinueWatching
              ? 'Continue watching'
              : 'Watch now',
          hasTVPreferredFocus: true,
          onPress: getPerformanceVideoUrl,
          onFocus: () => console.log('Watch now focus'),
          Icon: Watch,
        },
        {
          key: 'AddToMyList',
          text: (existInMyList ? 'Remove from' : 'Add to') + ' my list',
          onPress: addOrRemoveItemIdFromMyListHandler,
          onFocus: () => console.log('Add to my list focus'),
          Icon: AddToMyList,
        },
      ],
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

  useEffect(() => {
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

  useLayoutEffect(() => {
    tvEventHandler.current?.enable(null, async (_: any, eve: any) => {
      if (eve?.eventType !== 'playPause') {
        return;
      }
      if (tvEventFireCounter.current === 1) {
        tvEventFireCounter.current = 0;
        await getPerformanceVideoUrl(watchNowButtonRef);
        return;
      }
      tvEventFireCounter.current += 1;
    });
    return () => {
      tvEventHandler?.current.disable();
    };
  }, [getPerformanceVideoUrl]);

  return (
    <View style={styles.generalContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.descriptionContainer}>
          <RohText style={styles.title} numberOfLines={2}>
            {title.toUpperCase()}
          </RohText>
          <RohText style={styles.description}>{shortDescription}</RohText>
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
        <View style={styles.downContainer}>
          <GoDown text={nextScreenText} />
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
};

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
});

export default General;
