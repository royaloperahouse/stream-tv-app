import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  SafeAreaView,
} from 'react-native';
import TVEventHandler from 'react-native/Libraries/Components/AppleTV/TVEventHandler';
import { Colors, PlayerIcons } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';

import ControlButton from './ControlButton';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import RohText from '@components/RohText';

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
  setSubtitle: (trackId: string) => void;
};

export type TPlayerControlsRef = {
  setCurrentTime?: (time: number) => void;
  setPlay?: (isPlaying: boolean) => void;
  loadSubtitleList?: (subtitles: TSubtitles) => void;
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
      setSubtitle,
    } = props;
    const tvEventHandler = useRef<typeof TVEventHandler>(new TVEventHandler());
    const tvEventFireCounter = useRef<number>(0);
    const activeAnimation = useRef<Animated.Value>(
      new Animated.Value(1),
    ).current;
    const [isPlaying, setPlaying] = useState(false);
    const isPlayingRef = useRef<boolean>(false);
    const controlMountedRef = useRef<boolean>(false);
    const progressBarRef = useRef<TProgressBarRef | null>(null);
    const subtitleButtonRef = useRef<null | TTouchableHighlightWrapperRef>(
      null,
    );
    const subtitlesRef = useRef<null | TSubtitlesRef>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const focusToSutitleButton = useCallback(() => {
      if (
        typeof subtitleButtonRef.current?.getRef === 'function' &&
        subtitleButtonRef.current.getRef()
      ) {
        subtitleButtonRef.current
          .getRef()
          .current?.setNativeProps({ hasTVPreferredFocus: true });
      }
    }, []);
    const openSubtitleListHandler = () => {
      if (typeof subtitlesRef?.current?.showSubtitles === 'function') {
        subtitlesRef.current.showSubtitles();
      }
    };
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
          isPlayingRef.current = play;
          setPlaying(play);
        },
        loadSubtitleList: (subtitles: TSubtitles) => {
          if (!controlMountedRef.current) {
            return;
          }
          if (typeof subtitlesRef?.current?.setsubtitleList === 'function') {
            subtitlesRef.current.setsubtitleList(subtitles);
          }
        },
      }),
      [],
    );

    useLayoutEffect(() => {
      tvEventHandler.current?.enable(null, (_: any, eve: any) => {
        if (
          !controlMountedRef.current ||
          eve?.eventType === 'blur' ||
          eve?.eventType === 'focus'
        ) {
          return;
        }
        if (tvEventFireCounter.current === 1) {
          tvEventFireCounter.current = 0;
          Animated.timing(activeAnimation, {
            toValue: 1,
            useNativeDriver: true,
            duration: 500,
          }).start(({ finished }) => {
            if (!finished) {
              activeAnimation.setValue(1);
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              if (!isPlayingRef.current) {
                return;
              }
              Animated.timing(activeAnimation, {
                toValue: 0,
                useNativeDriver: true,
                duration: 500,
              }).start();
            }, 5000);
          });
          return;
        }
        tvEventFireCounter.current += 1;
      });
      return () => {
        tvEventHandler?.current.disable();
      };
    }, [activeAnimation]);

    useLayoutEffect(() => {
      controlMountedRef.current = true;
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <SafeAreaView style={styles.root}>
        <Animated.View style={[styles.container, { opacity: activeAnimation }]}>
          <View style={styles.topContainer}>
            <ControlButton
              icon={PlayerIcons.close}
              onPress={onClose}
              text="Exit"
              expand
            />
            {playerLoaded && (
              <ControlButton
                icon={PlayerIcons.restart}
                onPress={onRestartPress}
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
                  onPress={onSeekBackwardPress}
                />
                <ControlButton
                  icon={isPlaying ? PlayerIcons.pause : PlayerIcons.play}
                  onPress={isPlaying ? onPausePress : onPlayPress}
                  hasTVPreferredFocus
                />
                <ControlButton
                  icon={PlayerIcons.seekForward}
                  onPress={onSeekForwardPress}
                />
              </View>
              <View style={styles.rightControls}>
                <ControlButton
                  ref={subtitleButtonRef}
                  icon={PlayerIcons.subtitles}
                  onPress={openSubtitleListHandler}
                />
              </View>
            </View>
          )}
        </Animated.View>
        <Subtitles
          focusToSutitleButton={focusToSutitleButton}
          ref={subtitlesRef}
          setSubtitle={setSubtitle}
        />
      </SafeAreaView>
    );
  },
);

export default PlayerControls;

//ProgressBar component

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

//Subtitles component

