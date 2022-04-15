import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
  setScreenAvailabilety: (screenName: string, availabilety?: boolean) => void;
  screenName: string;
};

const Synopsis: React.FC<SynopsisProps> = ({
  event,
  nextScreenText,
  screenName,
  setScreenAvailabilety,
}) => {
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

  useLayoutEffect(() => {
    setScreenAvailabilety(screenName, Boolean(synopsis.length));
    return () => {
      setScreenAvailabilety(screenName);
    };
  }, [synopsis.length, screenName, setScreenAvailabilety]);

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
      </View>
      <View style={styles.wrapper}>
        <RohText style={styles.title}>Synopsis</RohText>
        <View style={styles.synopsisContainer}>
          <MultiColumnSynopsisList
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
    paddingRight: scaleSize(200),
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downContainer: {
    flexDirection: 'row',
    height: scaleSize(50),
    paddingBottom: scaleSize(60),
    top: -scaleSize(85),
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
    width: scaleSize(740),
  },
});

export default Synopsis;
