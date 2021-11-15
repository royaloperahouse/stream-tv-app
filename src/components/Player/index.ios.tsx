import React, { useLayoutEffect, useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ViewProps,
  Dimensions,
  View,
  HostComponent,
  requireNativeComponent,
} from 'react-native';
import RohText from '@components/RohText';
import GoBack from '@components/GoBack';
import { scaleSize } from '@utils/scaleSize';
import { useFocusEffect } from '@react-navigation/native';
import { TBitmovinPlayerNativeProps } from '@services/types/bitmovinPlayer';

let NativeBitMovinPlayer: HostComponent<TBitmovinPlayerNativeProps> =
  requireNativeComponent('ROHBitMovinPlayer');

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
  const playerMounted = useRef<boolean>(false);
  const [playerReady, setReady] = useState(false);


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
    </SafeAreaView>
    /* <View style={styles.rootContainer}>

      {shouldShowBack? <GoBack /> : null}
      <RohText style={styles.rootText} bold>
        iOS bitmovin player coming soon
      </RohText>
    </View> */
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
});

export default Player;