type TSubtitlesProps = {
  focusToSutitleButton: () => void;
  setSubtitle: (trackId: string) => void;
};
export type TSubtitles = Array<{
  url: string;
  id: string;
  label: string;
}>;

type TSubtitlesRef = {
  setsubtitleList: (subtitles: TSubtitles) => void;
  showSubtitles: () => void;
};

const Subtitles = forwardRef<TSubtitlesRef, TSubtitlesProps>((props, ref) => {
  const { focusToSutitleButton, setSubtitle } = props;
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const subtitleContainerAnimation = useRef(new Animated.Value(0)).current;
  const [subtitleList, setSubtitleList] = useState<TSubtitles>([]);
  const [showList, setShowList] = useState<boolean>(false);
  const showListPrevState = useRef<boolean>(showList);
  const firstItemRef = useRef<TTouchableHighlightWrapperRef | null>(null);
  const subtitlesMountedRef = useRef<boolean>(false);

  const onPressHandler = (trackId: string) => {
    setSubtitle(trackId);
    if (typeof focusToSutitleButton === 'function') {
      focusToSutitleButton();
    }
    Animated.timing(subtitleContainerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(sutitleAnimationResult => {
      if (!sutitleAnimationResult.finished) {
        subtitleContainerAnimation.setValue(0);
      }
      setShowList(false);
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(overlayAnimationResult => {
        if (!overlayAnimationResult.finished) {
          overlayAnimation.setValue(0);
        }
      });
    });
  };
  useImperativeHandle(
    ref,
    () => ({
      setsubtitleList: (subtitles: TSubtitles) => {
        if (!subtitlesMountedRef.current) {
          return;
        }
        setSubtitleList(subtitles);
      },
      showSubtitles: () => {
        if (
          !subtitlesMountedRef.current ||
          !Array.isArray(subtitleList) ||
          !subtitleList.length
        ) {
          return;
        }
        Animated.timing(overlayAnimation, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }).start(overlayAnimationResult => {
          if (!overlayAnimationResult.finished) {
            overlayAnimation.setValue(0.5);
          }
          setShowList(true);
          Animated.timing(subtitleContainerAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start(sutitleAnimationResult => {
            if (!sutitleAnimationResult.finished) {
              subtitleContainerAnimation.setValue(1);
            }
          });
        });
      },
    }),
    [subtitleList, overlayAnimation, subtitleContainerAnimation],
  );

  useLayoutEffect(() => {
    if (
      showList &&
      typeof firstItemRef.current?.getRef === 'function' &&
      firstItemRef.current.getRef()
    ) {
      firstItemRef.current
        .getRef()
        .current?.setNativeProps({ hasTVPreferredFocus: true });
    }
    showListPrevState.current = showList;
  }, [showList]);

  useLayoutEffect(() => {
    subtitlesMountedRef.current = true;
  }, []);
  return (
    <SafeAreaView style={styles.subtitlesContainer}>
      <Animated.View
        style={[
          styles.subtitlesShadowOverlay,
          {
            opacity: overlayAnimation,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.subtitlesContentContainer,
          {
            opacity: subtitleContainerAnimation,
          },
        ]}>
        {showList && (
          <View style={styles.subtitlesListContainer}>
            <RohText style={styles.subtitlesContainerTitleText}>
              subtitles
            </RohText>
            <FlatList
              data={subtitleList}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableHighlightWrapper
                  ref={index === 0 ? firstItemRef : undefined}
                  onPress={() => onPressHandler(item.id)}
                  canMoveUp={index !== 0}
                  canMoveLeft={false}
                  canMoveRight={false}
                  canMoveDown={index !== subtitleList.length - 1}
                  style={styles.subtitleItemContainer}
                  styleFocused={{
                    backgroundColor: Colors.defaultBlue,
                  }}>
                  <RohText style={styles.subtitleText}>
                    {item.label + ' ' + item.id}
                  </RohText>
                </TouchableHighlightWrapper>
              )}
            />
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
    bottom: scaleSize(112),
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
  shadowWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  subtitlesContainerTitleText: {
    textTransform: 'uppercase',
    color: 'white',
    fontSize: scaleSize(32),
    marginVertical: scaleSize(15),
  },
  subtitlesContainer: {
    flex: 1,
  },
  subtitlesShadowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  subtitlesContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  subtitlesListContainer: {
    backgroundColor: Colors.backgroundColor,
    width: scaleSize(528),
    height: scaleSize(631),
    alignItems: 'center',
  },
  subtitleItemContainer: {
    width: '100%',
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleText: { color: 'white', fontSize: scaleSize(24) },
});
