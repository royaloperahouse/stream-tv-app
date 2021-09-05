import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, PlayerIcons } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';

import ControlButton from './ControlButton';

import RohText from '@components/RohText';
import { useRef } from 'react';

type TPlayerControlsProps = {
  duration: number;
  playerLoaded: boolean;
  title: string;
  subtitle: string;
  onPlayPress: () => void;
  onSeekForwardPress: () => void;
  onSeekBackwardPress: () => void;
  onRestartPress: () => void;
  onPausePress: () => void;
  onClose: () => void;
};

let hideTimer: any;
export type TPlayerControlsRef = {
  setCurrentTime?: (time: number) => void;
  setPlay?: (isPlaying: boolean) => void;
};

const PlayerControls = forwardRef<TPlayerControlsRef, TPlayerControlsProps>(
  (props, ref) => {
    const {
      duration,
      playerLoaded,
      title,
      subtitle,
      onPlayPress,
      onSeekForwardPress,
      onSeekBackwardPress,
      onRestartPress,
      onPausePress,
      onClose,
    } = props;

    const [inactive, setInactive] = useState(false);
    const [isPlaying, setPlaying] = useState(false);
    const controlMountedRef = useRef<boolean>(false);
    const progressBarRef = useRef<TProgressBarRef | null>(null);
    useImperativeHandle(
      ref,
      () => ({
        setCurrentTime: (time: number) => {
          if (!controlMountedRef.current) {
            return;
          }
          if (typeof progressBarRef.current?.setCurrentTime === 'function') {
            progressBarRef.current?.setCurrentTime(time);
          }
        },
        setPlay: (play: boolean) => {
          if (!controlMountedRef.current) {
            return;
          }
          setPlaying(play);
        },
      }),
      [],
    );
    const resetTimer = () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
      hideTimer = setTimeout(() => setInactive(!isPlaying), 5000);
    };

    const activateControls = (callback?: (...args: any[]) => void) => {
      setInactive(false);
      resetTimer();
      if (typeof callback === 'function') {
        callback();
      }
    };
    useLayoutEffect(() => {
      controlMountedRef.current = true;
      return () => {
        clearTimeout(hideTimer);
      };
    }, []);
    return (
      <View style={[styles.container, { opacity: inactive ? 0 : 1 }]}>
        <View style={styles.topContainer}>
          <ControlButton
            icon={PlayerIcons.close}
            onPress={() => activateControls(onClose)}
            onFocus={activateControls}
            text="Exit"
            expand
          />
          {playerLoaded && (
            <ControlButton
              icon={PlayerIcons.restart}
              onPress={() => activateControls(onRestartPress)}
              onFocus={activateControls}
              text="Restart"
              expand
            />
          )}
        </View>
        <View style={styles.titleContainer}>
          <RohText style={styles.title}>{title}</RohText>
          <RohText style={styles.subtitle}>{subtitle}</RohText>
        </View>
        <ProgressBar duration={duration} ref={progressBarRef} />
        {playerLoaded && (
          <View style={styles.controlContainer}>
            <View style={styles.centralControls}>
              <ControlButton
                icon={PlayerIcons.seekBackward}
                onPress={() => activateControls(onSeekBackwardPress)}
                onFocus={activateControls}
              />
              <ControlButton
                icon={isPlaying ? PlayerIcons.pause : PlayerIcons.play}
                onPress={() =>
                  activateControls(isPlaying ? onPausePress : onPlayPress)
                }
                onFocus={activateControls}
                hasTVPreferredFocus
              />
              <ControlButton
                icon={PlayerIcons.seekForward}
                onPress={() => activateControls(onSeekForwardPress)}
                onFocus={activateControls}
              />
            </View>
            <View style={styles.rightControls}>
              <ControlButton icon={PlayerIcons.subtitles} />
              <ControlButton icon={PlayerIcons.description} />
            </View>
          </View>
        )}
      </View>
    );
  },
);

export default PlayerControls;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    top: scaleSize(60),
    left: scaleSize(200),
    bottom: scaleSize(64),
    right: scaleSize(200),
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
  },
  titleContainer: {
    width: '100%',
  },
  title: {
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
    color: Colors.defaultTextColor,
  },
  subtitle: {
    fontSize: scaleSize(24),
    textTransform: 'uppercase',
    color: Colors.defaultTextColor,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: scaleSize(112), //176
    flexDirection: 'row',
  },
  controlContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    right: 0,
    left: 0,
  },
  centralControls: {
    flexDirection: 'row',
  },
  rightControls: {
    position: 'absolute',
    right: 0,
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
    backgroundColor: Colors.defaultTextColor,
  },
  progressBarInactive: {
    height: scaleSize(8),
    backgroundColor: Colors.defaultTextColor,
    opacity: 0.5,
  },
  currentTime: {
    fontSize: scaleSize(24),
    textTransform: 'uppercase',
    color: Colors.defaultTextColor,
  },
  duration: {
    fontSize: scaleSize(24),
    textTransform: 'uppercase',
    color: Colors.defaultTextColor,
  },
});

type TProgressBarRef = {
  setCurrentTime?: (time: number) => void;
};
type TProgressBarProps = { duration: number };

const ProgressBar = forwardRef<TProgressBarRef, TProgressBarProps>(
  ({ duration }, ref) => {
    const [currentTime, setCurrentTime] = useState<number>(0.0);
    const progressBarMountedRef = useRef<boolean>(false);
    useImperativeHandle(
      ref,
      () => ({
        setCurrentTime: (time: number) => {
          if (!progressBarMountedRef.current) {
            return;
          }
          setCurrentTime(time);
        },
      }),
      [],
    );
    const getTimeFormat = (time: number = 0): string => {
      let date = new Date(0);
      date.setSeconds(time);
      return date.toISOString().substr(11, 8);
    };
    useLayoutEffect(() => {
      progressBarMountedRef.current = true;
    }, []);
    return (
      <View style={styles.progressContainer}>
        <RohText style={styles.currentTime}>
          {getTimeFormat(currentTime)}
        </RohText>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarActive,
              { width: (currentTime / duration) * 100 + '%' },
            ]}
          />
          <View
            style={[
              styles.progressBarInactive,
              { width: 100 - (currentTime / duration) * 100 + '%' },
            ]}
          />
        </View>
        <RohText style={styles.duration}>{getTimeFormat(duration)}</RohText>
      </View>
    );
  },
);
