import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { EventModel } from '@services/types/models';
import RohText from '@components/RohText';

type Props = {
  event: EventModel;
};

const Preview: React.FC<Props> = ({ event }) => {
  return (
    <View style={styles.previewContainer}>
      <View style={styles.descriptionContainer}>
        <RohText style={styles.pageTitle}>{event.type}</RohText>
        <RohText style={styles.title}>{event.title}</RohText>
        <RohText style={styles.ellipsis}>{event.captionText}</RohText>
        <RohText style={styles.description}>{event.shortDescription}</RohText>
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
  previewContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  descriptionContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: scaleSize(141),
    marginRight: scaleSize(130),
    maxWidth: scaleSize(615),
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
  previewImage: {
    width: scaleSize(975),
    height: scaleSize(600),
  },
});

export default Preview;
