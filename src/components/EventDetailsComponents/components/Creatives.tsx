import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import {
  TEventContainer,
  TVSEventDetailsCreative,
} from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';

type CreativesProps = {
  event: TEventContainer;
  nextScreenText: string;
  scrollToMe: () => void;
};

const Creatives: React.FC<CreativesProps> = ({
  event,
  nextScreenText,
  scrollToMe,
}) => {
  const creativesList: Array<TVSEventDetailsCreative> = get(
    event.data,
    ['vs_event_details', 'creatives'],
    [],
  );
  const listOfEvalableCreatives = creativesList.reduce<{
    [key: string]: string;
  }>((acc, cast) => {
    const role = get(cast, ['attributes', 'role'], '');
    const name = get(cast, ['attributes', 'name'], '');
    if (!name) {
      return acc;
    }
    if (role && role in acc) {
      acc[role] += `, ${name}`;
    } else {
      acc[role] = name;
    }
    return acc;
  }, {});
  return (
    <TouchableHighlightWrapper>
      <View style={styles.generalContainer}>
        <View style={styles.wrapper}>
          <RohText style={styles.title}>Creatives</RohText>
          <View style={styles.castCreativesContainer}>
            <View style={styles.columnContainer}>
              <RohText style={styles.columnTtitle}>Creatives</RohText>
              <ScrollView>
                {Object.entries(listOfEvalableCreatives).map(([role, name]) => (
                  <View style={styles.elementContainer} key={role}>
                    <RohText style={styles.role}>{role}</RohText>
                    <RohText style={styles.name}>{name}</RohText>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={styles.downContainer}>
          <GoDown text={nextScreenText} scrollToMe={scrollToMe} />
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
  castCreativesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnContainer: {
    flex: 1,
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

export default Creatives;
