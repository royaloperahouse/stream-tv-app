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
} from 'react-native';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import PlayerControls, { TPlayerControlsRef } from './PlayerControls';
import {
  TBitmoviPlayerNativeProps,
  TBMPlayerErrorObject,
} from '@services/types/bitmovinPlayer';

import { scaleSize } from '@utils/scaleSize';
import { ESeekOperations } from '@configs/playerConfig';

let NativeBitMovinPlayer: HostComponent<TBitmoviPlayerNativeProps> =
  requireNativeComponent('ROHBitMovinPlayer');

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
  subtitle?: string;
  seekingTimePoint?: number;
  onClose?: (error: TBMPlayerErrorObject | null, stoppedTime: string) => void;
  configuration: {
    url: string;
    poster?: string;
    subtitles?: string;
    configuration?: string;
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
};

const Player: React.FC<TPlayerProps> = props => {
  const cloneProps = {
    ...props,
    configuration: {
      ...props.configuration,
    },
    analytics: {
      ...props.analytics,
    },
  };
  const {
    onEvent,
    onClose,
    title,
    subtitle = '',
    configuration,
    analytics,
    autoPlay = false,
    seekingTimePoint = 10.0,
  } = cloneProps;
  const playerRef = useRef<typeof NativeBitMovinPlayer | null>(null);
  const controlRef = useRef<TPlayerControlsRef | null>(null);
  const playerError = useRef<TBMPlayerErrorObject | null>(null);

  const [playerReady, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const [subtitleCue, setSubtitleCue] = useState('');

  const onReady: TCallbackFunc = useCallback(data => {
    const payload: TOnReadyPayload = data.nativeEvent;
    const initDuration = parseFloat(payload?.duration);
    if (
      Array.isArray(payload?.subtitles) &&
      typeof controlRef.current?.loadSubtitleList === 'function'
    ) {
      controlRef.current.loadSubtitleList(payload.subtitles);
    }
    if (!isNaN(initDuration)) {
      setDuration(initDuration);
    }
    setReady(true);
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
      parseFloat(floatTime.toFixed()) >= parseFloat(floatDuration.toFixed())
    ) {
      ROHBitmovinPlayerModule.pause(findNodeHandle(playerRef.current));
      ROHBitmovinPlayerModule.seek(findNodeHandle(playerRef.current), 0.0);
      if (typeof controlRef.current?.controlFadeOut === 'function') {
        controlRef.current.controlFadeOut();
      }
      return;
    }
    if (typeof controlRef.current?.setCurrentTime === 'function') {
      controlRef.current.setCurrentTime(floatTime);
    }
  };

  const onSeeked: TCallbackFunc = data => {
    const { time }: TOnSeekPayload = data.nativeEvent;
    const floatTime = parseFloat(time);
    if (isNaN(floatTime)) {
      return;
    }
    if (typeof controlRef.current?.setSeekQueueFree === 'function') {
      controlRef.current.setSeekQueueFree();
    }
    if (typeof controlRef.current?.setCurrentTime === 'function') {
      controlRef.current.setCurrentTime(floatTime);
    }
    if (typeof controlRef.current?.seekUpdatingFinished === 'function') {
      controlRef.current.seekUpdatingFinished();
    }
  };

  const setPlayer = (ref: any) => {
    playerRef.current = ref;
  };
  const onPlaybackFinished = () => {};

  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      eventEmitter.addListener('onEvent', (event: any) => {
        if (typeof onEvent === 'function') {
          onEvent({ nativeEvent: event });
        }
      });
      eventEmitter.addListener('onReady', (event: any) => {
        onReady({ nativeEvent: event });
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
      eventEmitter.addListener('onSeek', () => {});
      eventEmitter.addListener('onSeeked', (event: any) =>
        onSeeked({ nativeEvent: event }),
      );
      eventEmitter.addListener('onDestroy', (event: TOnDestoyPayload) => {
        const initDuration = parseFloat(event?.duration);
        const floatTime = parseFloat(event?.time);
        const stoppedTimePoint =
          isNaN(floatTime) || isNaN(initDuration) || floatTime === initDuration
            ? '0.0'
            : floatTime;
        if (typeof onClose === 'function') {
          onClose(playerError.current, stoppedTimePoint.toString());
        }
      });
      eventEmitter.addListener('onPlaybackFinished', () => {
        onPlaybackFinished();
      });
      eventEmitter.addListener('onError', event => {
        playerError.current = {
          errCode: event.errCode,
          errMessage: event.errMessage,
          url: configuration.url,
        };
        ROHBitmovinPlayerModule.destroy(findNodeHandle(playerRef.current));
      });
      eventEmitter.addListener('onSubtitleChanged', () => {});
      eventEmitter.addListener('onLoad', () => {
        setLoaded(true);
      });
      eventEmitter.addListener('onCueEnter', (event: any) => {
        setSubtitleCue(event.cueText);
      });
      eventEmitter.addListener('onCueExit', (_event: any) => {
        setSubtitleCue('');
      });
    }
    return () => {
      if (Platform.OS === 'android') {
        eventEmitter.removeAllListeners('onEvent');
        eventEmitter.removeAllListeners('onPlay');
        eventEmitter.removeAllListeners('onPause');
        eventEmitter.removeAllListeners('onTimeChanged');
        eventEmitter.removeAllListeners('onSeek');
        eventEmitter.removeAllListeners('onSeeked');
        eventEmitter.removeAllListeners('onForward');
        eventEmitter.removeAllListeners('onRewind');
        eventEmitter.removeAllListeners('onPlaybackFinished');
        eventEmitter.removeAllListeners('onDestroy');
        eventEmitter.removeAllListeners('onReady');
        eventEmitter.removeAllListeners('onError');
        eventEmitter.removeAllListeners('onSubtitleChanged');
        eventEmitter.removeAllListeners('onLoad');
        eventEmitter.removeAllListeners('onCueEnter');
        eventEmitter.removeAllListeners('onCueExit');
      }
    };
  }, [onEvent, onClose, onReady, configuration.url]);

  const getCurrentTime = useCallback(
    () =>
      ROHBitmovinPlayerModule.getCurrentTime(findNodeHandle(playerRef.current)),
    [],
  );

  const actionPlay = useCallback(() => {
    if (!playerReady) {
      return;
    }
    ROHBitmovinPlayerModule.play(findNodeHandle(playerRef.current));
  }, [playerReady]);

  const actionPause = useCallback(() => {
    if (!playerReady) {
      return;
    }
    ROHBitmovinPlayerModule.pause(findNodeHandle(playerRef.current));
  }, [playerReady]);

  const calculateTimeForSeeking = useCallback(
    (
      startTime: number,
      countOfSeekingIteration: number,
      seekOp: ESeekOperations,
    ) => {
      if (!playerReady) {
        return -1;
      }
      const seekingDuration = countOfSeekingIteration * seekingTimePoint;
      switch (seekOp) {
        case ESeekOperations.fastForward: {
          const calculatedSeekingTimePoint = startTime + seekingDuration;
          if (startTime >= duration - 5) {
            return -1;
          }
          return calculatedSeekingTimePoint >= duration - 5.0
            ? duration - 5.0
            : calculatedSeekingTimePoint;
        }
        case ESeekOperations.rewind: {
          const calculatedSeekingTimePoint = startTime - seekingDuration;
          if (startTime === 0.0) {
            return -1;
          }
          return calculatedSeekingTimePoint < 0.0
            ? 0.0
            : calculatedSeekingTimePoint;
        }
        default:
          return -1;
      }
    },
    [playerReady, seekingTimePoint, duration],
  );

  const seekTo = useCallback((time: number) => {
    ROHBitmovinPlayerModule.seek(findNodeHandle(playerRef.current), time);
  }, []);

  const actionRestart = useCallback(() => {
    if (!playerReady) {
      return;
    }
    ROHBitmovinPlayerModule.restart(findNodeHandle(playerRef.current));
  }, [playerReady]);

  const actionDestroy = useCallback(() => {
    if (!playerReady) {
      return;
    }
    ROHBitmovinPlayerModule.destroy(findNodeHandle(playerRef.current));
  }, [playerReady]);

  const actionClose = useCallback(() => {
    actionPause();
    actionDestroy();
  }, [actionPause, actionDestroy]);

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
        style={loaded ? styles.playerLoaded : {}}
        autoPlay={autoPlay}
      />
      <PlayerControls
        ref={controlRef}
        title={title}
        subtitle={subtitle}
        duration={duration}
        playerLoaded={playerReady}
        onPlayPress={actionPlay}
        onPausePress={actionPause}
        onRestartPress={actionRestart}
        onClose={actionClose}
        setSubtitle={setSubtitle}
        autoPlay={autoPlay}
        subtitleCue={subtitleCue}
        calculateTimeForSeeking={calculateTimeForSeeking}
        seekTo={seekTo}
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
    backgroundColor: 'red',
    bottom: 0,
  },
  textDescription: {
    position: 'absolute',
    flex: 1,
    alignSelf: 'center',
    top: scaleSize(180),
    fontSize: scaleSize(80),
    color: 'red',
  },
});

export default Player;
