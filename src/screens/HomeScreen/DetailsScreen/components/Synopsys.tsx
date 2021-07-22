import React from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';

import { scaleSize } from '@utils/scaleSize';

import { EventModel } from '@services/types/models';

import RohText from '@components/RohText';

import GoDown from './GoDown';

type Props = {
  event: EventModel;
};

const Synopsys: React.FC<Props> = ({ event }) => {
  return (
    <TouchableHighlight>
      <View style={styles.generalContainer}>
        <View style={styles.wrapper}>
          <RohText style={styles.title}>Synopsis</RohText>
          <RohText style={styles.synopsis}>{event.description}</RohText>
        </View>
        <View style={styles.downContainer}>
          <GoDown text="cast & more" />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: scaleSize(200),
  },
  wrapper: {
    marginTop: scaleSize(110),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: scaleSize(50),
    marginBottom: scaleSize(60),
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
  },
  synopsis: {
    flex: 1,
    color: 'white',
    fontSize: scaleSize(32),
  },
});

export default Synopsys;
