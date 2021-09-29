import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer } from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { Colors } from '@themes/Styleguide';

type SynopsisProps = {
  event: TEventContainer;
  nextScreenText: string;
};

const Synopsis: React.FC<SynopsisProps> = ({ event, nextScreenText }) => {
  const synopsis = get(event.data, ['vs_event_details', 'productions'], []).map(
    production => (
      <RohText style={styles.synopsis} key={production.id}>
        {production.attributes.synopsis.replace(/(<([^>]+)>)/gi, '')}
      </RohText>
    ),
  );
  return (
    <TouchableHighlightWrapper canMoveDown={false} canMoveRight={false}>
      <View style={styles.generalContainer}>
        <View style={styles.wrapper}>
          <RohText style={styles.title}>Synopsis</RohText>
          <View style={styles.synopsisContainer}>{synopsis}</View>
        </View>
        <View style={styles.downContainer}>
          <GoDown text={nextScreenText} />
        </View>
      </View>
    </TouchableHighlightWrapper>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    paddingRight: scaleSize(200),
  },
  wrapper: {
    paddingTop: scaleSize(110),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downContainer: {
    flexDirection: 'row',
    height: scaleSize(50),
    paddingBottom: scaleSize(60),
  },
  title: {
    flex: 1,
    color: Colors.defaultTextColor,
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
    letterSpacing: scaleSize(1),
    lineHeight: scaleSize(84),
  },
  synopsis: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(28),
    lineHeight: scaleSize(38),
  },
  synopsisContainer: {
    height: '100%',
    width: scaleSize(740),
  },
});

export default Synopsis;
