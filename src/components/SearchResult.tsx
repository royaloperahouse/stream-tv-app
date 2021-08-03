import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { digitalEventDetailsSearchSelector } from '@services/store/events/Selectors';
import RohText from './RohText';
import TouchableHighlightWrapper from './TouchableHighlightWrapper';
import FastImage from 'react-native-fast-image';
import get from 'lodash.get';
import { scaleSize } from '@utils/scaleSize';
import { Colors } from '@themes/Styleguide';
import { useState } from 'react';

type TSearchResultProps = {};
const SearchResult: React.FC<TSearchResultProps> = () => {
  const digitalEventDetails = useSelector(digitalEventDetailsSearchSelector);
  if (!digitalEventDetails.length) {
    return null;
  }
  const onPress = (id: string) => console.log(id);
  return (
    <FlatList
      style={styles.searchItemListContainer}
      data={digitalEventDetails}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ResultHraderComponent}
      initialNumToRender={0}
      renderItem={({ item, index }) => (
        <SearchItemComponent
          item={item}
          onPress={onPress}
          canMoveUp={index !== 0}
        />
      )}
    />
  );
};
export default SearchResult;

type TSearchItemComponentProps = {
  item: {
    id: string;
    data: any;
    last_publication_date: string;
  };
  canMoveUp: boolean;
  onPress: (id: string) => void;
};

export const SearchItemComponent: React.FC<TSearchItemComponentProps> = ({
  item,
  onPress,
  canMoveUp,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const touchableHandler = () => onPress(item.id);
  const title: string =
    get<string>(item.data, ['vs_event_details', 'title'], '').replace(
      /(<([^>]+)>)/gi,
      '',
    ) ||
    get<string>(item.data, ['vs_title', '0', 'text'], '').replace(
      /(<([^>]+)>)/gi,
      '',
    );
  const description: string = get<string>(
    item.data,
    ['vs_event_details', 'shortDescription'],
    '',
  ).replace(/(<([^>]+)>)/gi, '');
  const imgUrl: string = get<string>(
    item.data,
    ['vs_background', '0', 'vs_background_image', 'url'],
    '',
  );
  const toggleFocus = () => setIsFocused(prevState => !prevState);
  return (
    <View style={styles.itemContainer}>
      <TouchableHighlightWrapper
        onPress={touchableHandler}
        styleFocused={styles.itemImageContainerActive}
        onBlur={toggleFocus}
        onFocus={toggleFocus}
        canMoveUp={canMoveUp}
        style={styles.itemImageContainer}>
        {imgUrl.length ? (
          <FastImage
            style={styles.imageStyle}
            source={{
              uri: imgUrl,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image
            source={require('@assets/default_background.png')}
            style={styles.imageStyle}
            resizeMode="cover"
          />
        )}
      </TouchableHighlightWrapper>
      <View
        style={[
          styles.itemTextDescriptionContainer,
          isFocused && styles.itemTextDescriptionContainerActive,
        ]}>
        {Boolean(title.length) && (
          <RohText
            numberOfLines={2}
            style={[
              styles.textTitle,
              Boolean(description.length) &&
                styles.textTitleWithExistingDescription,
            ]}>
            {title}
          </RohText>
        )}
        {Boolean(description.length) && (
          <RohText style={styles.textDescription} numberOfLines={5}>
            {description}
          </RohText>
        )}
      </View>
    </View>
  );
};

type TResultHeaderComponentProps = {};
const ResultHraderComponent: React.FC<TResultHeaderComponentProps> = () => (
  <View style={styles.headerContainer}>
    <RohText style={styles.headerText}>RESULTS</RohText>
  </View>
);

const styles = StyleSheet.create({
  searchItemListContainer: {
    width: '100%',
    height: '100%',
  },
  itemContainer: {
    width: '100%',
    height: scaleSize(220),
    flexDirection: 'row',
  },
  itemImageContainer: {
    marginRight: scaleSize(20),
    width: scaleSize(376),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageContainerActive: {
    backgroundColor: Colors.defaultBlue,
  },
  imageStyle: {
    width: scaleSize(358),
    height: scaleSize(200),
  },
  itemTextDescriptionContainer: {
    height: '100%',
    justifyContent: 'center',
    width: scaleSize(489),
    opacity: 0.7,
  },
  itemTextDescriptionContainerActive: {
    opacity: 1,
  },
  textTitle: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
  textTitleWithExistingDescription: {
    marginBottom: scaleSize(12),
  },
  textDescription: {
    fontSize: scaleSize(22),
    lineHeight: scaleSize(28),
    color: Colors.defaultTextColor,
  },
  headerContainer: {
    width: '100%',
    height: scaleSize(315),
    marginLeft: scaleSize(18),
    justifyContent: 'flex-end',
    paddingBottom: scaleSize(54),
  },
  headerText: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.midGrey,
  },
});
