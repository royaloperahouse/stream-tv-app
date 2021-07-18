import React from 'react';
import { Text, TextProps } from 'react-native';

import { Fonts } from '@themes/Styleguide';

type TRohTextProps = TextProps & {
  bold?: boolean;
  italic?: boolean;
};

const RohText: React.FC<TRohTextProps> = ({
  style = {},
  children,
  bold,
  italic,
  ...props
}) => {
  let fontFamily = Fonts.default;

  if (bold && italic) {
    fontFamily = Fonts.boldItalic;
  } else if (bold) {
    fontFamily = Fonts.bold;
  } else if (italic) {
    fontFamily = Fonts.italic;
  }

  return (
    <Text {...props} style={[style, { fontFamily }]}>
      {children}
    </Text>
  );
};

export default RohText;
