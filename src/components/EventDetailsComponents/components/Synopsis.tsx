import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEvent, TEventContainer, TVSSynops } from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import { Colors } from '@themes/Styleguide';
import MultiColumnSynopsisList from '../commonControls/MultiColumnSynopsisList';
const mock = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum aliquet interdum ultrices. Nam bibendum augue mauris, ut dictum neque imperdiet quis.|Maecenas augue risus, accumsan at faucibus nec, elementum ac ex. Aliquam blandit ullamcorper sem. Nunc mattis vitae purus quis venenatis.|Proin velit nisi, luctus et risus nec, vulputate mollis nunc. Suspendisse volutpat condimentum elit, fermentum sagittis arcu malesuada pulvinar. Ut sit amet interdum arcu. Nunc semper condimentum elit eu imperdiet.|Nulla malesuada lorem ut erat lacinia venenatis vitae sed massa. Nullam ornare eleifend est, nec feugiat odio vulputate sed. Morbi congue mi id commodo sodales. Fusce dignissim, lorem ut ultrices vehicula, libero odio venenatis nulla, vel tincidunt diam orci condimentum lectus. Vestibulum faucibus sollicitudin urna, ut pellentesque odio. In pellentesque sagittis mauris, ac suscipit metus sodales mattis.|Suspendisse ac lobortis ipsum, vitae tempor mauris. Nam sodales, elit eget consectetur vehicula, sapien ipsum vulputate justo, eget lacinia tellus turpis at urna. Cras rhoncus urna nec ante elementum dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.|Nunc vehicula augue at quam efficitur consectetur. Vestibulum id ornare dui, id lobortis nunc. Nam at purus sit amet urna porttitor vestibulum non et eros.|Pellentesque auctor tempor nisi, id malesuada dui elementum id. Suspendisse at dolor eget velit elementum fermentum.|Aenean congue venenatis eros, eget molestie arcu euismod sed. Vestibulum nec scelerisque risus. In ac fermentum erat. Proin sapien elit, dignissim vel lobortis vitae, rutrum a dolor. Donec luctus vehicula est sit amet dignissim. Ut blandit est eget urna rutrum bibendum. Aenean pulvinar mi arcu, et finibus nisl volutpat eget.|Curabitur id quam a purus consectetur porta. Vestibulum bibendum congue placerat. Morbi sed justo feugiat, maximus ipsum eu, placerat ante. Suspendisse tempus ex sed rutrum dictum. Phasellus a venenatis purus. Phasellus a eros ac nunc porta ullamcorper id quis augue. Fusce luctus lacus neque, sed suscipit diam lacinia quis. Donec quis tortor ullamcorper, fermentum erat eu, fermentum nisi. Quisque scelerisque vitae felis vel bibendum.|Suspendisse ullamcorper sagittis tincidunt. Etiam sit amet suscipit ex. Nulla consequat fringilla blandit. Praesent lacinia rhoncus dignissim. Vestibulum pellentesque enim sit amet orci commodo cursus.|Nam accumsan elit sit amet felis porta rhoncus. Suspendisse potenti. Fusce malesuada semper massa, eget interdum quam auctor vitae.|Vivamus vel mauris dignissim, vulputate erat quis, pharetra velit. Quisque varius semper nunc, congue facilisis augue lacinia eu. Nulla facilisi. Proin iaculis mi maximus semper pulvinar. Etiam dictum, tortor eu blandit luctus, ipsum augue porta sapien, vel pulvinar ex orci at urna. Duis vitae ligula sit amet velit maximus convallis. Aliquam eu libero non nulla pulvinar rhoncus. Aliquam venenatis malesuada tellus sed scelerisque.Duis dictum aliquet risus. Etiam lacinia neque quis odio tristique sodales at a urna. Suspendisse potenti. Sed congue in ligula quis rutrum.`;
type SynopsisProps = {
  event: TEventContainer;
  nextScreenText: string;
};

const Synopsis: React.FC<SynopsisProps> = ({ event, nextScreenText }) => {
  const synopsis: Array<TVSSynops> = event.data.vs_synopsis.length
    ? event.data.vs_synopsis
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
      <View style={styles.downContainer}>
        <GoDown text={nextScreenText} />
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

/* .map(
  production => (
    <RohText style={styles.synopsis} key={production.id}>
      {production.attributes.synopsis.replace(/(<([^>]+)>)/gi, '')}
    </RohText>
  ),
); */
