import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  createRef,
  useLayoutEffect,
} from 'react';
import { ViewStyle, StyleSheet, VirtualizedList } from 'react-native';
import ExpandableButton from './ExpandableButton';
export enum EActionButtonListType {
  common,
  withoutTrailers,
}

type TActionButton = {
  text: string;
  Icon: any;
  onPress: (...args: Array<any>) => void;
  onFocus: (...args: Array<any>) => void;
  key: string;
  hasTVPreferredFocus?: boolean;
};

type ActionButtonListProps = {
  type: EActionButtonListType;
  buttonsFactory: (
    actionButtonListType: EActionButtonListType,
  ) => Array<TActionButton>;
  style?: ViewStyle;
};

export type TActionButtonListRef = Partial<{
  focusOnFirstAvalibleButton: () => void;
}>;

const ActionButtonList = forwardRef<
  TActionButtonListRef,
  ActionButtonListProps
>(({ type, buttonsFactory, style = {} }, ref) => {
  const isMounted = useRef<boolean>(false);
  const buttonList = buttonsFactory(type);
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
          onPress={item.onPress}
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
