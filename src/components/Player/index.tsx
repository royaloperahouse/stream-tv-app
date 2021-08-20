import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  requireNativeComponent,
  NativeModules,
  findNodeHandle,
  NativeEventEmitter,
  Platform,
} from 'react-native';

import { scaleSize } from '@utils/scaleSize';
import PlayerControls from './PlayerControls';

const ROHBitmovinPlayerModule = NativeModules.ROHBitmovinPlayer;

const NativeBitMovinPlayer = requireNativeComponent('ROHBitMovinPlayer');

const eventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeBitmovinPlayer
);

type CallbackFunc = (data?: any) => void;

type TPlayerProps = {
  autoPlay?: boolean;
  style?: any;
  onEvent?: (event: any) => void;
  onError?: (event: any) => void;
  configuration: {
    url: string;
    poster?: string;
    startOffset: number;
    subtitles?: string;
    title?: string;
    subtitle?: string;
    hearbeat?: number;
  };
  // analytics?: {
  //   videoId: string;
  //   title: string | undefined;
  //   userId: string | undefined;
  //   cdnProvider: string;
  //   customData1: string;
  //   customData2: string;
  //   customData3: string;
  // };
};

const Player: React.FC<TPlayerProps> = (props) => {

  const {
    autoPlay,
    style,
    onEvent,
    onError,
    configuration,
  } = props;

  let player: any = null;

  const [playerLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const onLoad: CallbackFunc = (data) => {
    const { duration } = data.nativeEvent;
    setDuration(duration);
    setLoaded(true);
  };

  const [isPlaying, setPlaying] = useState(false);
  const onPlaying: CallbackFunc = () => setPlaying(true);
  const onPause: CallbackFunc = () => setPlaying(false);

  const [currentTime, setTime] = useState(0);
  const onTimeChanged: CallbackFunc = (data) => {
    const { time } = data.nativeEvent;
    setTime(time);
  };
  const onSeek: CallbackFunc = (data) => {
    const { time } = data.nativeEvent;
    setTime(time);
  };

  const setPlayer = (ref: any) => { player = ref; };

  useEffect(() => {
    if (Platform.OS === 'android') {
      eventEmitter.addListener(
        'onEvent',
        (event: any) => !!onEvent && onEvent({ nativeEvent: event })
      );
      eventEmitter.addListener(
        'onLoad',
        (event: any) => onLoad({ nativeEvent: event })
      );
      eventEmitter.addListener(
        'onPlay',
        (event: any) => onPlaying({ nativeEvent: event })
      );
      eventEmitter.addListener(
        'onPause',
        (event: any) => onPause({ nativeEvent: event })
      );
      eventEmitter.addListener(
        'onTimeChanged',
        (event: any) => onTimeChanged({ nativeEvent: event })
      );
      eventEmitter.addListener(
        'onSeek',
        (event: any) => onSeek({ nativeEvent: event })
      );
      eventEmitter.addListener(
        'onForward',
        (event: any) => onSeek({ nativeEvent: event })
      );
      eventEmitter.addListener(
        'onRewind',
        (event: any) => onSeek({ nativeEvent: event })
      );
    }
    return () => {
      if (Platform.OS === 'android') {
        eventEmitter.removeAllListeners('onEvent');
        eventEmitter.removeAllListeners('onLoad');
        eventEmitter.removeAllListeners('onPlay');
        eventEmitter.removeAllListeners('onPause');
        eventEmitter.removeAllListeners('onTimeChanged');
        eventEmitter.removeAllListeners('onSeek');
        eventEmitter.removeAllListeners('onForward');
        eventEmitter.removeAllListeners('onRewind');
      }
    };
  }, []);

  const play = () => {
    ROHBitmovinPlayerModule.play(findNodeHandle(player));
  };

  const pause = () => {
    ROHBitmovinPlayerModule.pause(findNodeHandle(player));
  };

  const seek = (forward: true) => {
    const offset = forward ? 10 : -10;
    const seekTime = parseFloat(currentTime + offset);

    if (seekTime) {
      ROHBitmovinPlayerModule.seek(findNodeHandle(player), seekTime);
    }
  };

  const getCurrentTime = () => ROHBitmovinPlayerModule.getCurrentTime(findNodeHandle(player));

  const getDuration = () => ROHBitmovinPlayerModule.getDuration(findNodeHandle(player));

  const isPaused = () => ROHBitmovinPlayerModule.isPaused(findNodeHandle(player));

  const isStalled = () => ROHBitmovinPlayerModule.isStalled(findNodeHandle(player));

  // const isPlaying = () => ROHBitmovinPlayerModule.isPlaying(findNodeHandle(player));

  return (
    <SafeAreaView style={style}>
      <NativeBitMovinPlayer
        ref={setPlayer}
        configuration={configuration}
        style={[
          {
            backgroundColor: 'black',
          },
          style,
        ]}
      />
      { playerLoaded &&
        <PlayerControls />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
  },
});

export default Player;