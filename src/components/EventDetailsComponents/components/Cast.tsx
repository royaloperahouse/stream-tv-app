import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer, TVSEventDetailsCast } from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import MultiColumnRoleNameList from '../commonControls/MultiColumnRoleNameList';
import { Colors } from '@themes/Styleguide';

type CastProps = {
  event: TEventContainer;
  nextScreenText: string;
};

const Cast: React.FC<CastProps> = ({ event, nextScreenText }) => {
  const castList: Array<TVSEventDetailsCast> = get(
    event.data,
    ['vs_event_details', 'cast'],
    [],
  );
  const listOfEvalableCasts = castList.reduce<{ [key: string]: string }>(
    (acc, cast) => {
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
    },
    {},
  );
  const data: Array<{ role: string; name: string }> = Object.entries(
    listOfEvalableCasts,
  ).map(([role, name]) => ({ role, name }));

  /**
  for testing multi-columns only.
  will be useful for showing how it looks if we will have the count of items more than for three columns view
  need to not forget to delete it in the future
   */
  for (let i = 0; i < 40; i++) {
    if (!data.length) {
      break;
    }
    data.push({
      role: data[0].role + '-' + i,
      name: data[0].name,
    });
  }
  /** */
  return (
    <View style={styles.generalContainer}>
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <RohText style={styles.title}>Cast</RohText>
        </View>
        <View style={styles.castsContainer}>
          <MultiColumnRoleNameList
            data={data}
            columnHeight={scaleSize(770)}
            columnWidth={scaleSize(387)}
          />
        </View>
      </View>
      <View style={styles.downContainer}>
        <GoDown text={nextScreenText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    paddingTop: scaleSize(110),
    paddingRight: scaleSize(200),
  },
  wrapper: {
    height: Dimensions.get('window').height - scaleSize(220),
    flexDirection: 'row',
  },
  downContainer: {
    flexDirection: 'row',
    height: scaleSize(110),
    paddingBottom: scaleSize(60),
  },
  title: {
    width: '100%',
    color: Colors.title,
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  castsContainer: {
    width: scaleSize(945),
  },
});

export default Cast;
