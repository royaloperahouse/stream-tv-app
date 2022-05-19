import React, { useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  startFullSubscriptionLoop,
  endFullSubscriptionLoop,
} from '@services/store/auth/Slices';
import { digitalEventsForHomePageSelector } from '@services/store/events/Selectors';
import {
  DigitalEventItem,
  Preview,
  DigitalEventSectionHeader,
  RailSections,
} from '@components/EventListComponents';
import { scaleSize } from '@utils/scaleSize';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';
import { useMyList } from '@hooks/useMyList';
import { useContinueWatchingList } from '@hooks/useContinueWatchingList';
import { continueWatchingRailTitle } from '@configs/bitMovinPlayerConfig';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { navMenuManager } from '@components/NavMenu';
import {
  NavMenuScreenRedirect,
  TNavMenuScreenRedirectRef,
} from '@components/NavmenuScreenRedirect';

type THomePageScreenProps = {};
const HomePageScreen: React.FC<THomePageScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const { data: myList, ejected: myListEjected } = useMyList();
  const { data: continueWatchingList, ejected: continueWatchingListEjected } =
    useContinueWatchingList();
  const { data, eventsLoaded } = useSelector(
    digitalEventsForHomePageSelector(myList, continueWatchingList),
  );
  const previewRef = useRef(null);
  const isFocused = useIsFocused();
  const navMenuScreenRedirectRef = useRef<TNavMenuScreenRedirectRef>(null);
  useLayoutEffect(() => {
    if (
      isFocused &&
      myListEjected &&
      continueWatchingListEjected &&
      eventsLoaded
    ) {
      if (!data.length) {
        navMenuManager.setNavMenuAccessible();
        navMenuManager.showNavMenu();
        navMenuManager.setNavMenuFocus();
      }
    }
  }, [
    isFocused,
    route,
    data.length,
    navigation,
    continueWatchingListEjected,
    myListEjected,
    eventsLoaded,
  ]);
  useEffect(() => {
    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        dispatch(startFullSubscriptionLoop());
      }
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        dispatch(endFullSubscriptionLoop());
      }
      appState.current = nextAppState;
    };
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [dispatch]);

  useLayoutEffect(() => {
    if (
      typeof previewRef.current?.setDigitalEvent === 'function' &&
      data.length
    ) {
      previewRef.current?.setDigitalEvent(data[0]?.data[0]);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      dispatch(startFullSubscriptionLoop());
      return () => {
        dispatch(endFullSubscriptionLoop());
      };
    }, []),
  );

  if (!data.length || !continueWatchingListEjected || !myListEjected) {
    return null;
  }

  const hasTVPreferredFocus = (
    isFirstRail: boolean,
    index: number,
    sectionIndex: number,
  ) => {
    return route.params === undefined
      ? isFirstRail && index === 0
      : route.params.fromEventDetails &&
          sectionIndex === route.params.sectionIndex &&
          index === 0;
  };

  return (
    <View style={styles.root}>
      <NavMenuScreenRedirect
        screenName={route.name}
        ref={navMenuScreenRedirectRef}
      />
      <View>
        <Preview ref={previewRef} />
        <View>
          <RailSections
            containerStyle={styles.railContainerStyle}
            headerContainerStyle={styles.railHeaderContainerStyle}
            sectionIndex={route?.params?.sectionIndex || 0}
            railStyle={styles.railStyle}
            sections={data}
            sectionKeyExtractor={item => item.sectionIndex?.toString()}
            renderHeader={section => (
              <DigitalEventSectionHeader>
                {section.title}
              </DigitalEventSectionHeader>
            )}
            renderItem={({
              item,
              section,
              index,
              scrollToRail,
              isFirstRail,
              isLastRail,
              sectionIndex,
              setRailItemRefCb,
              removeRailItemRefCb,
              hasEndlessScroll,
            }) => (
              <DigitalEventItem
                event={item}
                ref={previewRef}
                screenNameFrom={route.name}
                hasTVPreferredFocus={hasTVPreferredFocus(
                  isFirstRail,
                  index,
                  sectionIndex,
                )}
                canMoveRight={index !== section.data.length - 1}
                onFocus={(cp: React.Component<any, any, any>) => {
                  scrollToRail();
                  navMenuScreenRedirectRef.current?.setRedirectFromNavMenu?.(
                    cp,
                  );
                }}
                continueWatching={section.title === continueWatchingRailTitle}
                eventGroupTitle={section.title}
                sectionIndex={sectionIndex}
                lastItem={index === section.data.length - 1}
                setRailItemRefCb={setRailItemRefCb}
                removeRailItemRefCb={removeRailItemRefCb}
                canMoveDown={(isLastRail && hasEndlessScroll) || !isLastRail}
                canMoveUp={!isFirstRail}
                setFirstItemFocusable={
                  index === 0
                    ? navMenuScreenRedirectRef.current
                        ?.setDefaultRedirectFromNavMenu
                    : undefined
                }
                removeFirstItemFocusable={
                  index === 0
                    ? navMenuScreenRedirectRef.current
                        ?.removeDefaultRedirectFromNavMenu
                    : undefined
                }
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width:
      Dimensions.get('window').width -
      (widthWithOutFocus + marginRightWithOutFocus + marginLeftStop),
    height: Dimensions.get('window').height,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  navMenuContainerSeporator: {},
  railContainerStyle: {
    top: 0,
    height: Dimensions.get('window').height - scaleSize(600),
    width:
      Dimensions.get('window').width -
      (widthWithOutFocus + marginRightWithOutFocus + marginLeftStop),
  },
  railHeaderContainerStyle: {},
  railStyle: {
    paddingTop: scaleSize(30),
  },
});

export default HomePageScreen;
