import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TVFocusGuideView } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEvent, TEventContainer, TVSSynops } from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import { Colors } from '@themes/Styleguide';
import MultiColumnSynopsisList from '../commonControls/MultiColumnSynopsisList';

type SynopsisProps = {
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

const Synopsis: React.FC<SynopsisProps> = ({
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
  const synopsis: Array<TVSSynops> = event.data.vs_synopsis.filter(
    synops => synops.text.length,
  ).length
    ? event.data.vs_synopsis.filter(synops => synops.text.length)
    : get<TEvent, 'vs_event_details', 'productions', any[]>(
        event.data,
        ['vs_event_details', 'productions'],
        [],
      ).reduce((acc: Array<TVSSynops>, production: any) => {
        if (production.attributes.synopsis) {
          acc.push(
            ...production.attributes.synopsis
              .split('</p>')
              .reduce((result: Array<TVSSynops>, item: string) => {
                result.push({
                  type: 'paragraph',
                  text: item.replace(/(<([^>]+)>)/gi, ''),
                  spans: [],
                });
                return result;
              }, []),
          );
        }
        return acc;
      }, []);

  if (!synopsis.length) {
    return null;
  }
  const blocksOfSynopsis = synopsis.map((synops, i) => ({
    key: i.toString(),
    text: synops.text,
  }));
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
          <RohText style={styles.title}>Synopsis</RohText>
        </View>
        <View style={styles.synopsisContainer}>
          <MultiColumnSynopsisList
            id={nextScreenText}
            setFocusRef={setFocusRef}
            data={blocksOfSynopsis}
            columnWidth={scaleSize(740)}
            columnHeight={scaleSize(770)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  downContainer: {
    height: scaleSize(110),
    top: -scaleSize(110),
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    width: '100%',
    color: Colors.title,
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
  },
  synopsis: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(28),
    lineHeight: scaleSize(38),
  },
  synopsisContainer: {
    //width: scaleSize(740),
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Synopsis;
