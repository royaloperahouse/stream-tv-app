import React from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { EventModel } from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from './GoDown';

type Props = {
  event: EventModel;
};

const Cast: React.FC<Props> = ({ event }) => {
  return (
    <TouchableHighlight>
      <View style={styles.generalContainer}>
        <View style={styles.wrapper}>
          <RohText style={styles.title}>Cast {'\n'}& Creatives</RohText>
          <View style={styles.castCreativesContainer}>
            <View style={styles.columnContainer}>
              <RohText style={styles.columnTtitle}>Cast</RohText>
              {event.cast.map(cast => (
                <View style={styles.elementContainer} key={cast.role}>
                  <RohText style={styles.role}>{cast.role}</RohText>
                  <RohText style={styles.name}>{cast.name}</RohText>
                </View>
              ))}
            </View>
            <View style={styles.columnContainer}>
              <RohText style={styles.columnTtitle}>Creatives</RohText>
              {event.creatives.map(creative => (
                <View style={styles.elementContainer} key={creative.role}>
                  <RohText style={styles.role}>{creative.role}</RohText>
                  <RohText style={styles.name}>{creative.name}</RohText>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.downContainer}>
          <GoDown text="extras & more" />
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
    opacity: 0,
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
  },
  castCreativesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  columnTtitle: {
    color: 'white',
    fontSize: scaleSize(26),
    textTransform: 'uppercase',
    marginBottom: scaleSize(20),
  },
  elementContainer: {
    marginBottom: scaleSize(32),
  },
  role: {
    fontSize: scaleSize(20),
    color: '#7E91B4',
    textTransform: 'uppercase',
  },
  name: {
    color: 'white',
    fontSize: scaleSize(20),
  },
});

export default Cast;
