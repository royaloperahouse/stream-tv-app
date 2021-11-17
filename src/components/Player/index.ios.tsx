import React, { useLayoutEffect, useState, useRef, useCallback, useEffect, useImperativeHandle } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ViewProps,
  Dimensions,
  View,
  HostComponent,
  requireNativeComponent,
  NativeModules,
  findNodeHandle,
  Platform,
  LayoutRectangle
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { useFocusEffect } from '@react-navigation/native';
import { TBitmovinPlayerNativeProps, ROHBitmovinPlayerMethodsType } from '@services/types/bitmovinPlayer';
import RohText from '@components/RohText';
// import { TPlayerControlsRef } from './PlayerControls';

let NativeBitMovinPlayer: HostComponent<TBitmovinPlayerNativeProps> =
  requireNativeComponent('ROHBitMovinPlayer');

const ROHBitmovinPlayerModule = NativeModules.NativeBitMovinPlayer;

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
  } = cloneProps;
  const playerRef = useRef<typeof NativeBitMovinPlayer | null>(null);
  const controlRef = useRef<ROHBitmovinPlayerMethodsType | null>(null);
  const playerMounted = useRef<boolean>(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const [loading, setLoading] = useState(false);


  useFocusEffect(
    useCallback(() => {
      playerMounted.current = true;
      return () => {
        if (playerMounted?.current) {
          playerMounted.current = false;
        }
      };
    }, []),
  );

  useEffect(() => {
    const { height } = layout || {};

    if (maxHeight !== null && height && !loading) {
      setTimeout(() => {
        setMaxHeight(height);
      }, 300);
    }

    if (height && maxHeight === height) {
      setLoading(true);
    }
  }, [maxHeight, layout, loading]);

  useEffect(() => {
    if (loading && autoPlay && Platform.OS === 'android') {
      play();
    }
  }, [loading, autoPlay]);

  const play = () => {
    if (Platform.OS === 'android') {
      ROHBitmovinPlayerModule.play(
        findNodeHandle(playerRef?.current || null)
      );
    } else {
      ROHBitmovinPlayerModule.play();
    }
  };

  const pause = () => {
    if (Platform.OS === 'android') {
      ROHBitmovinPlayerModule.pause(
        findNodeHandle(playerRef?.current || null)
      );
    } else {
      ROHBitmovinPlayerModule.pause();
    }
  };

  const seekBackwardCommand = () => {
    ROHBitmovinPlayerModule.seekBackwardCommand();
  };

  const seekForwardCommand = () => {
    ROHBitmovinPlayerModule.seekForwardCommand();
  };

  const destroy = () => {
    if (Platform.OS === 'android') {
      ROHBitmovinPlayerModule.destroy(
        findNodeHandle(playerRef.current || null)
      );
    } else {
      ROHBitmovinPlayerModule.destroy();
    }
  };

  const setZoom = () => {
    ROHBitmovinPlayerModule.setZoom(
      findNodeHandle(playerRef.current || null)
    );
  };

  const setFit = () => {
    ROHBitmovinPlayerModule.setFit(
      findNodeHandle(playerRef.current || null)
    );
  };

  const seek = (time = 0) => {
    const seekTime = parseFloat(time.toString());

    if (seekTime) {
      ROHBitmovinPlayerModule.seek(
        findNodeHandle(playerRef.current || null),
        seekTime
      );
    }
  };

  const mute = () => {
    ROHBitmovinPlayerModule.mute(
      findNodeHandle(playerRef.current || null)
    );
  };

  const unmute = () => {
    ROHBitmovinPlayerModule.unmute(
      findNodeHandle(playerRef.current || null)
    );
  };

  const enterFullscreen = () => {
    ROHBitmovinPlayerModule.enterFullscreen(
      findNodeHandle(playerRef.current || null)
    );
  };

  const exitFullscreen = () => {
    ROHBitmovinPlayerModule.exitFullscreen(
      findNodeHandle(playerRef.current || null)
    );
  };

  const getCurrentTime = () =>
    ROHBitmovinPlayerModule.getCurrentTime(
      findNodeHandle(playerRef.current || null)
    );

  const getDuration = () =>
    ROHBitmovinPlayerModule.getDuration(
      findNodeHandle(playerRef.current || null)
    );

  const getVolume = () =>
    ROHBitmovinPlayerModule.getVolume(
      findNodeHandle(playerRef.current || null)
    );

  const setVolume = (volume = 100) => {
    ROHBitmovinPlayerModule.setVolume(
      findNodeHandle(playerRef.current || null),
      volume
    );
  };

  const isMuted = () =>
    ROHBitmovinPlayerModule.isMuted(
      findNodeHandle(playerRef.current || null)
    );

  const isPaused = () =>
    ROHBitmovinPlayerModule.isPaused(
      findNodeHandle(playerRef.current || null)
    );

  const isStalled = () =>
    ROHBitmovinPlayerModule.isStalled(
      findNodeHandle(playerRef.current || null)
    );

  const isPlaying = () =>
    ROHBitmovinPlayerModule.isPlaying(
      findNodeHandle(playerRef.current || null)
    );

    useImperativeHandle(controlRef, () => ({
      play,
      pause,
      seekBackwardCommand,
      seekForwardCommand,
      destroy,
      setZoom,
      setFit,
      seek,
      mute,
      unmute,
      enterFullscreen,
      exitFullscreen,
      getCurrentTime,
      getDuration,
      getVolume,
      setVolume,
      isMuted,
      isPaused,
      isStalled,
      isPlaying,
    }));
      
  const setPlayer = (ref: any) => {
    playerRef.current = ref;
  };

  console.log('config is ', configuration);
  return (
    <SafeAreaView style={styles.defaultPlayerStyle}>
      <NativeBitMovinPlayer
        ref={setPlayer}
        configuration={configuration}
        analytics={analytics}
        style={
          styles.playerLoaded}
        autoPlay={autoPlay}
      />
      {configuration.url === '' && 
        <RohText style={styles.textDescription}>Video not provided</RohText>
      }
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
  rootContainer: {
    height: Dimensions.get('window').height,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rootText: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
    fontSize: scaleSize(48),
  },
  textDescription: {
    position: 'absolute',
    flex: 1,
    alignSelf: 'center',
    top: scaleSize(180),
    fontSize: scaleSize(80),
    color: 'red'
  },
});

export default Player;
