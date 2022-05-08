import { ViewProps } from 'react-native';
export type TBitmovinPlayerNativeProps = {
  autoPlay?: boolean;
  hasZoom?: boolean;
  hasChromecast?: boolean;
  color?: string;
  onReady?: (event: any) => void;
  onChromecast?: (event: any) => void;
  onPlay?: (event: any) => void;
  onAirPlay?: (event: any) => void;
  onPause?: (event: any) => void;
  onEvent?: (event: any) => void;
  onError?: (event: any) => void;
  onSeek?: (event: any) => void;
  onForward?: (event: any) => void;
  onRewind?: (event: any) => void;
  onTimeChanged?: (event: any) => void;
  onStallStarted?: (event: any) => void;
  onStallEnded?: (event: any) => void;
  onPlaybackFinished?: (event: any) => void;
  onRenderFirstFrame?: (event: any) => void;
  onPlayerError?: (event: any) => void;
  onMuted?: (event: any) => void;
  onUnmuted?: (event: any) => void;
  onSeeked?: (event: any) => void;
  onFullscreenEnter?: (event: any) => void;
  onFullscreenExit?: (event: any) => void;
  onControlsShow?: (event: any) => void;
  onControlsHide?: (event: any) => void;
  configuration: {
    url: string;
    poster?: string;
    subtitles?: string;
    offset?: string;
  };
  analytics?: {
    videoId?: string;
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
};

export type ROHBitmovinPlayerMethodsType = {
  play(): void;
  pause(): void;
  destroy(): void;
  seekBackwardCommand(): void;
  seekForwardCommand(): void;
}

export type TBMPlayerShowingData = {
  videoId: string;
  url: string;
  title: string;
  poster?: string;
  subtitle?: string;
  position?: string;
  eventId: string;
  savePosition?: boolean;
};

export type TBMPlayerErrorObject = {
  errCode: string;
  errMessage: string;
  url?: string;
};
