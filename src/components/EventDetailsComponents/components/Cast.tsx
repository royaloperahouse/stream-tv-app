import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer, TDieseActivityCast } from '@services/types/models';
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
  const castList: Array<TDieseActivityCast> =
    get(event.data, ['diese_activity', 'cast']) || [];
  const listOfEvalableCasts = castList.reduce<{ [key: string]: string }>(
    (acc, cast) => {
      const role = cast.role_title;
      const name =
        (cast.contact_firstName ? cast.contact_firstName + ' ' : '') +
          cast.contact_lastName || '';
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
  if (!data.length) {
    return null;
  }
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
