import React, { forwardRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer } from '@services/types/models';
import RohText from '@components/RohText';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import get from 'lodash.get';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { additionalRoutesWithoutNavMenuNavigation } from '@navigations/routes';
import { navMenuManager } from '@components/NavMenu';
import { Colors } from '@themes/Styleguide';

type DigitalEventItemProps = {
  event: TEventContainer;
  canMoveUp?: boolean;
  hasTVPreferredFocus?: boolean;
  canMoveRight?: boolean;
  continueWatching?: boolean;
  onFocus?: (...[]: any[]) => void;
  screenNameFrom?: string;
  eventGroupTitle?: string;
};

const DigitalEventItem = forwardRef<any, DigitalEventItemProps>(
  (
    {
      event,
      canMoveUp,
      hasTVPreferredFocus,
      canMoveRight = true,
      onFocus,
      continueWatching,
      screenNameFrom = '',
      eventGroupTitle,
    },
    ref: any,
  ) => {
    const navigation = useNavigation();
    const snapshotImageUrl: string = get(
      event.data,
      ['vs_event_image', 'wide_event_image', 'url'],
      '',
    );
    const eventTitle: string =
      get(event.data, ['vs_title', '0', 'text'], '').replace(
        /(<([^>]+)>)/gi,
        '',
      ) ||
      get(event.data, ['vs_event_details', 'title'], '').replace(
        /(<([^>]+)>)/gi,
        '',
      );

    const onPressHandler = () => {
      navMenuManager.hideNavMenu();
      navigation.navigate(
        additionalRoutesWithoutNavMenuNavigation.eventDetails.navMenuScreenName,
        { event, continueWatching, screenNameFrom },
      );
    };
    return (
      <View style={styles.container}>
        <TouchableHighlightWrapper
          underlayColor={Colors.defaultBlue}
          hasTVPreferredFocus={hasTVPreferredFocus}
          canMoveUp={canMoveUp}
          canMoveRight={canMoveRight}
          styleFocused={styles.imageContainerActive}
          style={styles.imageContainer}
          onFocus={() => {
            ref?.current?.setDigitalEvent(event, eventGroupTitle);
            //ref?.current?.setShowContinueWatching(continueWatching)
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
  },
  image: {
    width: scaleSize(357),
    height: scaleSize(200),
    zIndex: 0,
  },
});

export default DigitalEventItem;
