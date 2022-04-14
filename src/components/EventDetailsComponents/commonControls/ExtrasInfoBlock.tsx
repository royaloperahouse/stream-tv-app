import React, {
  useRef,
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
export type TExtrasInfoBlockRef = {
  setVideoInfo?: (
    info: Partial<{
      title: string;
      descrription: string;
      participant_details: string;
    }>,
  ) => void;
};
type Props = {};

const ExtrasInfoBlock = forwardRef<TExtrasInfoBlockRef, Props>((props, ref) => {
  const isMounted = useRef<boolean>(false);
  const [showThreeDots, setShowThreeDots] = useState<boolean>(false);
  const [info, setInfo] = useState<
    Partial<{
      title: string;
      descrription: string;
      participant_details: string;
    }>
  >({});
  useImperativeHandle(
    ref,
    () => ({
      setVideoInfo: (videoInfo: any) => {
        if (isMounted.current) {
          setInfo(videoInfo);
        }
      },
    }),
    [],
  );
  const onLayoutEventHaandler = useCallback((event: LayoutChangeEvent) => {
    event.stopPropagation();
    event.persist();
    const newstate = event.nativeEvent.layout.height >= scaleSize(550);
    setShowThreeDots(prevState =>
      prevState === newstate ? prevState : newstate,
    );
  }, []);
  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <View style={styles.root}>
      <View onLayout={onLayoutEventHaandler}>
        {Boolean(info.title) && (
          <RohText style={styles.title}>{info.title}</RohText>
        )}
        {Boolean(info.participant_details) && (
          <RohText style={styles.participant_details}>
            {info.participant_details}
          </RohText>
        )}
        {Boolean(info.descrription) && (
          <RohText
            style={[
              styles.description,
              info.participant_details
                ? { marginTop: scaleSize(12) }
                : { marginTop: scaleSize(24) },
            ]}>
            {info.descrription}
          </RohText>
        )}
      </View>
      {showThreeDots && (
        <View style={styles.threeDotsContainer}>
          <RohText style={styles.threeDotsText}>...</RohText>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    marginTop: scaleSize(146),
    marginRight: scaleSize(15),
    maxHeight: scaleSize(490),
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  title: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(48),
    textTransform: 'uppercase',
    letterSpacing: scaleSize(1),
    lineHeight: scaleSize(56),
  },
  description: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(24),
    textTransform: 'uppercase',
    lineHeight: scaleSize(32),
  },
  participant_details: {
    marginTop: scaleSize(24),
    color: Colors.defaultTextColor,
    fontSize: scaleSize(22),
    textTransform: 'uppercase',
    lineHeight: scaleSize(28),
    letterSpacing: scaleSize(2),
  },
  threeDotsContainer: {
    position: 'absolute',
    bottom: -scaleSize(5),
    right: scaleSize(15),
  },
  threeDotsText: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(28),
    textTransform: 'uppercase',
    //lineHeight: scaleSize(8),
    letterSpacing: scaleSize(2),
  },
});

export default ExtrasInfoBlock;
