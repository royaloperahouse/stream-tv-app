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
import { TTouchableHighlightWrapperRef } from '@components/TouchableHighlightWrapper';
import RohText from '@components/RohText';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import SubtitlesItem from './SubtitlesItem';
import ArrowDropdown from '@assets/svg/player/ArrowDropdownForPlayer.svg';
import { ESeekOperations } from '@configs/playerConfig';

type TPlayerControlsProps = {
  duration: number;
  playerLoaded: boolean;
  title: string;
  subtitle: string;
  onPlayPress: () => void;
  onRestartPress: () => void;
  onPausePress: () => void;
  onClose: () => void;
  setSubtitle: (trackId: string) => void;
  autoPlay: boolean;
  subtitleCue: string;
  calculateTimeForSeeking: (
    startTime: number,
    countOfSeekingIteration: number,
    seekOp: ESeekOperations,
  ) => number;
  seekTo: (time: number) => void;
};

export type TPlayerControlsRef = {
  setCurrentTime?: (time: number) => void;
  setPlay?: (isPlaying: boolean) => void;
  loadSubtitleList?: (subtitles: TSubtitles) => void;
  controlFadeIn?: () => void;
  controlFadeOut?: () => void;
  setSeekQueueFree?: () => void;
  seekUpdatingFinished?: () => void;
};

