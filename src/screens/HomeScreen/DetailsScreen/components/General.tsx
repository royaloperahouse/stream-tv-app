import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';

import { Icons } from '@themes/Styleguide';

import { scaleSize } from '@utils/scaleSize';

import { EventModel } from '@services/types/models';

import RohText from '@components/RohText';

import ExpandableButton from './ExpandableButton';
import GoDown from './GoDown';

type Props = {
  event: EventModel;
  scrollToMe: () => void;
  showPlayer: () => void;
};

const General: React.FC<Props> = ({
  event,
  scrollToMe,
  showPlayer = () => {},
}) => {
  return (
    <View style={styles.generalContainer}>
      <View style={styles.wrapper}>
        <View style={styles.descriptionContainer}>
          <RohText style={styles.title}>{event.title}</RohText>
          <RohText style={styles.ellipsis}>{event.captionText}</RohText>
          <RohText style={styles.description}>{event.shortDescription}</RohText>
          <RohText style={styles.info}>{event.info}</RohText>
          <View style={styles.buttonsContainer}>
            <ExpandableButton
              focusCallback={scrollToMe}
              icon={Icons.watch}
              onPress={showPlayer}
              text="Watch now"
            />
            <ExpandableButton
              focusCallback={scrollToMe}
              icon={Icons.trailer}
              text="Watch trailer"
            />
            <ExpandableButton
              focusCallback={scrollToMe}
              icon={Icons.addToList}
              text="Add to my list"
            />
          </View>
        </View>
        <View style={styles.downContainer}>
          <GoDown text="synopsis and more" />
        </View>
      </View>
      <View style={styles.snapshotContainer}>
        <Image
          style={styles.previewImage}
          source={{ uri: event.previewImage }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  wrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  descriptionContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: scaleSize(230),
    marginRight: scaleSize(130),
    maxWidth: scaleSize(615),
  },
  downContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: scaleSize(50),
    marginBottom: scaleSize(60),
  },
  snapshotContainer: {
    flex: 1,
  },
  pageTitle: {
    color: 'white',
    fontSize: scaleSize(22),
    textTransform: 'uppercase',
  },
  title: {
    color: 'white',
    fontSize: scaleSize(48),
    marginTop: scaleSize(24),
    marginBottom: scaleSize(24),
    textTransform: 'uppercase',
  },
  ellipsis: {
    color: 'white',
    fontSize: scaleSize(22),
    textTransform: 'uppercase',
  },
  description: {
    color: 'white',
    fontSize: scaleSize(22),
    marginTop: scaleSize(12),
  },
  info: {
    color: 'white',
    fontSize: scaleSize(20),
    textTransform: 'uppercase',
    marginTop: scaleSize(24),
  },
  buttonsContainer: {
    flex: 1,
    marginTop: scaleSize(50),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  previewImage: {
    width: scaleSize(975),
    height: Dimensions.get('window').height,
  },
});

export default General;
