import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TVFocusGuideView } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import { useMyList } from '@hooks/useMyList';
import { digitalEventsForMyListScreenSelector } from '@services/store/events/Selectors';
import { useSelector } from 'react-redux';
import { myListTitle, countOfItemsPeerRail } from '@configs/myListConfig';
import { Colors } from '@themes/Styleguide';
import { DigitalEventItem } from '@components/EventListComponents';
import {
  widthWithOutFocus,
  marginRightWithOutFocus,
  marginLeftStop,
} from '@configs/navMenuConfig';

type TMyListScreenProps = {};
const MyListScreen: React.FC<TMyListScreenProps> = () => {
  const myList = useMyList();
  const data = useSelector(digitalEventsForMyListScreenSelector(myList));
  const viewRef = useRef<View>(null);
  console.log('myList', viewRef.current);
  return (
    <TVFocusGuideView 
      style={styles.root} 
      destinations={[viewRef.current]}
    >
      <RohText style={styles.pageTitle}>{myListTitle}</RohText>
      {data.length ? (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={countOfItemsPeerRail}
          renderItem={({ item, index }) => (
            <View ref={viewRef}>
              <DigitalEventItem
                event={item}
                canMoveUp={index >= countOfItemsPeerRail}
                canMoveRight={
                  (index + 1) % countOfItemsPeerRail !== 0 &&
                  index !== data.length - 1
                }
              />
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyListContainer}>
          <RohText style={styles.emptyListText} bold>
            {myListTitle} is Empty
          </RohText>
        </View>
      )}
    </TVFocusGuideView>
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
