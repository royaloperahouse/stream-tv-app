import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  FlatList,
  LogBox,
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import {
  TEventContainer,
  TVSEventDetailsCast,
  TVSEventDetailsCreative,
} from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import MultiColumnRoleNameList from '../commonControls/MultiColumnRoleNameList';

type CastProps = {
  event: TEventContainer;
  nextScreenText: string;
  scrollToMe: () => void;
};

const Cast: React.FC<CastProps> = ({
  event,
  nextScreenText,
  scrollToMe,
}) => {
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
  let data: Array<{role: string, name: string}> = [];
  Object.entries(listOfEvalableCasts).map(([role, name]) => data.push({ role, name }));
  return (
    <TouchableHighlightWrapper>
      <View style={styles.generalContainer}>
        <View style={styles.wrapper}>
          <RohText style={styles.title}>Cast</RohText>
          <View style={styles.castCreativesContainer}>
            <View style={styles.columnContainer}>
              <MultiColumnRoleNameList numColumns={3} data={data} />
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
});

export default Cast;
