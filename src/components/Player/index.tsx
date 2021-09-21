import React, { useLayoutEffect, useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  requireNativeComponent,
  NativeModules,
  findNodeHandle,
  NativeEventEmitter,
  Platform,
  HostComponent,
  ViewProps,
  View,
} from 'react-native';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import PlayerControls, { TPlayerControlsRef } from './PlayerControls';

const NativeBitMovinPlayer: HostComponent<{
  autoPlay?: boolean;
  configuration: {
    url: string;
    poster?: string;
    subtitles?: string;
    offset?: string;
  };
  analytics?: {
    videoId: string;
    title?: string;
    userId?: string;
    experiment?: string;
    customData1?: string;
    customData2?: string;
    customData3?: string;
    customData4?: string;
    customData5?: string;
    customData6?: string;
    customData7?: string;
  };
  style?: ViewProps['style'];
}> = requireNativeComponent('ROHBitMovinPlayer');

const ROHBitmovinPlayerModule = NativeModules.ROHBitMovinPlayerControl;

const eventEmitter = new NativeEventEmitter(NativeModules.ROHBitMovinPlayer);

type TCallbackFunc = (data?: any) => void;

type TOnLoadPayload = {
  message: 'load';
  duration: string;
};

type TOnReadyPayload = {
  message: 'ready';
  duration: string;
  subtitles: Array<{ url: string; id: string; label: string }>;
};

type TOnPlayPayload = {
  message: 'play';
  duration: string;
  time: string;
};

type TOnPausePayload = {
  message: 'pause';
  duration: string;
  time: string;
};

type TOnTimeChangedPayload = {
  message: 'timeChanged';
  duration: string;
  time: string;
};

type TOnSeekPayload = {
  message: 'seek' | 'seeked';
  duration: string;
  time: string;
};

type TOnDestoyPayload = {
  message: 'seek';
  duration: string;
  time: string;
};

type TPlayerProps = {
  autoPlay?: boolean;
  style?: ViewProps['style'];
  onEvent?: (event: any) => void;
  onError?: (event: any) => void;
  title: string;
  subtitle: string;
  onClose?: (...args: any[]) => void;
  configuration: {
    url: string;
    poster?: string;
    subtitles?: string;
    configuration?: string;
  };
  analytics?: {
    videoId: string;
    title?: string;
    userId?: string;
    experiment?: string;
    customData1?: string;
    customData2?: string;
    customData3?: string;
    customData4?: string;
    customData5?: string;
    customData6?: string;
    customData7?: string;
  };
};

