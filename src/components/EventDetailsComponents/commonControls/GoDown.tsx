import React from 'react';
import { View, StyleSheet } from 'react-native';
import Down from '@assets/svg/eventDetails/Down.svg';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';

type Props = {
  text: string;
  scrollToMe: () => void;
};

const GoDown: React.FC<Props> = ({ text = '', scrollToMe }) => {
  return (
    <TouchableHighlightWrapper onFocus={scrollToMe}>
      <View style={styles.container}>
        <Down width={scaleSize(50)} height={scaleSize(50)} />
        <RohText style={styles.text}>{text?.toUpperCase()}</RohText>
      </View>
    </TouchableHighlightWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    opacity: 0.7,
    alignItems: 'center',
  },
  text: {
    color: '#F1F1F1',
    fontSize: scaleSize(24),
    marginLeft: scaleSize(20),
  },
});

export default GoDown;
