import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import VirtualKeyboard, {
  DisplayForVirtualKeyboard,
} from '@components/VirtualKeyboard';
import { Colors } from '@themes/Styleguide';
import SearchResult from '@components/SearchResult';
import {
  NavMenuScreenRedirect,
  TNavMenuScreenRedirectRef,
} from '@components/NavmenuScreenRedirect';

type TSearchScreenProps = {};
const SearchScreen: React.FC<TSearchScreenProps> = ({ route }) => {
  const vkRef = useRef();
  const navMenuScreenRedirectRef = useRef<TNavMenuScreenRedirectRef>(null);
  const keyboardToResultTransitionRef = useRef<TNavMenuScreenRedirectRef>(null);
  return (
    <View style={styles.root}>
      <NavMenuScreenRedirect
        screenName={route.name}
        ref={navMenuScreenRedirectRef}
      />
      <View style={styles.virtualKeyboardContainer}>
        <NavMenuScreenRedirect
          ref={keyboardToResultTransitionRef}
          screenName="serchress"
        />
        <View style={styles.virtualKeyboardMainContent}>
          <View style={styles.screenTitleContainer}>
            <RohText style={styles.screenTitleText}>SEARCH</RohText>
          </View>
          <View style={styles.searchTextDisplayContainer}>
            <DisplayForVirtualKeyboard ref={vkRef} />
          </View>
          <VirtualKeyboard
            ref={vkRef}
            onMountForNavMenuTransition={(key, touchableRef) => {
              navMenuScreenRedirectRef.current?.setDefaultRedirectFromNavMenu?.(
                key,
                touchableRef,
              );
            }}
            onMountToSearchKeybordTransition={(key, touchableRef) => {;
              keyboardToResultTransitionRef.current?.setDefaultRedirectToNavMenu?.(
                key,
                touchableRef,
              );
            }}
          />
        </View>
      </View>
      <View style={styles.resultsContainer}>
        <SearchResult
          onMountToSearchResultTransition={(key, touchableRef) => {
            console.log(
              'rerrer',
              keyboardToResultTransitionRef.current
                ?.setDefaultRedirectFromNavMenu,
            );
            keyboardToResultTransitionRef.current?.setDefaultRedirectFromNavMenu?.(
              key,
              touchableRef,
            );
          }}
          onUnMountToSearchResultTransition={key => {
            keyboardToResultTransitionRef.current?.removeDefaultRedirectFromNavMenu?.(
              key,
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    height: Dimensions.get('window').height,
  },
  virtualKeyboardContainer: {
    width: scaleSize(495),
    height: '100%',
    marginLeft: scaleSize(160),
    flexDirection: 'row-reverse',
  },
  virtualKeyboardMainContent: {
    flex: 1,
  },
  searchTextDisplayContainer: {
    marginBottom: scaleSize(30),
  },
  screenTitleContainer: {
    width: '100%',
    height: scaleSize(315),
    paddingBottom: scaleSize(59),
    justifyContent: 'flex-end',
  },
  screenTitleText: {
    fontSize: scaleSize(54),
    lineHeight: scaleSize(67),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
  resultsContainer: {
    flex: 1,
  },
});

export default SearchScreen;
