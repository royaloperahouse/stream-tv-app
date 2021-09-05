import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, FlatList, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import keyboardDataEng from './components/translations/eng.json';
import keyboardDataRu from './components/translations/ru.json';
import keyboardDataNumbers from './components/numbers.json';
import keyboardDataSpecSymbols from './components/specSymbols.json';
import Button from './components/button';
import { scaleSize } from '@utils/scaleSize';
import RohText from '@components/RohText';
import { Colors } from '@themes/Styleguide';
import Delete from '@assets/svg/virualKeybord/Delete.svg';
import Space from '@assets/svg/virualKeybord/Space.svg';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { searchQuerySelector } from '@services/store/events/Selectors';
import { setSearchQuery } from '@services/store/events/Slices';
import { useLayoutEffect } from 'react';

const keyboardDataLocale: TKeyboardAdditionalLocales = [
  keyboardDataEng,
  keyboardDataRu,
];

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
};
const VirtualKeyboard = forwardRef<any, TVirtualKeyboardProps>(
  (
    {
      rows = 6,
      cols = 6,
      cellWidth = scaleSize(81),
      cellHeight = scaleSize(81),
    },
    ref,
  ) => {
    const [selectedLanguage, setSelectedLanguage] = useState<number>(0);
    const specSymbolsButtonRef = useRef(null);
    const [isSpecSymbols, setIsSpecSymbols] = useState(false);
    const [specSymbolsButtonNode, setSpecSymbolsButtonNode] = useState<
      number | undefined
    >();
    const [keyboardDatalastItemButtonNode, setKeyboardDatalastItemButtonNode] =
      useState<number | undefined>();
    const keyboardDatalastItemButtonRef = useRef();
    const addLetterToSearch = (text: string): void => {
      ref?.current?.addLetterToSearch?.(text);
    };
    const addSpaceToSearch = (): void => {
      ref?.current?.addSpaceToSearch?.();
    };
    const removeLetterFromSearch = (): void => {
      ref?.current?.removeLetterFromSearch?.();
    };
    const switchLanguage = () => {
      if (keyboardDataLocale.length === 1) {
        return;
      }
      if (selectedLanguage !== keyboardDataLocale.length - 1) {
        setSelectedLanguage(prevState => (prevState += 1));
        return;
      }
      setSelectedLanguage(0);
    };
    const keybordTypeSwitch = () => setIsSpecSymbols(prevState => !prevState);
    const keyboardData = isSpecSymbols
      ? keyboardDataSpecSymbols.cases
      : [
          ...keyboardDataLocale[selectedLanguage].letters,
          ...keyboardDataNumbers,
        ];
    const specSymbolsButtonLabel = isSpecSymbols
      ? keyboardDataLocale[selectedLanguage].switchSpecButton.text
      : keyboardDataSpecSymbols.switchSpecButton.text;
    const startIndexOfLastRow: number =
      Math.floor(keyboardData.length / cols) * cols;
    useLayoutEffect(() => {
      setSpecSymbolsButtonNode(specSymbolsButtonRef.current?.getNode());
    }, []);
    useLayoutEffect(() => {
      setKeyboardDatalastItemButtonNode(
        keyboardDatalastItemButtonRef.current?.getNode(),
      );
    }, [isSpecSymbols, selectedLanguage]);
    return (
      <View style={{ width: cols * cellWidth }}>
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
              ref={
                index === keyboardData.length - 1
                  ? keyboardDatalastItemButtonRef
                  : undefined
              }
              text={item.text}
              onPress={addLetterToSearch}
              style={{ width: cellWidth, height: cellHeight }}
              canMoveUp={index >= cols}
              nextFocusDown={
                index >= startIndexOfLastRow ? specSymbolsButtonNode : undefined
              }
            />
          )}
        />
        <View style={styles.supportButtonsContainer}>
          <Button
            ref={specSymbolsButtonRef}
            text={specSymbolsButtonLabel}
            onPress={keybordTypeSwitch}
            nextFocusUp={keyboardDatalastItemButtonNode}
            canMoveDown={false}
            textStyle={styles.specSymbolsLabelText}
            style={{
              height: cellHeight,
              width: cellWidth * (keyboardDataLocale.length > 1 ? 1.5 : 2),
            }}
          />
          {Boolean(keyboardDataLocale.length > 1) && (
            <Button
              text={
                keyboardDataLocale[
                  selectedLanguage + 1 < keyboardDataLocale.length
                    ? selectedLanguage + 1
                    : 0
                ].langSwitchButton.text
              }
              canMoveDown={false}
              nextFocusUp={keyboardDatalastItemButtonNode}
              textStyle={styles.specSymbolsLabelText}
              onPress={switchLanguage}
              style={{ height: cellHeight, width: cellWidth * 1.5 }}
            />
          )}
          <Button
            Icon={Space}
            onPress={addSpaceToSearch}
            canMoveDown={false}
            style={{
              height: cellHeight,
              width: cellWidth * (keyboardDataLocale.length > 1 ? 1.5 : 2),
            }}
          />
          <Button
            Icon={Delete}
            onPress={removeLetterFromSearch}
            canMoveDown={false}
            style={{
              height: cellHeight,
              width: cellWidth * (keyboardDataLocale.length > 1 ? 1.5 : 2),
            }}
          />
        </View>
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

  useImperativeHandle(
    ref,
    () => ({
      addLetterToSearch: (text: string): void => {
        dispatch(setSearchQuery({ searchQuery: text }));
      },
      addSpaceToSearch: (): void => {
        dispatch(setSearchQuery({ searchQuery: ' ' }));
      },
      removeLetterFromSearch: (): void => {
        dispatch(setSearchQuery({ searchQuery: '' }));
      },
    }),
    [dispatch],
  );
  return (
    <View style={[dStyle.container, containerStyle]}>
      <RohText style={[dStyle.text, textStyle, dStyle.textDifault]}>
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
  textDifault: {
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
});
