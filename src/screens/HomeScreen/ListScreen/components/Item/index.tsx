import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { EventModel } from '@services/types/models';
import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import { useRef } from 'react';
import { Colors } from '@themes/Styleguide';
type Props = {
  event: EventModel;
  selectEvent: (event: EventModel) => void;
  goToEvent: (event: EventModel) => void;
  canMoveUp?: boolean;
  hasTVPreferredFocus?: boolean;
};

const Item: React.FC<Props> = ({
  event,
  selectEvent,
  goToEvent,
  canMoveUp,
  hasTVPreferredFocus,
}) => {
  return (
    <View style={styles.container}>
      <TouchableHighlightWrapper
        underlayColor={Colors.defaultBlue}
        hasTVPreferredFocus={hasTVPreferredFocus}
        canMoveUp={canMoveUp}
        styleFocused={styles.imageContainerActive}
        style={styles.imageContainer}
        onFocus={() => {
          selectEvent(event);
        }}
        onPress={() => goToEvent(event)}>
        <View>
          <Image style={styles.image} source={{ uri: event.previewImage }} />
        </View>
      </TouchableHighlightWrapper>
      <RohText style={styles.title}>{event.title}</RohText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: scaleSize(377),
    height: scaleSize(262),
  },
  title: {
    color: 'white',
    fontSize: scaleSize(22),
    marginLeft: scaleSize(10),
    textTransform: 'uppercase',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(377),
    height: scaleSize(220),
  },
  imageContainerActive: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(377),
    height: scaleSize(220),
  },
  image: {
    width: scaleSize(357),
    height: scaleSize(200),
  },
});

export default Item;
