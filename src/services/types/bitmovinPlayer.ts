import { ViewProps } from 'react-native';
export type TBitmoviPlayerNativeProps = {
  autoPlay?: boolean;
  configuration: {
    url: string;
    poster?: string;
    subtitles?: string;
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
  style?: ViewProps['style'];
};

export type TBMPlayerShowingData = {
  videoId: string;
  url: string;
  title: string;
  poster?: string;
  subtitle?: string;
  position?: string;
};
