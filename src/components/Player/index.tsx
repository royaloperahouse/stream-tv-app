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
import PlayerControls, { TPlayerControlsRef } from './PlayerControls';
const NativeBitMovinPlayer: HostComponent<{
  autoPlay?: boolean;
  configuration: {
    url: string;
    poster?: string;
    subtitles?: string;
    offset?: string;
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
  message: 'seek';
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

const Player: React.FC<TPlayerProps> = props => {
  const {
    autoPlay = false,
    style = {},
    onEvent,
    onError,
    onClose,
    title,
    subtitle,
    configuration,
  } = props;
  const playerRef = useRef<typeof NativeBitMovinPlayer | null>(null);
  const controlRef = useRef<TPlayerControlsRef | null>(null);

  const [playerLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0.0);

  const onLoad: TCallbackFunc = useCallback(data => {
    const payload: TOnLoadPayload = data.nativeEvent;
    const initDuration = parseFloat(payload?.duration);
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
    const { time }: TOnTimeChangedPayload = data.nativeEvent;
    const floatTime = parseFloat(time);
    if (isNaN(floatTime)) {
      return;
    }
    if (typeof controlRef.current?.setPlay === 'function') {
      controlRef.current.setPlay(true);
    }
    if (typeof controlRef.current?.setCurrentTime === 'function') {
      controlRef.current.setCurrentTime(floatTime);
    }
  };

  const onSeek: TCallbackFunc = data => {
    const { time }: TOnSeekPayload = data.nativeEvent;
    const floatTime = parseFloat(time);
    if (isNaN(floatTime)) {
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
      eventEmitter.addListener('onLoad', (event: any) =>
        onLoad({ nativeEvent: event }),
      );
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
      eventEmitter.addListener('onForward', (event: any) =>
        onSeek({ nativeEvent: event }),
      );
      eventEmitter.addListener('onRewind', (event: any) =>
        onSeek({ nativeEvent: event }),
      );
      eventEmitter.addListener('onDestroy', (event: TOnDestoyPayload) => {
        console.log(event, 'ev');
        const initDuration = parseFloat(event?.duration);
        const floatTime = parseFloat(event?.time);
        const stoppedTimePoint =
          isNaN(floatTime) || isNaN(initDuration) || floatTime === initDuration
            ? 0.0
            : floatTime;
        onClose(stoppedTimePoint);
      });
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
    //setTime(seekTime);
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
    //setTime(seekTime);
  };

  const actionRestart = () => {
    ROHBitmovinPlayerModule.restart(findNodeHandle(playerRef.current));
    /*
      ROHBitmovinPlayerModule.seek(findNodeHandle(playerRef.current), 0.0);
      setTime(0.0);
      ROHBitmovinPlayerModule.play(findNodeHandle(playerRef.current));
    */
  };

  const getCurrentTime = () =>
    ROHBitmovinPlayerModule.getCurrentTime(findNodeHandle(playerRef.current));

  const getDuration = () =>
    ROHBitmovinPlayerModule.getDuration(findNodeHandle(playerRef.current));

  const isPaused = () =>
    ROHBitmovinPlayerModule.isPaused(findNodeHandle(playerRef.current));

  const isStalled = () =>
    ROHBitmovinPlayerModule.isStalled(findNodeHandle(playerRef.current));

  // const isPlaying = () => ROHBitmovinPlayerModule.isPlaying(findNodeHandle(player));

  return (
    <SafeAreaView style={styles.playerLoaded}>
      <NativeBitMovinPlayer
        ref={setPlayer}
        configuration={configuration}
        style={[
          styles.defaultPlayerStyle,
          playerLoaded ? styles.playerLoaded : {},
        ]}
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
        onClose={() => {
          ROHBitmovinPlayerModule.destroy(findNodeHandle(playerRef.current));
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  defaultPlayerStyle: {
    backgroundColor: 'black',
    opacity: 0,
  },
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

/*
don`t forget to remove it when player will integrate;


  let player: any = null;

  const [playerLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const onLoad: TCallbackFunc = data => {
    console.log(data);
    const { duration } = data.nativeEvent;
    setDuration(parseFloat(duration));
    setLoaded(true);
  };

  const [isPlaying, setPlaying] = useState(false);
  const onPlaying: TCallbackFunc = data => {
    console.log(data);
    setPlaying(true);
  };
  const onPause: TCallbackFunc = data => {
    console.log(data);
    setPlaying(false);
  };
  const [currentTime, setTime] = useState(0);
  const onTimeChanged: TCallbackFunc = data => {
    console.log(data);
    const { time } = data.nativeEvent;
    setPlaying(true);
    setTime(parseFloat(time));
  };
  const onSeek: TCallbackFunc = data => {
    console.log(data);
    const { time } = data.nativeEvent;
    setTime(parseFloat(time));
  };

  const setPlayer = (ref: any) => {
    player = ref;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      eventEmitter.addListener(
        'onEvent',
        (event: any) => !!onEvent && onEvent({ nativeEvent: event }),
      );
      eventEmitter.addListener('onLoad', (event: any) =>
        onLoad({ nativeEvent: event }),
      );
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
      eventEmitter.addListener('onForward', (event: any) =>
        onSeek({ nativeEvent: event }),
      );
      eventEmitter.addListener('onRewind', (event: any) =>
        onSeek({ nativeEvent: event }),
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

  const getCurrentTime = () =>
    ROHBitmovinPlayerModule.getCurrentTime(findNodeHandle(player));

  const getDuration = () =>
    ROHBitmovinPlayerModule.getDuration(findNodeHandle(player));

  const isPaused = () =>
    ROHBitmovinPlayerModule.isPaused(findNodeHandle(player));

  const isStalled = () =>
    ROHBitmovinPlayerModule.isStalled(findNodeHandle(player));

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
      {playerLoaded && (
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
      )}
    </SafeAreaView>
  );
*/
