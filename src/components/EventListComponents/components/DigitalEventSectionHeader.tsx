import RohText from '@components/RohText';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { Colors } from '@themes/Styleguide';

type TDigitalEventSectionHeaderProps = {};
const DigitalEventSectionHeader: React.FC<TDigitalEventSectionHeaderProps> = ({
  children,
}) => {
  if (!children) {
    return null;
  }
  return (
    <View>
      <RohText style={styles.title}>{children}</RohText>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(26),
    marginBottom: scaleSize(20),
    textTransform: 'uppercase',
  },
});

export default DigitalEventSectionHeader;
