import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ExpandableButton from './ExpandableButton';
export enum EActionButtonListType {
  common,
}

type ActionButtonListProps = {
  type: EActionButtonListType;
  buttonsFactory: (actionButtonListType: EActionButtonListType) => Array<{
    text: string;
    Icon: any;
    onPress: (...args: Array<any>) => void;
    onFocus: (...args: Array<any>) => void;
    key: string;
    hasTVPreferredFocus?: boolean;
  }>;
  style?: ViewStyle;
};

const ActionButtonList: React.FC<ActionButtonListProps> = ({
  type,
  buttonsFactory,
  style = {},
}) => {
  const data = buttonsFactory(type);
  return (
    <ScrollView
      style={[styles.root, style]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {data.map(item => (
        <ExpandableButton
          key={item.key}
          text={item.text}
          Icon={item.Icon}
          hasTVPreferredFocus={item.hasTVPreferredFocus || false}
          focusCallback={item.onFocus}
          onPress={item.onPress}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
});

export default ActionButtonList;
