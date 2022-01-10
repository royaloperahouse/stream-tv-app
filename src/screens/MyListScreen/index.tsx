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
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';
import { navMenuManager } from '@components/NavMenu';

type TMyListScreenProps = {};
const MyListScreen: React.FC<TMyListScreenProps> = () => {
  const myList = useMyList();
  const data = useSelector(digitalEventsForMyListScreenSelector(myList));
  const isFocused = useIsFocused();
  const route = useRoute<RouteProp<any, string>>();
  const itemRef = useRef(null);
  useLayoutEffect(() => {
    if (isFocused && route?.params?.fromEventDetails && !data.length) {
      navMenuManager.setNavMenuAccessible();
      navMenuManager.showNavMenu();
      navMenuManager.setNavMenuFocus();
    }
  }, [isFocused, route, data.length]);

  return (
    <View style={styles.root}>
      <RohText style={styles.pageTitle}>{myListTitle}</RohText>
      {data.length ? (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={countOfItemsPeerRail}
          renderItem={({ item, index }) => (
            <DigitalEventItem
              ref={itemRef}
              screenNameFrom={route.name}
              event={item}
              canMoveUp={index >= countOfItemsPeerRail}
              canMoveRight={
                (index + 1) % countOfItemsPeerRail !== 0 &&
                index !== data.length - 1
              }
            />
          )}
        />
      ) : (
        <View style={styles.emptyListContainer}>
          <RohText style={styles.emptyListText} bold>
            {myListTitle + ' is Empty'}
          </RohText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, marginTop: scaleSize(189) },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(48),
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
