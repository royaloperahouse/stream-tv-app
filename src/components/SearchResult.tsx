import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { digitalEventDetailsSearchSelector } from '@services/store/events/Selectors';
import {
  setFullSearchQuery,
  saveSearchResultQuery,
} from '@services/store/events/Slices';
import RohText from './RohText';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from './TouchableHighlightWrapper';
import FastImage from 'react-native-fast-image';
import get from 'lodash.get';
import { scaleSize } from '@utils/scaleSize';
import { Colors } from '@themes/Styleguide';
import { getPrevSearchList } from '@services/previousSearch';
import {
  useNavigation,
  CommonActions,
  useRoute,
  useIsFocused,
} from '@react-navigation/core';
import { additionalRoutesWithoutNavMenuNavigation } from '@navigations/routes';
import { TEventContainer } from '@services/types/models';
import { navMenuManager } from '@components/NavMenu';
import { TNavMenuScreenRedirectRef } from '@components/NavmenuScreenRedirect';
import { useFocusEffect } from '@react-navigation/native';

type TSearchResultProps = {
  onMountToSearchResultTransition?: TNavMenuScreenRedirectRef['setDefaultRedirectToNavMenu'];
  onUnMountToSearchResultTransition?: TNavMenuScreenRedirectRef['removeDefaultRedirectToNavMenu'];
};
const SearchResult: React.FC<TSearchResultProps> = ({
  onMountToSearchResultTransition,
  onUnMountToSearchResultTransition,
}) => {
  const route = useRoute();
  const resultListRef = useRef(null);
  const focused = useIsFocused();
  const digitalEventDetails = useSelector<Partial<any>, Array<TEventContainer>>(
    digitalEventDetailsSearchSelector,
  );
  useLayoutEffect(() => {
    if (
      (focused && digitalEventDetails.length,
      route.params?.fromEventDetails && resultListRef.current)
    ) {
      resultListRef.current.scrollToIndex({
        animated: false,
        index:
          route.params.sectionIndex < digitalEventDetails.length
            ? route.params.sectionIndex
            : 0,
      });
    }
  }, [focused, digitalEventDetails.length, route]);
  if (!digitalEventDetails.length) {
    return (
      <PreviousSearchList
        onMountToSearchResultTransition={onMountToSearchResultTransition}
        onUnMountToSearchResultTransition={onUnMountToSearchResultTransition}
      />
    );
  }
  return (
    <FlatList
      ref={resultListRef}
      style={styles.searchItemListContainer}
      data={digitalEventDetails}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onScrollToIndexFailed={info => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
          if (
            !resultListRef.current ||
            !resultListRef.current ||
            info.index === undefined
          ) {
            return;
          }
          resultListRef.current.scrollToIndex({
            animated: false,
            index: info.index,
          });
        });
      }}
      ListHeaderComponent={<ResultHraderComponent headerText="results" />}
      initialNumToRender={0}
      renderItem={({ item, index }) => (
        <SearchItemComponent
          item={item}
          canMoveUp={index !== 0}
          canMoveDown={index !== digitalEventDetails.length - 1}
          screenNameFrom={route.name}
          sectionIndex={index}
          hasTVPreferredFocus={route?.params?.sectionIndex === index}
          onMountToSearchResultTransition={
            index === 0 ? onMountToSearchResultTransition : undefined
          }
          onUnMountToSearchResultTransition={
            index === 0 ? onUnMountToSearchResultTransition : undefined
          }
        />
      )}
    />
  );
};
export default SearchResult;

type TSearchItemComponentProps = {
  item: TEventContainer;
  canMoveUp: boolean;
  screenNameFrom: string;
  sectionIndex: number;
  canMoveDown: boolean;
  hasTVPreferredFocus: boolean;
  onMountToSearchResultTransition?: TSearchResultProps['onMountToSearchResultTransition'];
  onUnMountToSearchResultTransition?: TSearchResultProps['onUnMountToSearchResultTransition'];
};

