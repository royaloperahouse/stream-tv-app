import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import { View, FlatList, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import keyboardDataEng from './components/translations/eng.json';
import keyboardDataNumbers from './components/numbers.json';
import Button from './components/button';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { searchQuerySelector } from '@services/store/events/Selectors';
import {
  clearSearchQuery,
  setSearchQuery,
} from '@services/store/events/Slices';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TNavMenuScreenRedirectRef } from '@components/NavmenuScreenRedirect';
import { useFocusEffect } from '@react-navigation/native';
import { TTouchableHighlightWrapperRef } from '@components/TouchableHighlightWrapper';

const keyboardDataLocale: TKeyboardAdditionalLocales = [keyboardDataEng];

type TKeyboardAdditionalLocales = Array<{
  langSwitchButton: {
    text: string;
  };
  switchSpecButton: {
    text: string;
  };
  letters: Array<{ text: string }>;
}>;

type TVirtualKeyboardProps = {
  rows?: number;
  cols?: number;
  cellWidth?: number;
  cellHeight?: number;
  onMountForNavMenuTransition: TNavMenuScreenRedirectRef['setDefaultRedirectFromNavMenu'];
  onMountToSearchKeybordTransition: TNavMenuScreenRedirectRef['setDefaultRedirectToNavMenu'];
};
const VirtualKeyboard = forwardRef<any, TVirtualKeyboardProps>(
  (
    {
      rows = 6,
      cols = 6,
      cellWidth = scaleSize(81),
      cellHeight = scaleSize(81),
      onMountForNavMenuTransition,
      onMountToSearchKeybordTransition,
    },
    ref,
  ) => {
    const spaceButtonRef = useRef<TTouchableHighlightWrapperRef>(null);
    const lastButtonInFirstRowRef = useRef<TTouchableHighlightWrapperRef>(null);
    const addLetterToSearch = (text: string): void => {
      ref?.current?.addLetterToSearch?.(text);
    };
    const addSpaceToSearch = (): void => {
      ref?.current?.addSpaceToSearch?.();
    };
    const removeLetterFromSearch = (): void => {
      ref?.current?.removeLetterFromSearch?.();
    };
    const clearLettersFromSearch = (): void => {
      ref?.current?.clearLettersFromSearch?.();
    };
    const keyboardData = [
      ...keyboardDataLocale[0].letters,
      ...keyboardDataNumbers,
    ];

    useFocusEffect(
      useCallback(() => {
        if (
          typeof onMountForNavMenuTransition === 'function' &&
          spaceButtonRef.current?.getRef?.().current
        ) {
          onMountForNavMenuTransition(
            'spaceBtn',
            spaceButtonRef.current.getRef().current,
          );
        }
        if (
          typeof onMountToSearchKeybordTransition === 'function' &&
          typeof lastButtonInFirstRowRef.current?.getRef === 'function'
        ) {
          onMountToSearchKeybordTransition(
            'clearBtn',
            lastButtonInFirstRowRef.current.getRef().current,
          );
        }
      }, [onMountForNavMenuTransition, onMountToSearchKeybordTransition]),
    );

    return (
      <View style={{ width: cols * cellWidth }}>
        <View style={styles.supportButtonsContainer}>
          <Button
            ref={spaceButtonRef}
            text="space"
            onPress={addSpaceToSearch}
            style={{
              height: cellHeight,
              width: cellWidth * (keyboardDataLocale.length > 1 ? 1.5 : 2),
            }}
            canMoveUp={false}
            textStyle={[dStyle.text, dStyle.textButton]}
          />
          <Button
            text="delete"
            onPress={removeLetterFromSearch}
            style={{
              height: cellHeight,
              width: cellWidth * (keyboardDataLocale.length > 1 ? 1.5 : 2),
            }}
            canMoveUp={false}
            textStyle={[dStyle.text, dStyle.textButton]}
          />
          <Button
            text="clear"
            onPress={clearLettersFromSearch}
            style={{
              height: cellHeight,
              width: cellWidth * (keyboardDataLocale.length > 1 ? 1.5 : 2),
            }}
            canMoveUp={false}
            textStyle={[dStyle.text, dStyle.textButton]}
          />
        </View>
        <FlatList
          style={{
            height: rows * cellHeight,
          }}
          data={keyboardData}
          keyExtractor={({ text }) => text}
          numColumns={cols}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Button
              ref={index < cols ? lastButtonInFirstRowRef : undefined}
              text={item.text}
              canMoveDown={index <= cols * (rows - 1)}
              onPress={addLetterToSearch}
              style={{ width: cellWidth, height: cellHeight }}
            />
          )}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  supportButtonsContainer: {
    flexDirection: 'row',
  },
  specSymbolsLabelText: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(28),
    letterSpacing: scaleSize(1),
  },
});

export default VirtualKeyboard;

type TDisplayForVirtualKeyboardProps = {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const DisplayForVirtualKeyboard = forwardRef<
  any,
  TDisplayForVirtualKeyboardProps
>((props, ref) => {
  const { containerStyle = {}, textStyle = {} } = props;
  const searchText = useSelector(searchQuerySelector, shallowEqual);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  useImperativeHandle(
    ref,
    () => ({
      addLetterToSearch: (text: string): void => {
        if (route?.params?.sectionIndex !== undefined) {
          navigation.setParams({ sectionIndex: undefined });
        }
        dispatch(setSearchQuery({ searchQuery: text }));
      },
      addSpaceToSearch: (): void => {
        if (route?.params?.sectionIndex !== undefined) {
          navigation.setParams({ sectionIndex: undefined });
        }
        dispatch(setSearchQuery({ searchQuery: ' ' }));
      },
      removeLetterFromSearch: (): void => {
        if (route?.params?.sectionIndex !== undefined) {
          navigation.setParams({ sectionIndex: undefined });
        }
        dispatch(setSearchQuery({ searchQuery: '' }));
      },
      clearLettersFromSearch: (): void => {
        if (route?.params?.sectionIndex !== undefined) {
          navigation.setParams({ sectionIndex: undefined });
        }
        dispatch(clearSearchQuery());
      },
    }),
    [dispatch, route, navigation],
  );
  return (
    <View style={[dStyle.container, containerStyle]}>
      <RohText style={[dStyle.text, textStyle, dStyle.textDefault]}>
        {searchText.toUpperCase()}
      </RohText>
    </View>
  );
});

const dStyle = StyleSheet.create({
  container: {
    width: scaleSize(486),
    height: scaleSize(80),
    backgroundColor: Colors.searchDisplayBackgroundColor,
  },
  textDefault: {
    width: '100%',
    height: '100%',
    paddingHorizontal: scaleSize(24),
    paddingTop: scaleSize(24),
  },
  text: {
    fontSize: scaleSize(26),
    lineHeight: scaleSize(30),
    letterSpacing: scaleSize(1),
    color: Colors.defaultTextColor,
  },
  textButton: {
    paddingTop: 7,
  },
});
