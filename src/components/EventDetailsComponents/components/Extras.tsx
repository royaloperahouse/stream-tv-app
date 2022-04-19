import React, {
  useState,
  useEffect,
  useRef,
  createRef,
  RefObject,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  VirtualizedList,
  TouchableHighlight,
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer } from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import { Colors } from '@themes/Styleguide';
import { getVideoDetails } from '@services/prismicApiClient';
import Prismic from '@prismicio/client';
import ExtrasInfoBlock, {
  TExtrasInfoBlockRef,
} from '../commonControls/ExtrasInfoBlock';
import ExtrasVideoButton from '@components/EventDetailsComponents/commonControls/ExtrasVideoButton';
import Player from '@components/Player';
import { fetchVideoURL } from '@services/apiClient';
import { goBackButtonuManager } from '@components/GoBack';
import {
  TBMPlayerShowingData,
  TBMPlayerErrorObject,
} from '@services/types/bitmovinPlayer';
import ScrollingPagination, {
  TScrolingPaginationRef,
} from '@components/ScrollingPagination';
import { globalModalManager } from '@components/GlobalModal';
import { ErrorModal } from '@components/GlobalModal/variants';

type ExtrasProps = {
  event: TEventContainer;
  nextScreenText: string;
  setScreenAvailabilety: (screenName: string, availabilety: boolean) => void;
  screenName: string;
  showMoveToTopSectionButton: () => void;
  hideMoveToTopSectionButton: () => void;
};
const Extras: React.FC<ExtrasProps> = ({
  event,
  nextScreenText,
  setScreenAvailabilety,
  screenName,
  showMoveToTopSectionButton,
  hideMoveToTopSectionButton,
}) => {
  const videosRefs = useRef<{
    [key: string]: any;
  }>({});
  const scrollingPaginationRef = useRef<TScrolingPaginationRef>(null);
  const isBMPlayerShowingRef = useRef<boolean>(false);
  const extrasInfoBlockRef = useRef<TExtrasInfoBlockRef>(null);
  const [videosInfo, setVideosInfo] = useState<Array<Document>>([]);
  const [selectedVideo, setSelectedVideo] =
    useState<TBMPlayerShowingData | null>(null);
  const loaded = useRef<boolean>(false);
  const isMounted = useRef<boolean>(false);
  const loading = useRef<boolean>(false);
  const extrasVideoInFocus = useRef<TouchableHighlight | null | undefined>(
    null,
  );
  const closePlayer = async (error: TBMPlayerErrorObject | null) => {
    if (!selectedVideo) {
      return;
    }

    if (error) {
      globalModalManager.openModal({
        contentComponent: ErrorModal,
        contentProps: {
          confirmActionHandler: () => {
            globalModalManager.closeModal(() => {
              if (
                videosRefs?.current[selectedVideo.videoId] !== undefined &&
                typeof videosRefs.current[selectedVideo.videoId]?.current
                  ?.setNativeProps === 'function'
              ) {
                videosRefs.current[
                  selectedVideo.videoId
                ].current.setNativeProps({ hasTVPreferredFocus: true });
              }
              goBackButtonuManager.showGoBackButton();
              setSelectedVideo(null);
              isBMPlayerShowingRef.current = false;
              showMoveToTopSectionButton();
            });
          },
          title: 'Player Error',
          subtitle: `Something went wrong.\n${error.errCode}: ${
            error.errMessage
          }\n${error.url || ''}`,
        },
      });
    } else {
      if (
        videosRefs?.current[selectedVideo.videoId] !== undefined &&
        typeof videosRefs?.current[selectedVideo?.videoId].current
          ?.setNativeProps === 'function'
      ) {
        videosRefs.current[selectedVideo.videoId].current.setNativeProps({
          hasTVPreferredFocus: true,
        });
      }
      goBackButtonuManager.showGoBackButton();
      setSelectedVideo(null);
      isBMPlayerShowingRef.current = false;
      showMoveToTopSectionButton();
    }
  };
  useEffect(() => {
    if (loaded.current || loading.current) {
      return;
    }
    loading.current = true;
    const videos = get(event.data, 'vs_videos', []).map(
      ({ video }) => video.id,
    );
    if (!videos.length) {
      setScreenAvailabilety(screenName, false);
      loading.current = false;
      return;
    }
    getVideoDetails({
      queryPredicates: [Prismic.predicates.any('document.id', videos)],
    })
      .then(response => {
        loaded.current = true;
        const filteredResult = response.results.filter(
          result =>
            result.data.video.video_type !== 'performance' &&
            result.data.video.video_type !== 'trailer' &&
            result.data.video.video_type !== 'hero',
        );
        if (filteredResult.length && isMounted.current) {
          setVideosInfo(filteredResult);
          setScreenAvailabilety(screenName, true);
        } else {
          setScreenAvailabilety(screenName, false);
        }
      })
      .catch(() => {
        setScreenAvailabilety(screenName, false);
      })
      .finally(() => {
        loading.current = false;
      });
  });

  const setExtrasrVideoBlur = useCallback(() => {
    extrasVideoInFocus.current = null;
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (!videosInfo.length) {
    return null;
  }

  return (
    <View
      style={[
        styles.generalContainer,
        selectedVideo ? { width: Dimensions.get('window').width } : {},
      ]}>
      <View style={styles.downContainer}>
        <GoDown text={nextScreenText} />
      </View>
      <View style={styles.wrapper}>
        <View style={styles.leftSideContainer}>
          <RohText style={styles.title}>Extras</RohText>
          <ExtrasInfoBlock ref={extrasInfoBlockRef} />
        </View>
        <View style={styles.extrasGalleryContainer}>
          <VirtualizedList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            style={styles.list}
            contentContainerStyle={{ alignItems: 'center' }}
            data={videosInfo}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            getItemCount={data => data?.length || 0}
            keyExtractor={item => item.id}
            getItem={(data, index) => data[index]}
            windowSize={4}
            renderItem={({
              item,
              index,
            }: {
              [key: string]: any;
              item: any;
            }) => (
              <ExtrasVideoButton
                uri={item.data.preview_image.url}
                ref={
                  videosRefs.current[item.id]
                    ? videosRefs.current[item.id]
                    : (videosRefs.current[item.id] =
                        createRef<TouchableHighlight>())
                }
                containerStyle={[
                  styles.extrasGalleryItemContainer,
                  index === 0
                    ? styles.extrasGalleryFirstItemContainer
                    : styles.extrasGalleryOtherItemsContainer,
                ]}
                canMoveRight={index !== videosInfo.length - 1}
                onPress={(_, clearLoadingState) => {
                  if (!isBMPlayerShowingRef.current) {
                    isBMPlayerShowingRef.current = true;
                    fetchVideoURL(item.id)
                      .then(response => {
                        if (!response?.data?.data?.attributes?.hlsManifestUrl) {
                          throw new Error('Something went wrong');
                        }
                        goBackButtonuManager.hideGoBackButton();
                        hideMoveToTopSectionButton();
                        setSelectedVideo({
                          videoId: item.id,
                          eventId: event.id,
                          url: response.data.data.attributes.hlsManifestUrl,
                          title: item.data.video_title.reduce(
                            (acc: string, title: any, i: number) => {
                              if (title.text) {
                                title.type === 'paragraph'
                                  ? title.text + '\n'
                                  : i > 0
                                  ? ' ' + title.text
                                  : title.text;
                              }
                              return acc;
                            },
                            '',
                          ),
                          subtitle: item.data.participant_details.reduce(
                            (
                              acc: string,
                              participant_detail: any,
                              i: number,
                            ) => {
                              if (participant_detail.text) {
                                acc +=
                                  participant_detail.type === 'paragraph'
                                    ? participant_detail.text + '\n'
                                    : i > 0
                                    ? ' ' + participant_detail.text
                                    : participant_detail.text;
                              }
                              return acc;
                            },
                            '',
                          ),
                        });
                      })
                      .catch(err => {
                        globalModalManager.openModal({
                          contentComponent: ErrorModal,
                          contentProps: {
                            confirmActionHandler: () => {
                              globalModalManager.closeModal(() => {
                                if (
                                  videosRefs?.current[item.id] !== undefined &&
                                  typeof videosRefs.current[item.id]?.current
                                    ?.setNativeProps === 'function'
                                ) {
                                  videosRefs.current[
                                    item.id
                                  ].current.setNativeProps({
                                    hasTVPreferredFocus: true,
                                  });
                                }
                                isBMPlayerShowingRef.current = false;
                                showMoveToTopSectionButton();
                              });
                            },
                            title: 'Player Error',
                            subtitle: err.message,
                          },
                        });
                      })
                      .finally(() => {
                        if (typeof clearLoadingState === 'function') {
                          clearLoadingState();
                        }
                      });
                  }
                }}
                blurCallback={setExtrasrVideoBlur}
                focusCallback={(ref?: RefObject<TouchableHighlight>) => {
                  extrasVideoInFocus.current = ref?.current;
                  if (
                    typeof scrollingPaginationRef.current?.setCurrentIndex ===
                    'function'
                  ) {
                    scrollingPaginationRef.current.setCurrentIndex(index);
                  }
                  if (
                    typeof extrasInfoBlockRef.current?.setVideoInfo ===
                    'function'
                  ) {
                    extrasInfoBlockRef.current.setVideoInfo({
                      title: item.data.video_title.reduce(
                        (acc: string, title: any, i: number) => {
                          if (title.text) {
                            acc +=
                              title.type === 'paragraph'
                                ? title.text + '\n'
                                : i > 0
                                ? ' ' + title.text
                                : title.text;
                          }
                          return acc;
                        },
                        '',
                      ),
                      descrription: item.data.short_description.reduce(
                        (acc: string, description: any, i: number) => {
                          if (description.text) {
                            acc +=
                              description.type === 'paragraph'
                                ? description.text + '\n'
                                : i > 0
                                ? ' ' + description.text
                                : description.text;
                          }
                          return acc;
                        },
                        '',
                      ),
                      participant_details: item.data.participant_details.reduce(
                        (acc: string, participant_detail: any, i: number) => {
                          if (participant_detail.text) {
                            acc +=
                              participant_detail.type === 'paragraph'
                                ? participant_detail.text + '\n'
                                : i > 0
                                ? ' ' + participant_detail.text
                                : participant_detail.text;
                          }
                          return acc;
                        },
                        '',
                      ),
                    });
                  }
                }}
              />
            )}
          />
        </View>
      </View>
      {videosInfo.length > 1 && (
        <View style={styles.paginationContainer}>
          <ScrollingPagination
            ref={scrollingPaginationRef}
            countOfItems={videosInfo.length}
            alignHorizontal="flex-start"
          />
        </View>
      )}
      {selectedVideo && (
        <View style={StyleSheet.absoluteFillObject}>
          <Player
            autoPlay
            configuration={{
              url: selectedVideo.url,
              offset: '0.0',
            }}
            title={selectedVideo.title}
            subtitle={selectedVideo.subtitle}
            onClose={closePlayer}
            analytics={{
              videoId: selectedVideo.videoId,
              title: selectedVideo.title,
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downContainer: {
    flexDirection: 'row',
    height: scaleSize(50),
    paddingBottom: scaleSize(60),
    top: -scaleSize(85),
  },
  title: {
    marginTop: scaleSize(105),
    color: Colors.defaultTextColor,
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
    letterSpacing: scaleSize(1),
    lineHeight: scaleSize(84),
  },
  extrasGalleryContainer: {
    flex: 1,
  },
  leftSideContainer: {
    width: scaleSize(645),
  },
  extrasGalleryItemContainer: {
    height: scaleSize(440),
    width: scaleSize(765),
    alignItems: 'center',
    justifyContent: 'center',
  },
  extrasGalleryFirstItemContainer: {
    marginLeft: scaleSize(147),
  },
  extrasGalleryOtherItemsContainer: {
    marginLeft: scaleSize(20),
  },
  list: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: scaleSize(160),
    left: 0,
  },
});

export default Extras;
