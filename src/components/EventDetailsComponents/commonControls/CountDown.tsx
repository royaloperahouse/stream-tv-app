import React from 'react';
import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import moment from 'moment';
import { View, StyleSheet } from 'react-native';
import CountDownComponent from 'react-native-countdown-component';

type TCountDownProps = {
  publishingDate: moment.Moment;
  nowDate: moment.Moment;
  finishCB?: () => void;
};

const CountDown: React.FC<TCountDownProps> = ({
  publishingDate,
  nowDate,
  finishCB = () => {},
}) => {
  return (
    <View style={styles.countDownBlockContainer}>
      <View>
        <RohText style={styles.titleText}>Live stream starts in:</RohText>
      </View>
      <View style={styles.countDownContainer}>
        <CountDownComponent
          showSeparator
          until={publishingDate.diff(nowDate, 'seconds')}
          timeLabels={{ d: 'DAYS', h: 'HRS', m: 'MINS', s: 'SECS' }}
          digitStyle={styles.countDownNumberCellContainer}
          digitTxtStyle={styles.countDownCellNumber}
          timeLabelStyle={styles.countDownCellTitle}
          separatorStyle={styles.doubleDotText}
          onFinish={() => {
            setTimeout(() => {
              finishCB();
            }, 500);
          }}
        />
      </View>
    </View>
  );
};

export default CountDown;
const styles = StyleSheet.create({
  countDownBlockContainer: {
    marginTop: scaleSize(30),
  },
  titleText: {
    lineHeight: scaleSize(24),
    fontSize: scaleSize(20),
    letterSpacing: scaleSize(2),
    color: Colors.defaultTextColor,
    textTransform: 'uppercase',
  },
  countDownContainer: {
    flexDirection: 'row',
    height: scaleSize(70),
    marginTop: scaleSize(8),
  },
  countDownNumberCellContainer: {
    height: scaleSize(70),
  },
  countDownCellNumber: {
    fontSize: scaleSize(38),
    lineHeight: scaleSize(44),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
    paddingBottom: scaleSize(4),
  },
  countDownCellTitle: {
    fontSize: scaleSize(16),
    lineHeight: scaleSize(22),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
  doubleDotContainer: {
    paddingHorizontal: scaleSize(30),
  },
  doubleDotText: {
    fontSize: scaleSize(38),
    lineHeight: scaleSize(44),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
});