export const SearchItemComponent: React.FC<TSearchItemComponentProps> = ({
  item,
  canMoveUp,
  screenNameFrom,
  sectionIndex,
  canMoveDown,
  hasTVPreferredFocus,
  onMountToSearchResultTransition,
  onUnMountToSearchResultTransition,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [isFocused, setIsFocused] = useState(false);
  const btnRef = useRef<TTouchableHighlightWrapperRef>(null);
  const touchableHandler = () => {
    navMenuManager.hideNavMenu();
    navigation.dispatch(
      CommonActions.navigate({
        name: additionalRoutesWithoutNavMenuNavigation.eventDetails
          .navMenuScreenName,
        params: {
          fromEventDetails: false,
          event: item,
          screenNameFrom,
          sectionIndex,
        },
        key: additionalRoutesWithoutNavMenuNavigation.eventDetails
          .navMenuScreenName,
      }),
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
  );
  const toggleFocus = () => setIsFocused(prevState => !prevState);
  const focusHandler = () => {
    dispatch(saveSearchResultQuery());
    toggleFocus();
    if (route?.params?.fromEventDetails) {
      navigation.setParams({
        ...route.params,
        fromEventDetails: false,
      });
    }
    navMenuManager.setNavMenuAccessible();
  };
  useFocusEffect(
    useCallback(() => {
      if (
        typeof onMountToSearchResultTransition === 'function' &&
        btnRef.current?.getRef?.().current
      ) {
        onMountToSearchResultTransition(
          'mvFromKeyboard',
          btnRef.current.getRef().current,
        );
      }
    }, [onMountToSearchResultTransition]),
  );
  return (
    <View style={styles.itemContainer}>
      <TouchableHighlightWrapper
        ref={btnRef}
        underlayColor={Colors.defaultBlue}
        onPress={touchableHandler}
        onBlur={toggleFocus}
        onFocus={focusHandler}
        hasTVPreferredFocus={hasTVPreferredFocus}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        canMoveRight={false}
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

type TPreviousSearchListProps = {
  onMountToSearchResultTransition?: TSearchResultProps['onMountToSearchResultTransition'];
  onUnMountToSearchResultTransition?: TSearchResultProps['onUnMountToSearchResultTransition'];
};

const PreviousSearchList: React.FC<TPreviousSearchListProps> = ({
  onMountToSearchResultTransition,
  onUnMountToSearchResultTransition,
}) => {
  const isMounted = useRef<boolean>(false);
  const [previousSearchesList, setPreviousSearchesList] =
    useState<Array<string>>();

  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
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
        <PreviousSearchListItemComponent
          text={item}
          canMoveUp={index !== 0}
          canMoveDown={index !== previousSearchesList.length - 1}
          onMountToSearchResultTransition={
            index === 0 ? onMountToSearchResultTransition : undefined
          }
          onUnMountToSearchResultTransition={
            index === 0 ? onUnMountToSearchResultTransition : undefined
          }
        />
      )}
    />
  );
};

type TPreviousSearchListItemComponentProps = {
  text: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMountToSearchResultTransition?: TSearchResultProps['onMountToSearchResultTransition'];
  onUnMountToSearchResultTransition?: TSearchResultProps['onUnMountToSearchResultTransition'];
};
const PreviousSearchListItemComponent: React.FC<
  TPreviousSearchListItemComponentProps
> = ({
  text,
  canMoveUp,
  canMoveDown,
  onMountToSearchResultTransition,
  onUnMountToSearchResultTransition,
}) => {
  const dispatch = useDispatch();
  const btnRef = useRef<TTouchableHighlightWrapperRef>(null);
  const navigation = useNavigation();
  const onPressHandler = () => {
    navMenuManager.setNavMenuNotAccessible();
    navigation.setParams({ sectionIndex: 0 });
    dispatch(setFullSearchQuery({ searchQuery: text }));
  };
  useFocusEffect(
    useCallback(() => {
      if (
        typeof onMountToSearchResultTransition === 'function' &&
        typeof btnRef.current?.getRef === 'function'
      ) {
        onMountToSearchResultTransition(
          'mvFromKeyboard',
          btnRef.current.getRef().current,
        );
      }
    }, [onMountToSearchResultTransition]),
  );
  return (
    <View style={styles.searchesResultItemContainer}>
      <View>
        <TouchableHighlightWrapper
          ref={btnRef}
          underlayColor={Colors.defaultBlue}
          onPress={onPressHandler}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          canMoveRight={false}
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
