import { isTVOS } from '@configs/globalConfig';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  createRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  ViewStyle,
  StyleSheet,
  VirtualizedList,
  TouchableHighlight,
} from 'react-native';
import ExpandableButton from './ExpandableButton';
export enum EActionButtonListType {
  common,
  withoutTrailers,
}

type TActionButton = {
  text: string;
  Icon: any;
  onPress: (...args: Array<any>) => void;
  onFocus?: (...args: Array<any>) => void;
  onBlur?: (...args: Array<any>) => void;
  key: string;
  hasTVPreferredFocus?: boolean;
  showLoader?: boolean;
  freezeButtonAfterPressing?: boolean;
};

type ActionButtonListProps = {
  type: EActionButtonListType;
  buttonsFactory: (
    actionButtonListType: EActionButtonListType,
  ) => Array<TActionButton>;
  setFocusRef: (
    cp:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number,
  ) => void;
  style?: ViewStyle;
};

export type TActionButtonListRef = Partial<{
  focusOnFirstAvalibleButton: () => void;
}>;

const ActionButtonList = forwardRef<
  TActionButtonListRef,
  ActionButtonListProps
>(({ type, buttonsFactory, setFocusRef, style = {} }, ref) => {
  const isMounted = useRef<boolean>(false);
  const buttonList = buttonsFactory(type);
  //const firstButtonKeyName = useRef<string>(buttonList[0].key);
  const isFocused = useIsFocused();
  const expandableButtonsRefs = useRef<Partial<{ [key: string]: any }>>({});
  useImperativeHandle(
    ref,
    () => ({
      focusOnFirstAvalibleButton: () => {
        const firstAvalibleButtonRef = Object.values(
          expandableButtonsRefs.current,
        )[0];
        if (
          isMounted.current &&
          firstAvalibleButtonRef !== undefined &&
          typeof firstAvalibleButtonRef?.current?.setNativeProps === 'function'
        ) {
          firstAvalibleButtonRef.current.setNativeProps({
            hasTVPreferredFocus: true,
          });
        }
      },
    }),
    [],
  );

  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    const arrayOfAvalibleButtonRef = Object.values(
      expandableButtonsRefs.current,
    );
    if (isFocused && isMounted.current) {
      setFocusRef(
        arrayOfAvalibleButtonRef.length &&
          arrayOfAvalibleButtonRef[arrayOfAvalibleButtonRef.length - 1].current
          ? arrayOfAvalibleButtonRef[arrayOfAvalibleButtonRef.length - 1]
              .current
          : null,
      );
    }
  }, [setFocusRef, isFocused, buttonList.length]);

  return (
    <VirtualizedList
      listKey={'eventDetailsActionButtonList'}
      style={[styles.root, style]}
      keyExtractor={item => item.key}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={buttonList}
      initialNumToRender={5}
      renderItem={({ item }) => (
        <ExpandableButton
          ref={
            expandableButtonsRefs.current[item.key]
              ? expandableButtonsRefs.current[item.key]
              : (expandableButtonsRefs.current[item.key] = createRef())
          }
          text={item.text}
          Icon={item.Icon}
          hasTVPreferredFocus={item.hasTVPreferredFocus || false}
          focusCallback={item.onFocus}
          blurCallback={item.onBlur}
          onPress={item.onPress}
          showLoader={item.showLoader}
          freezeButtonAfterPressing={item.freezeButtonAfterPressing}
        />
      )}
      getItemCount={(data: Array<TActionButton>) => data?.length || 0}
      getItem={(data: Array<TActionButton>, index: number) => data[index]}
    />
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
});

export default ActionButtonList;
