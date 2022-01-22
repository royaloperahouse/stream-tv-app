import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { digitalEventDetailsSearchSelector } from '@services/store/events/Selectors';
import {
  setFullSearchQuery,
  saveSearchResultQuery,
} from '@services/store/events/Slices';
import RohText from './RohText';
import TouchableHighlightWrapper from './TouchableHighlightWrapper';
import FastImage from 'react-native-fast-image';
import get from 'lodash.get';
import { scaleSize } from '@utils/scaleSize';
import { Colors } from '@themes/Styleguide';
import { getPrevSearchList } from '@services/previousSearch';
import { useNavigation } from '@react-navigation/core';
import { additionalRoutesWithoutNavMenuNavigation } from '@navigations/routes';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';
import { TEventContainer } from '@services/types/models';
import { navMenuManager } from '@components/NavMenu';

type TSearchResultProps = {};
const SearchResult: React.FC<TSearchResultProps> = () => {
  const digitalEventDetails = useSelector<Partial<any>, Array<TEventContainer>>(
    digitalEventDetailsSearchSelector,
  );
  if (!digitalEventDetails.length) {
    return <PreviousSearchList />;
  }
  return (
    <FlatList
      style={styles.searchItemListContainer}
      data={digitalEventDetails}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<ResultHraderComponent headerText="results" />}
      initialNumToRender={0}
      renderItem={({ item, index }) => (
        <SearchItemComponent item={item} canMoveUp={index !== 0} />
      )}
    />
  );
};
export default SearchResult;

type TSearchItemComponentProps = {
  item: TEventContainer;
  canMoveUp: boolean;
};

export const SearchItemComponent: React.FC<TSearchItemComponentProps> = ({
  item,
  canMoveUp,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const touchableHandler = () => {
    navMenuManager.hideNavMenu();
    navigation.push(
      additionalRoutesWithoutNavMenuNavigation.eventDetails.navMenuScreenName,
      { event: item },
    );
  };

  const title: string =
    get(item.data, ['vs_title', '0', 'text'], '').replace(
      /(<([^>]+)>)/gi,
      '',
    ) ||
    get(item.data, ['vs_event_details', 'title'], '').replace(
      /(<([^>]+)>)/gi,
      '',
    );

  const description: string = (
    item.data.vs_short_description.reduce((acc, sDescription) => {
      acc += sDescription.text + '\n';
      return acc;
    }, '') || get(item.data, ['vs_event_details', 'shortDescription'], '')
  ).replace(/(<([^>]+)>)/gi, '');

  const imgUrl: string = get(
    item.data,
    ['vs_event_image', 'wide_event_image', 'url'],
    '',
  ).replace(/w=\d+&h=\d+$/i, `w=${scaleSize(358)}&h=${scaleSize(200)}`);
  const toggleFocus = () => setIsFocused(prevState => !prevState);
  const focusHandler = () => {
    dispatch(saveSearchResultQuery());
    toggleFocus();
    navMenuManager.setNavMenuAccessible();
  };
  return (
    <View style={styles.itemContainer}>
      <TouchableHighlightWrapper
        underlayColor={Colors.defaultBlue}
        onPress={touchableHandler}
        onBlur={toggleFocus}
        onFocus={focusHandler}
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

type TResultHeaderComponentProps = {
  headerText: string;
  isPrevSearch?: boolean;
};
const ResultHraderComponent: React.FC<TResultHeaderComponentProps> = ({
  headerText,
  isPrevSearch,
}) => (
  <View
    style={[
      styles.headerContainer,
      isPrevSearch && styles.headerContainerPrevSearch,
    ]}>
    <RohText style={styles.headerText}>{headerText.toUpperCase()}</RohText>
  </View>
);

type TPreviousSearchListProps = {};

const PreviousSearchList: React.FC<TPreviousSearchListProps> = () => {
  const isMounted = useRef<boolean>(false);
  const [previousSearchesList, setPreviousSearchesList] =
    useState<Array<string>>();

  useLayoutEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    getPrevSearchList()
      .then(previousSearchesListData => {
        if (isMounted.current) {
          setPreviousSearchesList(previousSearchesListData?.reverse());
        }
      })
      .catch(console.log);
  }, []);
  if (!Array.isArray(previousSearchesList) || !previousSearchesList.length) {
    return null;
  }
  return (
    <FlatList
      style={styles.searchItemListContainer}
      data={previousSearchesList}
      keyExtractor={item => item}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <ResultHraderComponent headerText="previous searches" isPrevSearch />
      }
      renderItem={({ item, index }) => (
        <PreviousSearchListItemComponent text={item} canMoveUp={index !== 0} />
      )}
    />
  );
};

type TPreviousSearchListItemComponentProps = {
  text: string;
  canMoveUp: boolean;
};
const PreviousSearchListItemComponent: React.FC<
  TPreviousSearchListItemComponentProps
> = ({ text, canMoveUp }) => {
  const dispatch = useDispatch();
  const onPressHandler = () => {
    navMenuManager.setNavMenuNotAccessible();
    dispatch(setFullSearchQuery({ searchQuery: text }));
  };
  return (
    <View style={styles.searchesResultItemContainer}>
      <View>
        <TouchableHighlightWrapper
          underlayColor={Colors.defaultBlue}
          onPress={onPressHandler}
          canMoveUp={canMoveUp}
          style={styles.searchesResultItemWrapperContainer}
          styleFocused={styles.searchesResultItemWrapperActive}>
          <RohText style={styles.searchesResultItemText} numberOfLines={1}>
            {text.toUpperCase()}
          </RohText>
        </TouchableHighlightWrapper>
      </View>
    </View>
  );
};

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
  imageStyle: {
    width: scaleSize(358),
    height: scaleSize(200),
    zIndex: 0,
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
  headerContainerPrevSearch: {
    marginLeft: 0,
  },
  headerText: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.midGrey,
  },
  searchesResultItemContainer: {
    height: scaleSize(80),
    width: '100%',
    flexDirection: 'row',
  },
  searchesResultItemWrapperActive: {
    paddingHorizontal: scaleSize(25),
    opacity: 1,
  },
  searchesResultItemWrapperContainer: {
    height: '100%',
    justifyContent: 'center',
    opacity: 0.7,
  },
  searchesResultItemText: {
    maxWidth: scaleSize(875),
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
});
