import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer } from '@services/types/models';
import RohText from '@components/RohText';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
import get from 'lodash.get';
import {
  useNavigation,
  CommonActions,
  useRoute,
} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { additionalRoutesWithoutNavMenuNavigation } from '@navigations/routes';
import { navMenuManager } from '@components/NavMenu';
import { Colors } from '@themes/Styleguide';

type DigitalEventItemProps = {
  event: TEventContainer;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  sectionIndex: number;
  hasTVPreferredFocus?: boolean;
  canMoveRight?: boolean;
  continueWatching?: boolean;
  onFocus?: (...[]: any[]) => void;
  screenNameFrom?: string;
  eventGroupTitle?: string;
  selectedItemIndex?: number;
  lastItem?: boolean;
  setRailItemRefCb: (
    eventId: string,
    ref: React.MutableRefObject<TTouchableHighlightWrapperRef | undefined>,
    sectionIdx: number,
  ) => void;
  removeRailItemRefCb: (
    eventId: string,
    ref: React.MutableRefObject<TTouchableHighlightWrapperRef | undefined>,
    sectionIdx: number,
  ) => void;
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
      sectionIndex,
      canMoveDown = true,
      selectedItemIndex,
      lastItem = false,
      setRailItemRefCb = () => {},
      removeRailItemRefCb = () => {},
    },
    ref: any,
  ) => {
    const navigation = useNavigation();
    const touchableRef = useRef<TTouchableHighlightWrapperRef>();
    const route = useRoute();
    const isMounted = useRef(false);
    const [focused, setFocused] = useState(false);
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
      navigation.dispatch(
        CommonActions.reset({
          routes: [
            {
              name: additionalRoutesWithoutNavMenuNavigation.eventDetails
                .navMenuScreenName,
              params: {
                fromEventDetails: false,
                event,
                continueWatching,
                screenNameFrom,
                sectionIndex,
                selectedItemIndex,
              },
            },
          ],
          index: 0,
        }),
      );
    };

    useLayoutEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    useLayoutEffect(() => {
      setRailItemRefCb(event.id, touchableRef, sectionIndex);
      return () => {
        removeRailItemRefCb(event.id, touchableRef, sectionIndex);
      };
    }, []);

    return (
      <TouchableHighlightWrapper
        ref={touchableRef}
        hasTVPreferredFocus={hasTVPreferredFocus}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        canMoveRight={canMoveRight}
        style={[lastItem ? styles.containeForListItem : styles.container]}
        onBlur={() => {
          if (isMounted.current) {
            setFocused(false);
          }
        }}
        onFocus={() => {
          if (isMounted.current) {
            setFocused(true);
          }
          ref?.current?.setDigitalEvent(event, eventGroupTitle);
          navMenuManager.setNavMenuAccessible();
          if (typeof onFocus === 'function') {
            onFocus();
          }
          if (route.params?.fromEventDetails) {
            navigation.setParams({
              ...route.params,
              fromEventDetails: false,
            });
          }
        }}
        onPress={onPressHandler}>
        <View style={styles.container}>
          <View
            style={[
              styles.imageContainer,
              focused ? styles.imageContainerActive : {},
            ]}>
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              style={styles.image}
              source={{ uri: snapshotImageUrl }}
            />
          </View>
          <RohText style={styles.title}>{eventTitle}</RohText>
        </View>
      </TouchableHighlightWrapper>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: scaleSize(377),
    minHeight: scaleSize(262),
  },
  containeForListItem: {
    width: scaleSize(397),
    minHeight: scaleSize(262),
    paddingRight: scaleSize(20),
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
    backgroundColor: Colors.defaultBlue,
  },
  image: {
    width: scaleSize(357),
    height: scaleSize(200),
    zIndex: 0,
  },
});

export default DigitalEventItem;
