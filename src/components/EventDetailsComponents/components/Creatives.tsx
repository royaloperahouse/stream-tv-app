import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, TVFocusGuideView } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import {
  TEventContainer,
  TDieseActitvityCreatives,
} from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import MultiColumnRoleNameList from '../commonControls/MultiColumnRoleNameList';
import { Colors } from '@themes/Styleguide';

type CreativesProps = {
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

const Creatives: React.FC<CreativesProps> = ({
  event,
  nextScreenText,
  index,
  setRefToMovingUp,
  getPrevRefToMovingUp,
}) => {
  const creativesList: Array<TDieseActitvityCreatives> = get(
    event.data,
    ['diese_activity', 'creatives'],
    [],
  );
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

  const listOfEvalableCreatives = creativesList.reduce<{
    [key: string]: string;
  }>((acc, creative) => {
    const role = creative.role_title;
    const name =
      (creative.contact_firstName ? creative.contact_firstName + ' ' : '') +
        creative.contact_lastName || '';
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
  const data: Array<{ role: string; name: string }> = Object.entries(
    listOfEvalableCreatives,
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
          <RohText style={styles.title}>Creatives</RohText>
        </View>
        <View style={styles.creativesContainer}>
          <MultiColumnRoleNameList
            id={nextScreenText}
            data={data}
            setFocusRef={setFocusRef}
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
  wrapper: {
    flexDirection: 'row',
    height: Dimensions.get('window').height,
  },
  navigationToDownContainer: {
    width: '100%',
    height: 2,
  },
  navigationToUpContainer: {
    width: '100%',
    height: 2,
  },
  downContainer: {
    height: scaleSize(110),
    top: -scaleSize(110),
    left: 0,
    right: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  title: {
    width: '100%',
    color: Colors.title,
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
  },
  creativesContainer: {
    width: scaleSize(945),
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Creatives;