const PlayerControls = forwardRef<TPlayerControlsRef, TPlayerControlsProps>(
  (props, ref) => {
    const {
      duration,
      title,
      subtitle,
      onPlayPress,
      onRestartPress,
      onPausePress,
      onClose,
      setSubtitle,
      playerLoaded,
      autoPlay,
      subtitleCue,
      calculateTimeForSeeking,
      seekTo,
    } = props;
    const tvEventHandler = useRef<typeof TVEventHandler>(new TVEventHandler());
    const activeAnimation = useRef<Animated.Value>(
      new Animated.Value(0),
    ).current;
    const isPlayingRef = useRef<boolean>(false);
    const controlMountedRef = useRef<boolean>(false);
    const progressBarRef = useRef<TProgressBarRef | null>(null);
    const subtitleButtonRef = useRef<null | TTouchableHighlightWrapperRef>(
      null,
    );
    const centralControlsRef = useRef<TCentralControlsRef | null>(null);
    const subtitlesRef = useRef<null | TSubtitlesRef>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const controlPanelVisibleRef = useRef<boolean>(true);
    const [hasSubtitles, setHasSubtitles] = useState<boolean>(false);
    const countOfFastForwardClicks = useRef<number>(0);
    const countOfRewindClicks = useRef<number>(0);
    const seekQueueuBusy = useRef<boolean>(false);
    const seekUpdatingOnDevice = useRef<boolean>(false);
    const startPointForSeek = useRef<number>(0.0);
    const seekOperation = useRef<ESeekOperations>(ESeekOperations.fastForward);
    const exitButtonRef = useRef<any>();
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
    const getControlPanelVisible = useCallback(
      () => controlPanelVisibleRef.current,
      [],
    );
    useImperativeHandle(
      ref,
      () => ({
        setCurrentTime: (time: number) => {
          const timeForSeeking: number = calculateTimeForSeeking(
            startPointForSeek.current,
            seekOperation.current === ESeekOperations.fastForward
              ? countOfFastForwardClicks.current
              : countOfRewindClicks.current,
            seekOperation.current,
          );
          if (
            !controlMountedRef.current ||
            typeof progressBarRef.current?.setCurrentTime !== 'function'
          ) {
            return;
          }

          if (!seekQueueuBusy.current) {
            countOfRewindClicks.current = 0;
            countOfFastForwardClicks.current = 0;
            startPointForSeek.current = time;
            progressBarRef.current?.setCurrentTime(time);
          } else if (timeForSeeking !== -1) {
            progressBarRef.current?.setCurrentTime(timeForSeeking);
          }
        },
        setPlay: (play: boolean) => {
          if (!controlMountedRef.current) {
            return;
          }
          isPlayingRef.current = play;
          if (typeof centralControlsRef.current?.setPlay === 'function') {
            centralControlsRef.current.setPlay(play);
          }
        },
        loadSubtitleList: (subtitles: TSubtitles) => {
          if (!controlMountedRef.current) {
            return;
          }
          if (subtitles.length > 1) {
            setHasSubtitles(true);
          }
          if (typeof subtitlesRef?.current?.setsubtitleList === 'function') {
            subtitlesRef.current.setsubtitleList(subtitles);
          }
        },
        controlFadeIn: () => {
          Animated.timing(activeAnimation, {
            toValue: 0,
            useNativeDriver: true,
            duration: 5000,
          }).start(({ finished }) => {
            if (finished) {
              controlPanelVisibleRef.current = false;
            }
          });
        },
        controlFadeOut: () => {
          Animated.timing(activeAnimation, {
            toValue: 1,
            useNativeDriver: true,
            duration: 500,
          }).start(({ finished }) => {
            if (finished) {
              controlPanelVisibleRef.current = true;
            }
          });
        },
        setSeekQueueFree: () => {
          if (!controlMountedRef.current) {
            return;
          }
          seekQueueuBusy.current = false;
        },
        seekUpdatingFinished: () => {
          if (!controlMountedRef.current) {
            return;
          }
          seekUpdatingOnDevice.current = false;
        },
      }),
      [calculateTimeForSeeking],
    );

    useLayoutEffect(() => {
      if (autoPlay && playerLoaded) {
        activeAnimation.setValue(1);
        controlPanelVisibleRef.current = true;
        Animated.timing(activeAnimation, {
          toValue: 0,
          useNativeDriver: true,
          duration: 5000,
        }).start(({ finished }) => {
          if (finished) {
            controlPanelVisibleRef.current = false;
          }
        });
      }
      if (!autoPlay && playerLoaded) {
        activeAnimation.setValue(1);
        controlPanelVisibleRef.current = true;
      }
    }, [autoPlay && playerLoaded]);

    useLayoutEffect(() => {
      tvEventHandler.current?.enable(null, (_: any, eve: any) => {
        if (eve?.eventType === 'blur' || eve?.eventType === 'focus') {
          return;
        }
        if (eve.eventKeyAction === 0) {
          switch (eve.eventType) {
            case 'select': {
              if (
                eve.target === centralControlsRef.current?.getFwdNode() &&
                seekUpdatingOnDevice.current === false &&
                (seekOperation.current === ESeekOperations.fastForward ||
                  seekQueueuBusy.current === false)
              ) {
                seekQueueuBusy.current = true;
                countOfFastForwardClicks.current++;
                seekOperation.current = ESeekOperations.fastForward;
                break;
              }
              if (
                eve.target === centralControlsRef.current?.getRwdNode() &&
                seekUpdatingOnDevice.current === false &&
                (seekOperation.current === ESeekOperations.rewind ||
                  seekQueueuBusy.current === false)
              ) {
                seekQueueuBusy.current = true;
                countOfRewindClicks.current++;
                seekOperation.current = ESeekOperations.rewind;
                break;
              }
              break;
            }
            case 'fastForward': {
              if (
                seekUpdatingOnDevice.current ||
                (seekOperation.current !== ESeekOperations.fastForward &&
                  seekQueueuBusy.current)
              ) {
                break;
              }
              seekQueueuBusy.current = true;
              countOfFastForwardClicks.current++;
              seekOperation.current = ESeekOperations.fastForward;
              break;
            }
            case 'rewind': {
              if (
                seekUpdatingOnDevice.current ||
                (seekOperation.current !== ESeekOperations.rewind &&
                  seekQueueuBusy.current)
              ) {
                break;
              }
              seekQueueuBusy.current = true;
              countOfRewindClicks.current++;
              seekOperation.current = ESeekOperations.rewind;
              break;
            }
            default:
              break;
          }
        }

        if (eve.eventKeyAction === 1) {
          switch (eve.eventType) {
            case 'select': {
              if (
                eve.target === centralControlsRef.current?.getFwdNode() &&
                countOfFastForwardClicks.current &&
                seekOperation.current === ESeekOperations.fastForward
              ) {
                seekUpdatingOnDevice.current = true;
                const timeForSeeking: number = calculateTimeForSeeking(
                  startPointForSeek.current,
                  countOfFastForwardClicks.current,
                  seekOperation.current,
                );
                if (timeForSeeking === -1) {
                  countOfFastForwardClicks.current = 0;
                  seekUpdatingOnDevice.current = false;
                  seekQueueuBusy.current = false;
                  break;
                }
                seekTo(timeForSeeking);
                break;
              }
              if (
                eve.target === centralControlsRef.current?.getRwdNode() &&
                countOfRewindClicks.current &&
                seekOperation.current === ESeekOperations.rewind
              ) {
                seekUpdatingOnDevice.current = true;
                const timeForSeeking: number = calculateTimeForSeeking(
                  startPointForSeek.current,
                  countOfRewindClicks.current,
                  seekOperation.current,
                );
                if (timeForSeeking === -1) {
                  countOfRewindClicks.current = 0;
                  seekUpdatingOnDevice.current = false;
                  seekQueueuBusy.current = false;
                  break;
                }
                seekTo(timeForSeeking);
              }
              break;
            }
            case 'fastForward': {
              if (countOfFastForwardClicks.current) {
                seekUpdatingOnDevice.current = true;
                const timeForSeeking: number = calculateTimeForSeeking(
                  startPointForSeek.current,
                  countOfFastForwardClicks.current,
                  seekOperation.current,
                );
                if (timeForSeeking === -1) {
                  countOfFastForwardClicks.current = 0;
                  seekUpdatingOnDevice.current = false;
                  seekQueueuBusy.current = false;
                  break;
                }
                seekTo(timeForSeeking);
              }
              break;
            }
            case 'rewind': {
              if (countOfRewindClicks.current) {
                seekUpdatingOnDevice.current = true;
                const timeForSeeking: number = calculateTimeForSeeking(
                  startPointForSeek.current,
                  countOfRewindClicks.current,
                  seekOperation.current,
                );
                if (timeForSeeking === -1) {
                  countOfRewindClicks.current = 0;
                  seekUpdatingOnDevice.current = false;
                  seekQueueuBusy.current = false;
                  break;
                }
                seekTo(timeForSeeking);
              }
              break;
            }
            case 'playPause': {
              const currentPlayerAction = isPlayingRef.current
                ? onPausePress
                : onPlayPress;
              currentPlayerAction();
              break;
            }
            default:
              break;
          }
        }

        if (eve.eventKeyAction === 0) {
          Animated.timing(activeAnimation, {
            toValue: 1,
            useNativeDriver: true,
            duration: 500,
          }).start(({ finished }) => {
            if (!finished) {
              activeAnimation.setValue(1);
            }
            controlPanelVisibleRef.current = true;
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
              }).start(({ finished: animationFinished }) => {
                if (animationFinished) {
                  controlPanelVisibleRef.current = false;
                }
              });
            }, 5000);
          });
        }
      });
      return () => {
        tvEventHandler?.current.disable();
      };
    }, [onPausePress, onPlayPress, calculateTimeForSeeking, seekTo]);

    useLayoutEffect(() => {
      const intervalId = setInterval(() => {
        const timeForSeeking: number = calculateTimeForSeeking(
          startPointForSeek.current,
          seekOperation.current === ESeekOperations.fastForward
            ? countOfFastForwardClicks.current
            : countOfRewindClicks.current,
          seekOperation.current,
        );
        if (
          !controlMountedRef.current ||
          typeof progressBarRef.current?.setCurrentTime !== 'function'
        ) {
          return;
        }
        if (
          !isPlayingRef.current &&
          seekQueueuBusy.current &&
          timeForSeeking !== -1
        ) {
          progressBarRef.current.setCurrentTime(timeForSeeking);
        }
      }, 500);
      return () => {
        clearInterval(intervalId);
      };
    }, [calculateTimeForSeeking]);

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
              ref={exitButtonRef}
              icon={PlayerIcons.close}
              onPress={onClose}
              text="Exit"
              canMoveLeft={false}
              canMoveUp={false}
              nextFocusDown={centralControlsRef.current?.getRwdNode()}
              getControlPanelVisible={getControlPanelVisible}
            />
            <ControlButton
              icon={PlayerIcons.restart}
              onPress={onRestartPress}
              text="Restart"
              canMoveRight={false}
              canMoveUp={false}
              getControlPanelVisible={getControlPanelVisible}
              nextFocusDown={centralControlsRef.current?.getRwdNode()}
            />
          </View>
          <View style={styles.titleContainer}>
            <RohText
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail">
              {title}
            </RohText>
            {Boolean(subtitle) && (
              <RohText
                style={styles.subtitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {subtitle}
              </RohText>
            )}
          </View>
          <ProgressBar duration={duration} ref={progressBarRef} />
          <View style={styles.controlContainer}>
            <CentralControls
              onPausePress={onPausePress}
              onPlayPress={onPlayPress}
              ref={centralControlsRef}
              hasSubtitles={hasSubtitles}
              exitButtonNode={
                exitButtonRef.current?.getNode
                  ? exitButtonRef.current.getNode()
                  : undefined
              }
              getControlPanelVisible={getControlPanelVisible}
            />
            <View style={styles.rightControls}>
              {hasSubtitles && (
                <ControlButton
                  ref={subtitleButtonRef}
                  icon={PlayerIcons.subtitles}
                  onPress={openSubtitleListHandler}
                  getControlPanelVisible={getControlPanelVisible}
                  canMoveRight={false}
                  canMoveDown={false}
                  nextFocusUp={
                    exitButtonRef.current?.getNode
                      ? exitButtonRef.current.getNode()
                      : undefined
                  }
                />
              )}
            </View>
          </View>
        </Animated.View>
        <Subtitles
          focusToSutitleButton={focusToSutitleButton}
          ref={subtitlesRef}
          setSubtitle={setSubtitle}
        />
        {subtitleCue !== '' && (
          <View style={styles.subtitleCueContainer}>
            <RohText style={styles.subtitleCueText}>{subtitleCue}</RohText>
          </View>
        )}
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
  const subtitlesActiveItemRef = useRef<string | null>(null);
  const subtitlesMountedRef = useRef<boolean>(false);
  const hideSubtitles = () => {
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

  const onPressHandler = (trackId: string) => {
    subtitlesActiveItemRef.current = trackId;
    setSubtitle(trackId);
    hideSubtitles();
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
    subtitlesMountedRef.current = true;
  }, []);

  useAndroidBackHandler(() => {
    if (showList) {
      hideSubtitles();
      return true;
    }
    return false;
  });
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
              style={styles.subtitlesFlatListContainer}
              renderItem={({ item, index }) => (
                <SubtitlesItem
                  hasTVPreferredFocus={
                    (subtitlesActiveItemRef.current === null && index === 0) ||
                    subtitlesActiveItemRef.current === item.id
                  }
                  onPress={() => onPressHandler(item.id)}
                  currentIndex={index}
                  itemsLength={subtitleList.length}
                  text={
                    item.label === 'off'
                      ? `Subtitles ${item.label}`
                      : item.label
                  }
                />
              )}
            />
            <View style={styles.dropDownArrow}>
              <ArrowDropdown width={scaleSize(50)} height={scaleSize(50)} />
            </View>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
});

