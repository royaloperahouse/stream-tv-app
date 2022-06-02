import React, { useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import { useMyList } from '@hooks/useMyList';
import { digitalEventsForMyListScreenSelector } from '@services/store/events/Selectors';
import { useSelector } from 'react-redux';
import { myListTitle, countOfItemsPeerRail } from '@configs/myListConfig';
import { Colors } from '@themes/Styleguide';
import { DigitalEventItem } from '@components/EventListComponents';
import { useIsFocused } from '@react-navigation/native';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';
import { navMenuManager } from '@components/NavMenu';
import {
  NavMenuScreenRedirect,
  TNavMenuScreenRedirectRef,
} from '@components/NavmenuScreenRedirect';

type TMyListScreenProps = {};
const MyListScreen: React.FC<TMyListScreenProps> = ({ route }) => {
  const { data: myList, ejected } = useMyList();
  const data = useSelector(digitalEventsForMyListScreenSelector(myList));
  const isFocused = useIsFocused();
  const listRef = useRef(null);
  const itemRef = useRef(null);
  const navMenuScreenRedirectRef = useRef<TNavMenuScreenRedirectRef>(null);
  const selectedIndex =
    route.params?.sectionIndex < data.length
      ? route.params.sectionIndex
      : data.length - 1;
  useLayoutEffect(() => {
    if (isFocused && route?.params?.fromEventDetails && ejected) {
      if (!data.length) {
        navMenuManager.setNavMenuAccessible();
        navMenuManager.showNavMenu();
        navMenuManager.setNavMenuFocus();
      } else {
        listRef.current.scrollToIndex({
          animated: false,
          index: Math.floor(selectedIndex / countOfItemsPeerRail),
        });
      }
    }
  }, [isFocused, route, data.length, ejected, selectedIndex]);

  return (
    <View style={styles.root}>
      <NavMenuScreenRedirect
        screenName={route.name}
        ref={navMenuScreenRedirectRef}
      />
      <View style={styles.contentContainer}>
        <RohText style={styles.pageTitle}>{myListTitle}</RohText>
        {data.length ? (
          <FlatList
            data={data}
            ref={listRef}
            keyExtractor={item => item.id}
            onScrollToIndexFailed={() => {}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            numColumns={countOfItemsPeerRail}
            renderItem={({ item, index }) => (
              <DigitalEventItem
                ref={itemRef}
                screenNameFrom={route.name}
                hasTVPreferredFocus={
                  route.params.fromEventDetails && selectedIndex === index
                }
                event={item}
                canMoveUp={index >= countOfItemsPeerRail}
                canMoveRight={
                  (index + 1) % countOfItemsPeerRail !== 0 &&
                  index !== data.length - 1
                }
                sectionIndex={index}
                setFirstItemFocusable={
                  index === 0 || index % countOfItemsPeerRail === 0
                    ? navMenuScreenRedirectRef.current
                        ?.setDefaultRedirectFromNavMenu
                    : undefined
                }
                removeFirstItemFocusable={
                  index === 0 || index % countOfItemsPeerRail === 0
                    ? navMenuScreenRedirectRef.current
                        ?.removeDefaultRedirectFromNavMenu
                    : undefined
                }
              />
            )}
          />
        ) : (
          <View style={styles.emptyListContainer}>
            <RohText style={styles.emptyListText} bold>
              No items have been added to your list
            </RohText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  contentContainer: { flex: 1, marginTop: scaleSize(189) },
  emptyListContainer: {
    flex: 1,
    marginTop: scaleSize(25),
  },
  emptyListText: {
    fontSize: scaleSize(22),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
  pageTitle: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(48),
    marginBottom: scaleSize(24),
    textTransform: 'uppercase',
  },
  listContainer: {
    width:
      Dimensions.get('window').width -
      (widthWithOutFocus + marginRightWithOutFocus + marginLeftStop),
  },
});

export default MyListScreen;
