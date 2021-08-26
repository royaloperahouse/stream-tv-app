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

const ROHBitmovinPlayerModule = NativeModules.ROHBitMovinPlayerControl;

const NativeBitMovinPlayer = requireNativeComponent('ROHBitMovinPlayer');

const eventEmitter = new NativeEventEmitter(
  NativeModules.ROHBitMovinPlayer
);

type TCallbackFunc = (data?: any) => void;

type TPlayerProps = {
  autoPlay?: boolean;
  style?: any;
  onEvent?: (event: any) => void;
  onError?: (event: any) => void;
  title: string;
  subtitle: string;
  configuration: {
    url: string;
    poster?: string;
    subtitles?: string;
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
    title,
    subtitle,
    configuration,
  } = props;

  let player: any = null;

  const [playerLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const onLoad: TCallbackFunc = (data) => {
    console.log(data);
    const { duration } = data.nativeEvent;
    setDuration(parseFloat(duration));
    setLoaded(true);
  };

  const [isPlaying, setPlaying] = useState(false);
  const onPlaying: TCallbackFunc = (data) => {
    console.log(data);
    setPlaying(true);
  }
  const onPause: TCallbackFunc = (data) => {
    console.log(data);
    setPlaying(false);
  }
  const [currentTime, setTime] = useState(0);
  const onTimeChanged: TCallbackFunc = (data) => {
    console.log(data);
    const { time } = data.nativeEvent;
    setPlaying(true);
    setTime(parseFloat(time));
  };
  const onSeek: TCallbackFunc = (data) => {
    console.log(data);
    const { time } = data.nativeEvent;
    setTime(parseFloat(time));
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

  const actionPlay = () => {
    if (isPlaying) {
      ROHBitmovinPlayerModule.pause(findNodeHandle(player));
    } else {
      ROHBitmovinPlayerModule.play(findNodeHandle(player));
    }
  };

  const actionSeekForward = () => {
    let seekTime = currentTime + 10.0;
    if (seekTime > duration) seekTime = duration;
    ROHBitmovinPlayerModule.seek(findNodeHandle(player), currentTime + 10.0);
    setTime(seekTime);
  };

  const actionSeekBackward = () => {
    let seekTime = currentTime - 10.0;
    if (seekTime < 0) seekTime = 0.0;
    ROHBitmovinPlayerModule.seek(findNodeHandle(player), currentTime - 10.0);
    setTime(seekTime);
  };

  const actionRestart = () => {
    ROHBitmovinPlayerModule.seek(findNodeHandle(player), 0.0);
    setTime(0.0);
    ROHBitmovinPlayerModule.play(findNodeHandle(player));
  };

  const getCurrentTime = () => ROHBitmovinPlayerModule.getCurrentTime(findNodeHandle(player));

  const getDuration = () => ROHBitmovinPlayerModule.getDuration(findNodeHandle(player));

  const isPaused = () => ROHBitmovinPlayerModule.isPaused(findNodeHandle(player));

  const isStalled = () => ROHBitmovinPlayerModule.isStalled(findNodeHandle(player));

  // const isPlaying = () => ROHBitmovinPlayerModule.isPlaying(findNodeHandle(player));

  return (
    <SafeAreaView style={playerLoaded ? styles.playerLoaded : {}}>
      <NativeBitMovinPlayer
        ref={setPlayer}
        configuration={configuration}
        style={[
          {
            backgroundColor: 'black',
          },
          playerLoaded ? styles.playerLoaded : {},
        ]}
      />
      { playerLoaded &&
        <PlayerControls
          title={title}
          subtitle={subtitle}
          currentTime={currentTime}
          duration={duration}
          playerLoaded={playerLoaded}
          isPlaying={isPlaying}
          onPlayPress={actionPlay}
          onSeekForwardPress={actionSeekForward}
          onSeekBackwardPress={actionSeekBackward}
          onRestartPress={actionRestart}
        />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  playerLoaded: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 1,
    position: 'absolute',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
  },
});

export default Player;