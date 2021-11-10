import React, { useState, useEffect, useRef, RefObject } from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import FastImage from 'react-native-fast-image';
import { TEventContainer, TEventVideo } from '@services/types/models';
import get from 'lodash.get';
import GoDown from '../commonControls/GoDown';
import Watch from '@assets/svg/eventDetails/Watch.svg';
import AddToMyList from '@assets/svg/eventDetails/AddToMyList.svg';
import Subtitles from '@assets/svg/eventDetails/Subtitles.svg';
import Trailer from '@assets/svg/eventDetails/Trailer.svg';
import ActionButtonList, {
  EActionButtonListType,
} from '../commonControls/ActionButtonList';

import {
  hasMyListItem,
  removeIdFromMyList,
  addToMyList,
} from '@services/myList';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getPerformanceVideoURL } from '@services/store/videos/Slices';
import {
  videoListSelector,
  videoListItemSelector,
} from '@services/store/videos/Selectors';
import { toggleSubscriptionMode } from '@services/store/auth/Slices';
import { subscribedModeSelector } from '@services/store/auth/Selectors';
import { globalModalManager } from '@components/GlobalModal';
import { NonSubscribedModeAlert } from '@components/GlobalModal/variants';

let defaultPerfVidUrl = 'https://video-ingestor-output-bucket.s3.eu-west-1.amazonaws.com/6565/manifest.m3u8';

type Props = {
  event: TEventContainer;
  nextScreenText: string;
  isBMPlayerShowing: boolean;
  showPlayer: (...args: any[]) => void;
};

const General: React.FC<Props> = ({
  event,
  showPlayer,
  nextScreenText = 'Some Screen',
}) => {
  const generalMountedRef = useRef<boolean | undefined>(false);
  const addOrRemoveBusyRef = useRef<boolean>(true);
  const [existInMyList, setExistInMyList] = useState<boolean>(false);
  const dispatch = useDispatch();
  let selectedVideoId = useRef('');
  const videoListItem: TEventVideo = useSelector(videoListItemSelector(selectedVideoId.current));
  const videoList: Array<TEventVideo> = useSelector(videoListSelector);
  const subscribedMode: string = useSelector(
    subscribedModeSelector,
    shallowEqual,
  );

  const title: string =
    get(event.data, ['vs_event_details', 'title'], '').replace(
      /(<([^>]+)>)/gi,
      '',
    ) ||
    get(event.data, ['vs_title', '0', 'text'], '').replace(/(<([^>]+)>)/gi, '');
  const shortDescription = get(
    event.data,
    ['vs_event_details', 'shortDescription'],
    '',
  ).replace(/(<([^>]+)>)/gi, '');
  const snapshotImageUrl = get(
    event.data,
    ['vs_background', '0', 'vs_background_image', 'url'],
    '',
  );
  
  const videos = get(event.data,
    'vs_videos', []);
  const unbrokenVideos = videos.filter(({video}) => !video.isBroken);
  const perfVids = videoList.filter(videoListVideo =>
    (unbrokenVideos.find(({video}) => 
      video.id === videoListVideo.id) !== undefined) && 
      videoListVideo.video_type === 'performance');

  let perfVidURL = '';
  // We will receive a list, but there will only be one performance in the live 
  // environment, so we can just take the first item.
  if(perfVids.length && perfVids[0].performanceVideoURL === '') { 
    dispatch(getPerformanceVideoURL(perfVids[0].id))
    selectedVideoId.current = perfVids[0].id;
  }

  if(videoListItem && videoListItem.performanceVideoURL !== '') {
    perfVidURL = videoListItem.performanceVideoURL;
  }

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
          text: 'Watch now',
          hasTVPreferredFocus: true,
          onPress: (ref?: RefObject<TouchableHighlight>) => {
            // TODO: Important, restore before finalizing this PR!
            // if (subscribedMode) {}
            if (!subscribedMode) {
              showPlayer({
                videoId: event.id,
                url: perfVidURL,
                title,
                poster:
                  'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
                subtitle: title,
              });
              return;
            }
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
          },
          onFocus: () => console.log('Watch now focus'),
          Icon: Watch,
        },
        {
          key: 'WatchTrailer',
          text: 'Watch trailer',
          onPress: () => console.log('Watch trailer press'),
          onFocus: () => console.log('Watch trailer focus'),
          Icon: Trailer,
        },
        {
          key: 'AddToMyList',
          text: (existInMyList ? 'Remove from' : 'Add to') + ' my list',
          onPress: addOrRemoveItemIdFromMyListHandler,
          onFocus: () => console.log('Add to my list focus'),
          Icon: AddToMyList,
        },
        {
          key: 'Audio&Subtitles',
          text: 'Audio & Subtitles',
          onPress: () => console.log('Audio & Subtitles press'),
          onFocus: () => console.log('Audio & Subtitles focus'),
          Icon: Subtitles,
        },
        {
          key: 'SubscribedMode',
          text: `Switch to ${
            subscribedMode ? 'non-subscribed' : 'subscribed'
          } mode(only for testing)`,
          onPress: () => dispatch(toggleSubscriptionMode()),
          onFocus: () => console.log('Audio & Subtitles focus'),
        },
      ],
    };
    if (typeOfList in buttonListCollection) {
      return buttonListCollection[typeOfList];
    }
    return buttonListCollection[EActionButtonListType.common];
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
  }, []);
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
              buttonsFactory={actionButtonListFactory}
              type={EActionButtonListType.common}
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
