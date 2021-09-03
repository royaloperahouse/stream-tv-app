import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { PlayerIcons } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';

import ControlButton from './ControlButton';

import RohText from '@components/RohText';

type TPlayerControlsProps = {
  currentTime: number,
  duration: number,
  playerLoaded: boolean,
  isPlaying: boolean,
  title: string,
  subtitle: string,
  onPlayPress: () => void,
  onSeekForwardPress: () => void,
  onSeekBackwardPress: () => void,
  onRestartPress: () => void,
};

let hideTimer: any;

const PlayerControls: React.FC<TPlayerControlsProps> = (props) => {
  const {
    currentTime,
    duration,
    playerLoaded,
    isPlaying,
    title,
    subtitle,
    onPlayPress,
    onSeekForwardPress,
    onSeekBackwardPress,
    onRestartPress,
  } = props;

  let currentTimeFormatted;
  let durationFormatted;

  let date = new Date(0);
  date.setSeconds(currentTime);
  currentTimeFormatted = date.toISOString().substr(11, 8);

  date.setSeconds(duration);
  durationFormatted = date.toISOString().substr(11, 8);

  const [inactive, setInactive] = useState(false);

  const resetTimer = () => {
    if (hideTimer) clearTimeout(hideTimer);
    if (isPlaying) hideTimer = setTimeout(() => setInactive(isPlaying), 5000);
  };

  const activateControls = (callback?: any) => {
    setInactive(false);
    resetTimer();
    callback && callback();
  };

  return (
    <View style={[styles.container, { opacity: inactive ? 0 : 1, }]}>
      <View style={styles.topContainer}>
        <ControlButton icon={PlayerIcons.close} onPress={activateControls} onFocus={activateControls} text='Exit' expand={true} />
        <ControlButton icon={PlayerIcons.restart} onPress={() => activateControls(onRestartPress)} onFocus={activateControls} text='Restart' expand={true} />
      </View>
      <View style={styles.titleContainer}>
        <RohText style={styles.title}>{title}</RohText>
        <RohText style={styles.subtitle}>{subtitle}</RohText>
      </View>
      <View style={styles.progressContainer}>
        <RohText style={styles.currentTime}>{currentTimeFormatted}</RohText>
        <View style={styles.progressBar}>
          <View style={[ styles.progressBarActive, { width: (currentTime / duration * 100) + '%' }]} />
          <View style={[ styles.progressBarInactive, { width: (100 - (currentTime / duration * 100)) + '%' }]} />
        </View>
        <RohText style={styles.duration}>{durationFormatted}</RohText>
      </View>
      { playerLoaded &&
        <View style={styles.controlContainer}>
          <View style={styles.centralControls}>
            <ControlButton icon={PlayerIcons.seekBackward} onPress={() => activateControls(onSeekBackwardPress)} onFocus={activateControls} />
            <ControlButton icon={isPlaying ? PlayerIcons.pause : PlayerIcons.play} onPress={() => activateControls(onPlayPress)} onFocus={activateControls} />
            <ControlButton icon={PlayerIcons.seekForward} onPress={() => activateControls(onSeekForwardPress)} onFocus={activateControls} />
          </View>
          <View style={styles.rightControls}>
            <ControlButton icon={PlayerIcons.subtitles} text='Subtitles' expand={true} />
            <ControlButton icon={PlayerIcons.description} text='Watch with audio description' expand={true} />
          </View>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  topContainer: {
    position: 'absolute',
    top: scaleSize(60),
    left: scaleSize(200),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'column',
    width: '100%',
    left: scaleSize(200),
  },
  title: {
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
    color: 'white',
  },
  subtitle: {
    fontSize: scaleSize(24),
    textTransform: 'uppercase',
    color: 'white',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: scaleSize(176),
    flexDirection: 'row',
  },
  controlContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: scaleSize(64),
    width: '100%',
  },
  centralControls: {
    flexDirection: 'row',
  },
  rightControls: {
    position: 'absolute',
    right: scaleSize(200),
    flexDirection: 'row',
  },
  progressBar: {
    flexDirection: 'row',
    width: scaleSize(1262),
    height: scaleSize(8),
    marginLeft: scaleSize(20),
    marginRight: scaleSize(20),
  },
  progressBarActive: {
    height: scaleSize(8),
    backgroundColor: 'white',
  },
  progressBarInactive: {
    height: scaleSize(8),
    backgroundColor: 'white',
    opacity: 0.5,
  },
  currentTime: {
    fontSize: scaleSize(24),
    textTransform: 'uppercase',
    color: 'white',
  },
  duration: {
    fontSize: scaleSize(24),
    textTransform: 'uppercase',
    color: 'white',
  },
});

export default PlayerControls;
