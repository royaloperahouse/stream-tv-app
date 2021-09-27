import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer } from '@services/types/models';
import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import get from 'lodash.get';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { additionalRoutesWithoutNavMenuNavigation } from '@navigations/routes';
import { navMenuManager } from '@components/NavMenu';

type DigitalEventItemProps = {
  event: TEventContainer;
  canMoveUp?: boolean;
  hasTVPreferredFocus?: boolean;
  canMoveRight?: boolean;
  onFocus?: (...[]: any[]) => void;
};

const DigitalEventItem = forwardRef<any, DigitalEventItemProps>(
  (
    { event, canMoveUp, hasTVPreferredFocus, canMoveRight = true, onFocus },
    ref: any,
  ) => {
    const navigation = useNavigation();
    const snapshotImageUrl: string = get(
      event.data,
      ['vs_background', '0', 'vs_background_image', 'url'],
      '',
    );
    const eventTitle: string =
      get(event.data, ['vs_event_details', 'title'], '').replace(
        /(<([^>]+)>)/gi,
        '',
      ) ||
      get(event.data, ['vs_title', '0', 'text'], '').replace(
        /(<([^>]+)>)/gi,
        '',
      );
    const onPressHandler = () => {
      navMenuManager.hideNavMenu();
      navigation.navigate(
        additionalRoutesWithoutNavMenuNavigation.eventDetais.navMenuScreenName,
        { event },
      );
    };
    return (
      <View style={styles.container}>
        <TouchableHighlightWrapper
          hasTVPreferredFocus={hasTVPreferredFocus}
          canMoveUp={canMoveUp}
          canMoveRight={canMoveRight}
          styleFocused={styles.imageContainerActive}
          style={styles.imageContainer}
          onFocus={() => {
            ref?.current?.setDigigtalEvent(event);
            navMenuManager.setNavMenuAccessible();
            if (typeof onFocus === 'function') {
              onFocus();
            }
          }}
          onPress={onPressHandler}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={styles.image}
            source={{ uri: snapshotImageUrl }}
          />
        </TouchableHighlightWrapper>
        <RohText style={styles.title}>{eventTitle}</RohText>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: scaleSize(377),
    minHeight: scaleSize(262),
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
    backgroundColor: '#6990ce',
  },
  image: {
    width: scaleSize(357),
    height: scaleSize(200),
  },
});

export default DigitalEventItem;
