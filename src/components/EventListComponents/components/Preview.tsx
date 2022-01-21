import React, {
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
  useLayoutEffect,
} from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEvent, TEventContainer } from '@services/types/models';
import RohText from '@components/RohText';
import get from 'lodash.get';
import FastImage from 'react-native-fast-image';
import { Colors } from '@themes/Styleguide';

export type TPreviewRef = {
  setDigitalEvent?: (
    digitalEvent: TEventContainer,
    eveGroupTitle?: string,
  ) => void;
  setShowContinueWatching?: (showContinueWatching: boolean) => void;
};

type TPreviewProps = {};

const Preview = forwardRef<TPreviewRef, TPreviewProps>((props, ref) => {
  const fadeAnimation = useRef<Animated.Value>(new Animated.Value(0)).current;
  const mountedRef = useRef<boolean>(false);
  const [event, setEvent] = useState<TEvent | null>(null);
  const [eventGroupTitle, setEventGroupTitle] = useState<string>('');
  useImperativeHandle(
    ref,
    () => ({
      setDigitalEvent: (
        digitalEvent: TEventContainer,
        eveGroupTitle: string = '',
      ) => {
        if (mountedRef.current) {
          setEvent(digitalEvent.data);
          setEventGroupTitle(eveGroupTitle);
        }
      },
    }),
    [],
  );

  const eventTitle: string =
    get(event, ['vs_title', '0', 'text'], '').replace(/(<([^>]+)>)/gi, '') ||
    get(event, ['vs_event_details', 'title'], '').replace(/(<([^>]+)>)/gi, '');
  const shortDescription: string = get(
    event,
    ['vs_event_details', 'shortDescription'],
    '',
  ).replace(/(<([^>]+)>)/gi, '');
  const snapshotImageUrl: string = get(
    event,
    ['vs_background', '0', 'vs_background_image', 'url'],
    '',
  );

  useLayoutEffect(() => {
    fadeAnimation.setValue(0);
    if (event) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [event]);
  useLayoutEffect(() => {
    mountedRef.current = true;
  }, []);
  if (!event) {
    return null;
  }
  return (
    <Animated.View
      style={[styles.previewContainer, { opacity: fadeAnimation }]}>
      {Boolean(event) && (
        <>
          <View style={styles.descriptionContainer}>
            <RohText style={styles.pageTitle}>{eventGroupTitle}</RohText>
            <RohText style={styles.title}>{eventTitle}</RohText>
            {/* <RohText style={styles.ellipsis}>{event.captionText}</RohText> */}
            <RohText style={styles.description}>{shortDescription}</RohText>
          </View>
          <View style={styles.snapshotContainer}>
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              style={styles.previewImage}
              source={{ uri: snapshotImageUrl }}
            />
          </View>
        </>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  previewContainer: {
    flexDirection: 'row',
    height: scaleSize(600),
  },
  descriptionContainer: {
    flex: 1,
    marginTop: scaleSize(141),
    marginRight: scaleSize(130),
  },
  snapshotContainer: {
    width: scaleSize(975),
    height: scaleSize(600),
  },
  pageTitle: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(22),
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(48),
    marginTop: scaleSize(24),
    marginBottom: scaleSize(24),
    textTransform: 'uppercase',
  },
  ellipsis: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(22),
    textTransform: 'uppercase',
  },
  description: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(22),
    marginTop: scaleSize(12),
  },
  previewImage: {
    width: scaleSize(975),
    height: scaleSize(600),
    zIndex: 0,
  },
});

export default Preview;
