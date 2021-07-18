import { Dimensions } from 'react-native';

// scale the size based on the resolution
export const scaleSize = (size: number): number => {
  const defaultScreenWidth = 1920;
  const screenWidth = Dimensions.get('window').width;
  const modifier = screenWidth / defaultScreenWidth;
  return size * modifier;
};