const Player: React.FC<TPlayerProps> = props => {
  const { onEvent, onClose, title, subtitle, configuration, analytics } = props;
  const playerRef = useRef<typeof NativeBitMovinPlayer | null>(null);
  const controlRef = useRef<TPlayerControlsRef | null>(null);

  const [playerLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0.0);

  const onLoad: TCallbackFunc = useCallback(data => {
    const payload: TOnReadyPayload = data.nativeEvent;
    const initDuration = parseFloat(payload?.duration);
    if (
      Array.isArray(payload?.subtitles) &&
      typeof controlRef.current?.loadSubtitleList === 'function'
    ) {
      controlRef.current.loadSubtitleList(payload.subtitles);
    }
    console.log(payload?.subtitles, 'subtitles');
    if (!isNaN(initDuration)) {
      setDuration(initDuration);
    }
    setLoaded(true);
  }, []);

  const onPlaying: TCallbackFunc = _ => {
    if (typeof controlRef.current?.setPlay === 'function') {
      controlRef.current.setPlay(true);
    }
  };

  const onPause: TCallbackFunc = _ => {
    if (typeof controlRef.current?.setPlay === 'function') {
      controlRef.current.setPlay(false);
    }
  };

  const onTimeChanged: TCallbackFunc = data => {
    const { time, duration: durationFromEvent }: TOnTimeChangedPayload =
      data.nativeEvent;
    const floatTime = parseFloat(time);
    const floatDuration = parseFloat(durationFromEvent);
    if (isNaN(floatTime) || isNaN(floatDuration)) {
      return;
    }
    if (
      parseFloat(floatTime.toFixed(1)) >= parseFloat(floatDuration.toFixed(1))
    ) {
      ROHBitmovinPlayerModule.pause(findNodeHandle(playerRef.current));
      ROHBitmovinPlayerModule.seek(findNodeHandle(playerRef.current), 0.0);
      return;
    }
    if (typeof controlRef.current?.setCurrentTime === 'function') {
      controlRef.current.setCurrentTime(floatTime);
    }
  };

  const onSeek: TCallbackFunc = data => {
    const { time, message }: TOnSeekPayload = data.nativeEvent;
    const floatTime = parseFloat(time);
    if (isNaN(floatTime) || message !== 'seeked') {
      return;
    }
    if (typeof controlRef.current?.setCurrentTime === 'function') {
      controlRef.current.setCurrentTime(floatTime);
    }
  };

  const setPlayer = (ref: any) => {
    playerRef.current = ref;
  };

  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      eventEmitter.addListener('onEvent', (event: any) => {
        if (typeof onEvent === 'function') {
          onEvent({ nativeEvent: event });
        }
      });
      eventEmitter.addListener('onReady', (event: any) => {
        onLoad({ nativeEvent: event });
      });
      eventEmitter.addListener('onPlay', (event: any) =>
        onPlaying({ nativeEvent: event }),
      );
      eventEmitter.addListener('onPause', (event: any) =>
        onPause({ nativeEvent: event }),
      );
      eventEmitter.addListener('onTimeChanged', (event: any) =>
        onTimeChanged({ nativeEvent: event }),
      );
      eventEmitter.addListener('onSeek', (event: any) =>
        onSeek({ nativeEvent: event }),
      );
      eventEmitter.addListener('onDestroy', (event: TOnDestoyPayload) => {
        const initDuration = parseFloat(event?.duration);
        const floatTime = parseFloat(event?.time);
        const stoppedTimePoint =
          isNaN(floatTime) || isNaN(initDuration) || floatTime === initDuration
            ? 0.0
            : floatTime;
        onClose(stoppedTimePoint);
      });
      eventEmitter.addListener('onPlaybackFinished', event => {
        console.log(event, 'finish');
      });
      eventEmitter.addListener('onError', event => {
        console.log('error', event);
        ROHBitmovinPlayerModule.destroy(findNodeHandle(playerRef.current));
      });
      eventEmitter.addListener('onSubtitleChanged', event => {
        console.log('onSubtitleChanged', event);
      });
    }
    return () => {
      if (Platform.OS === 'android') {
        eventEmitter.removeAllListeners('onEvent');
        eventEmitter.removeAllListeners('onPlay');
        eventEmitter.removeAllListeners('onPause');
        eventEmitter.removeAllListeners('onTimeChanged');
        eventEmitter.removeAllListeners('onSeek');
        eventEmitter.removeAllListeners('onForward');
        eventEmitter.removeAllListeners('onRewind');
        eventEmitter.removeAllListeners('onPlaybackFinished');
        eventEmitter.removeAllListeners('onDestroy');
        eventEmitter.removeAllListeners('onReady');
        eventEmitter.removeAllListeners('onError');
        eventEmitter.removeAllListeners('onSubtitleChanged');
      }
    };
  }, [onEvent, onClose, onLoad]);

  const actionPlay = () => {
    ROHBitmovinPlayerModule.play(findNodeHandle(playerRef.current));
  };

  const actionPause = () => {
    ROHBitmovinPlayerModule.pause(findNodeHandle(playerRef.current));
  };

  const actionSeekForward = async () => {
    const currentTime = await getCurrentTime();
    if (currentTime === duration) {
      return;
    }
    let seekTime = currentTime + 10.0;
    if (seekTime > duration) {
      seekTime = duration;
    }
    ROHBitmovinPlayerModule.seek(findNodeHandle(playerRef.current), seekTime);
  };

  const actionSeekBackward = async () => {
    const currentTime = await getCurrentTime();
    if (currentTime === 0.0) {
      return;
    }
    let seekTime = currentTime - 10.0;
    if (seekTime < 0) {
      seekTime = 0.0;
    }
    ROHBitmovinPlayerModule.seek(findNodeHandle(playerRef.current), seekTime);
  };

  const actionRestart = () => {
    ROHBitmovinPlayerModule.restart(findNodeHandle(playerRef.current));
  };

  const actionDestroy = () => {
    ROHBitmovinPlayerModule.destroy(findNodeHandle(playerRef.current));
  };

  const actionClose = () => {
    actionPause();
    actionDestroy();
  };

  const getCurrentTime = () =>
    ROHBitmovinPlayerModule.getCurrentTime(findNodeHandle(playerRef.current));

  const getDuration = () =>
    ROHBitmovinPlayerModule.getDuration(findNodeHandle(playerRef.current));

  const isPaused = () =>
    ROHBitmovinPlayerModule.isPaused(findNodeHandle(playerRef.current));

  const isStalled = () =>
    ROHBitmovinPlayerModule.isStalled(findNodeHandle(playerRef.current));

  const setSubtitle = useCallback(
    (trackID: string) =>
      ROHBitmovinPlayerModule.setSubtitle(
        findNodeHandle(playerRef.current),
        trackID === 'bitmovin-off' ? null : trackID,
      ),
    [],
  );
  useAndroidBackHandler(() => {
    actionClose();
    return true;
  });

  return (
    <SafeAreaView style={styles.defaultPlayerStyle}>
      <NativeBitMovinPlayer
        ref={setPlayer}
        configuration={configuration}
        analytics={analytics}
        style={[playerLoaded ? styles.playerLoaded : {}]}
      />
      <PlayerControls
        ref={controlRef}
        title={title}
        subtitle={subtitle}
        duration={duration}
        playerLoaded={playerLoaded}
        onPlayPress={actionPlay}
        onPausePress={actionPause}
        onSeekForwardPress={actionSeekForward}
        onSeekBackwardPress={actionSeekBackward}
        onRestartPress={actionRestart}
        onClose={actionClose}
        setSubtitle={setSubtitle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  defaultPlayerStyle: {
    backgroundColor: 'black',
    flex: 1,
  },
  playerLoaded: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
  },
});

export default Player;
