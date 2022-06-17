import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, TVFocusGuideView } from 'react-native';
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
  setRefToMovingUp: (
    index: number,
    cp:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number,
  ) => void;
  getPrevRefToMovingUp: (
    index: number,
  ) =>
    | Array<
        | React.Component<any, any, any>
        | React.ComponentClass<any, any>
        | null
        | number
      >
    | undefined;
  index: number;
};

const Cast: React.FC<CastProps> = ({
  event,
  nextScreenText,
  index,
  setRefToMovingUp,
  getPrevRefToMovingUp,
}) => {
  const [listOfFocusRef, setListOfFocusRef] = useState<
    | Array<React.Component<any, any, any> | React.ComponentClass<any, any>>
    | undefined
  >();
  const setFocusRef = useCallback(
    (
      cp:
        | React.Component<any, any, any>
        | React.ComponentClass<any, any>
        | null
        | number,
    ) => {
      setRefToMovingUp(index, cp);
      setListOfFocusRef(
        cp === null || typeof cp === 'number' ? undefined : [cp],
      );
    },
    [setRefToMovingUp, index],
  );
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
      <View style={styles.downContainer}>
        <GoDown text={nextScreenText} />
        <TVFocusGuideView
          style={styles.navigationToDownContainer}
          destinations={listOfFocusRef}
        />
      </View>
      <TVFocusGuideView
        style={styles.navigationToUpContainer}
        destinations={getPrevRefToMovingUp(index)}
      />
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <RohText style={styles.title}>Cast</RohText>
        </View>
        <View style={styles.castsContainer}>
          <MultiColumnRoleNameList
            id={nextScreenText}
            setFocusRef={setFocusRef}
            data={data}
            columnHeight={scaleSize(770)}
            columnWidth={scaleSize(387)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    paddingRight: scaleSize(200),
  },
  navigationToDownContainer: {
    width: '100%',
    height: 2,
  },
  navigationToUpContainer: {
    width: '100%',
    height: 2,
  },
  wrapper: {
    height: Dimensions.get('window').height,
    flexDirection: 'row',
  },
  downContainer: {
    height: scaleSize(110),
    justifyContent: 'center',
    top: -scaleSize(110),
    left: 0,
    right: 0,
    position: 'absolute',
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
    justifyContent: 'center',
  },
});

export default Cast;