//Central Controls Component

type TCentralControlsProps = {
  onPausePress: () => void;
  onPlayPress: () => void;
  getControlPanelVisible: () => boolean;
  hasSubtitles: boolean;
  exitButtonNode?: number;
};
type TCentralControlsRef = {
  setPlay: (play: boolean) => void;
  getFwdNode: () => number | undefined;
  getRwdNode: () => number | undefined;
};
const CentralControls = forwardRef<TCentralControlsRef, TCentralControlsProps>(
  (props, ref) => {
    const {
      onPausePress,
      onPlayPress,
      getControlPanelVisible,
      hasSubtitles,
      exitButtonNode,
    } = props;
    const centralControlsMounted = useRef<boolean>(false);
    const [isPlaying, setPlaying] = useState(false);
    const fwdRef = useRef<TTouchableHighlightWrapperRef | null>(null);
    const rwdRef = useRef<TTouchableHighlightWrapperRef | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        setPlay: play => {
          if (centralControlsMounted.current) {
            setPlaying(play);
          }
        },
        getFwdNode: () => {
          if (
            centralControlsMounted.current &&
            typeof fwdRef.current?.getNode === 'function'
          ) {
            return fwdRef.current.getNode();
          }
        },
        getRwdNode: () => {
          if (
            centralControlsMounted.current &&
            typeof rwdRef.current?.getNode === 'function'
          ) {
            return rwdRef.current.getNode();
          }
        },
      }),
      [],
    );

    useLayoutEffect(() => {
      centralControlsMounted.current = true;
      return () => {
        centralControlsMounted.current = false;
      };
    }, []);
    return (
      <View style={styles.centralControls}>
        <ControlButton
          icon={PlayerIcons.seekBackward}
          ref={rwdRef}
          getControlPanelVisible={getControlPanelVisible}
          canMoveDown={false}
          canMoveLeft={false}
          nextFocusUp={exitButtonNode}
        />
        <ControlButton
          icon={isPlaying ? PlayerIcons.pause : PlayerIcons.play}
          onPress={isPlaying ? onPausePress : onPlayPress}
          hasTVPreferredFocus
          getControlPanelVisible={getControlPanelVisible}
          canMoveDown={false}
          nextFocusUp={exitButtonNode}
        />
        <ControlButton
          ref={fwdRef}
          icon={PlayerIcons.seekForward}
          getControlPanelVisible={getControlPanelVisible}
          canMoveDown={false}
          canMoveRight={hasSubtitles}
          nextFocusUp={exitButtonNode}
        />
      </View>
    );
  },
);

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
    fontSize: scaleSize(24),
    lineHeight: scaleSize(28),
    letterSpacing: scaleSize(1),
    paddingLeft: scaleSize(60),
    paddingVertical: scaleSize(35),
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
  },
  subtitlesFlatListContainer: {
    flex: 1,
  },
  subtitleText: { color: 'white', fontSize: scaleSize(24) },
  dropDownArrow: {
    marginTop: scaleSize(16),
    marginBottom: scaleSize(12),
    alignItems: 'center',
  },
  subtitleCueContainer: {
    position: 'absolute',
    top: 0,
    bottom: scaleSize(100),
    right: 0,
    left: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subtitleCueText: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'black',
    fontSize: scaleSize(32),
    padding: scaleSize(4),
  },
});
