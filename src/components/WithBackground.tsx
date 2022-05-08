import React from 'react';
import { StyleSheet, ImageBackground, Dimensions, View } from 'react-native';
import { Colors } from '@themes/Styleguide';
import Svg, {
  SvgProps,
  Path,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';

type TWithBackgroundProps = {
  url?: string;
};

const WithBackground: React.FC<TWithBackgroundProps> = ({ url, children }) => {
  const source = { uri: url };
  if (url) {
    return (
      <ImageBackground
        resizeMode="cover"
        style={styles.containerBackground}
        source={source}>
        {children}
      </ImageBackground>
    );
  }
  return (
    <View style={styles.containerBackground}>
      <TopGradient />
      <View style={[{ position: 'absolute', bottom: 0, right: 0 }]}>
        <BottomGradient />
      </View>
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  containerBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: Colors.backgroundColor,
  },
});

export default WithBackground;

const TopGradient = (props: SvgProps) => {
  const width = Dimensions.get('screen').width * 0.57;
  const height = Dimensions.get('screen').height * 0.57;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        opacity={0.4}
        transform={`rotate(-180 ${width} ${height})`}
        fill="url(#a)"
        d={`M${width} ${height}h${width}v${height}H${width}z`}
      />
      <Defs>
        <RadialGradient
          id="a"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform={`matrix(0 -${height} ${width} 0 ${width * 2} ${
            height * 2
          })`}>
          <Stop stopColor="#1866DC" />
          <Stop offset={1} stopColor="#1866DC" stopOpacity={0} />
        </RadialGradient>
      </Defs>
    </Svg>
  );
};

const BottomGradient = (props: SvgProps) => {
  const width = Dimensions.get('screen').width * 0.57;
  const height = Dimensions.get('screen').height * 0.57;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path opacity={0.4} fill="url(#a)" d={`M0 0h${width}v${height}H0z`} />
      <Defs>
        <RadialGradient
          id="a"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform={`matrix(0 -${height} ${width} 0 ${width} ${height})`}>
          <Stop stopColor="#1866DC" />
          <Stop offset={1} stopColor="#1866DC" stopOpacity={0} />
        </RadialGradient>
      </Defs>
    </Svg>
  );
};
