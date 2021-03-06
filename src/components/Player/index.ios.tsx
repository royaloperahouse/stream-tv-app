import React, { useLayoutEffect, useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ViewProps,
  Dimensions,
  View,
} from 'react-native';
import RohText from '@components/RohText';
import GoBack from '@components/GoBack';
import { scaleSize } from '@utils/scaleSize';

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

  return (
    <View style={styles.rootContainer}>
      <GoBack />
      <RohText style={styles.rootText} bold>
        iOS bitmovin player coming soon
      </RohText>
    </View>
  );
};

const styles = StyleSheet.create({
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
