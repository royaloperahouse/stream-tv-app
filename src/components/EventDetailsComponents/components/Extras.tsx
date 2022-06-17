import React, {
  useState,
  useEffect,
  useRef,
  createRef,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  VirtualizedList,
  TouchableHighlight,
  TVFocusGuideView,
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
import { fetchVideoURL } from '@services/apiClient';
import { goBackButtonuManager } from '@components/GoBack';
import ScrollingPagination, {
  TScrolingPaginationRef,
} from '@components/ScrollingPagination';
import { globalModalManager } from '@components/GlobalModal';
import { ErrorModal } from '@components/GlobalModal/variants';
import { useFocusEffect } from '@react-navigation/native';
import { TVEventManager } from '@services/tvRCEventListener';

type ExtrasProps = {
  event: TEventContainer;
  nextScreenText: string;
  showMoveToTopSectionButton: () => void;
  hideMoveToTopSectionButton: () => void;
  closePlayer: (...args: any[]) => void;
  openPlayer: (...args: any[]) => void;
  closeModal: (...args: any[]) => void;
  setRefToMovingUp: (
    index: number,
    cp:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number,
  ) => void;
  getPrevRefToMovingUp: (
    index: number,
  ) =>
    | Array<
        | React.Component<any, any, any>
        | React.ComponentClass<any, any>
        | null
        | number
      >
    | undefined;
  index: number;
};
const Extras: React.FC<ExtrasProps> = ({
  event,
  nextScreenText,
  showMoveToTopSectionButton,
  hideMoveToTopSectionButton,
  closePlayer,
  openPlayer,
  closeModal,
  index,
  setRefToMovingUp,
  getPrevRefToMovingUp,
}) => {
  const videosRefs = useRef<{
    [key: string]: any;
  }>({});
  const [listOfFocusRef, setListOfFocusRef] = useState<
    | Array<React.Component<any, any, any> | React.ComponentClass<any, any>>
    | undefined
  >();
  const scrollingPaginationRef = useRef<TScrolingPaginationRef>(null);
  const isBMPlayerShowingRef = useRef<boolean>(false);
  const extrasInfoBlockRef = useRef<TExtrasInfoBlockRef>(null);
  const [videosInfo, setVideosInfo] = useState<Array<Document>>([]);
  const loaded = useRef<boolean>(false);
  const isMounted = useRef<boolean>(false);
  const loading = useRef<boolean>(false);
  const extrasVideoInFocusRef = useRef<TouchableHighlight | null | undefined>(
    null,
  );
  const extrasVideoInFocus = useRef<any | null>(null);
  const extrasVideoInFocusPressing = useRef<{
    pressingHandler: () => void;
  } | null>(null);
  const closeModalCB = useCallback(
    (...rest: any[]) => {
      closeModal(...rest);
      isBMPlayerShowingRef.current = false;
      goBackButtonuManager.showGoBackButton();
      showMoveToTopSectionButton();
    },
    [showMoveToTopSectionButton, closeModal],
  );

  useEffect(() => {
    if (loaded.current || loading.current) {
      return;
    }
    loading.current = true;
    const videos = get(event.data, 'vs_videos', []).map(
      ({ video }) => video.id,
    );
    if (!videos.length) {
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
        }
      })
      .catch(console.log)
      .finally(() => {
        loading.current = false;
      });
  });

  const pressHandler = useCallback(
    (ref, clearLoadingState) => {
      if (!isBMPlayerShowingRef.current && extrasVideoInFocus.current) {
        isBMPlayerShowingRef.current = true;
        fetchVideoURL(extrasVideoInFocus.current.id)
          .then(response => {
            if (!response?.data?.data?.attributes?.hlsManifestUrl) {
              throw new Error('Something went wrong');
            }
            const videoTitle =
              extrasVideoInFocus.current.data.video_title.reduce(
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
              );

            const subtitle =
              extrasVideoInFocus.current.data.participant_details.reduce(
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
              );
            hideMoveToTopSectionButton();
            openPlayer({
              url: response.data.data.attributes.hlsManifestUrl,
              poster:
                'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
              title: videoTitle,
              subtitle,
              onClose: closePlayer({
                eventId: event.id,
                clearLoadingState,
                ref,
                closeModalCB,
              }),
            });
          })
          .catch(err => {
            globalModalManager.openModal({
              contentComponent: ErrorModal,
              contentProps: {
                confirmActionHandler: () => {
                  globalModalManager.closeModal(() => {
                    closeModalCB(ref, clearLoadingState);
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
      } else {
        clearLoadingState();
      }
    },
    [
      closeModalCB,
      closePlayer,
      event.id,
      openPlayer,
      hideMoveToTopSectionButton,
    ],
  );

  const setExtrasrVideoBlur = useCallback(() => {
    extrasVideoInFocusRef.current = null;
    extrasVideoInFocus.current = null;
    extrasVideoInFocusPressing.current = null;
  }, []);

  /*
  ToDo decide to implement it or left it at the end; moving to current section for tvos;
  to this moment it works without this implementation
  useFocusEffect(
    useCallback(() => {
      if (videosInfo.length && isMounted.current) {
        setRefToMovingUp(index, videosRefs.current[videosInfo[0].id].current);
        setListOfFocusRef(
          videosRefs.current[videosInfo[0].id].current === null ||
            typeof videosRefs.current[videosInfo[0].id].current === 'number'
            ? undefined
            : [videosRefs.current[videosInfo[0].id].current],
        );
      }
      return () => {
        setRefToMovingUp(index, null);
        setListOfFocusRef(undefined);
      };
    }, [index, setRefToMovingUp, videosInfo]),
  ); */

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const cb = (_: any, eve: any) => {
        if (
          eve?.eventType !== 'playPause' ||
          eve.eventKeyAction === 0 ||
          typeof extrasVideoInFocusPressing.current?.pressingHandler !==
            'function'
        ) {
          return;
        }
        extrasVideoInFocusPressing.current.pressingHandler();
      };
      TVEventManager.addEventListener(cb);
      return () => {
        TVEventManager.removeEventListener(cb);
      };
    }, []),
  );

  if (!videosInfo.length) {
    return null;
  }

  return (
    <View style={[styles.generalContainer]}>
      <View style={styles.downContainer}>
        <GoDown text={nextScreenText} />
        <TVFocusGuideView
          style={styles.navigationToDownContainer}
          destinations={listOfFocusRef}
        />
      </View>
      <TVFocusGuideView
        style={styles.navigationToUpContainer}
        destinations={getPrevRefToMovingUp(index)}
      />
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
                paddingLeft={index === 0 ? scaleSize(147) : scaleSize(10)}
                paddingRight={
                  videosInfo.length > 0 && index === videosInfo.length - 1
                    ? scaleSize(147)
                    : scaleSize(10)
                }
                containerStyle={[styles.extrasGalleryItemContainer]}
                canMoveRight={index !== videosInfo.length - 1}
                onPress={pressHandler}
                blurCallback={setExtrasrVideoBlur}
                focusCallback={(pressingHandler?: () => void) => {
                  extrasVideoInFocus.current = item;
                  if (pressingHandler) {
                    extrasVideoInFocusPressing.current = { pressingHandler };
                  }
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
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
  },
  navigationToDownContainer: {
    width: '100%',
    height: 2,
  },
  navigationToUpContainer: {
    width: '100%',
    height: 2,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downContainer: {
    height: scaleSize(110),
    top: -scaleSize(110),
    position: 'absolute',
    left: 0,
    right: 0,
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
