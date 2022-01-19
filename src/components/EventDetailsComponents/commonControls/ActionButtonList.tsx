import React, { forwardRef } from 'react';
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

const ActionButtonList = forwardRef<any, ActionButtonListProps>(
  ({ type, buttonsFactory, style = {} }, ref) => {
    const buttonList = buttonsFactory(type);
    return (
      <VirtualizedList
        listKey={'eventDetailsActionButtonList'}
        style={[styles.root, style]}
        keyExtractor={(item, index) => item[index].key}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={buttonList}
        initialNumToRender={5}
        renderItem={({ item, index }) => (
          <ExpandableButton
            ref={item[index].key === 'WatchNow' ? ref : undefined}
            text={item[index].text}
            Icon={item[index].Icon}
            hasTVPreferredFocus={item[index].hasTVPreferredFocus || false}
            focusCallback={item[index].onFocus}
            onPress={item[index].onPress}
          />
        )}
        getItemCount={(data: Array<TActionButton>) => data?.length || 0}
        getItem={(data: Array<TActionButton>) => [...data]}
      />
    );
  },
);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
});

export default ActionButtonList;
