import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';

import GoBack from '@components/GoBack';

import General from '@screens/HomeScreen/DetailsScreen/components/General';
import Synopsys from '@screens/HomeScreen/DetailsScreen/components/Synopsys';
import Cast from '@screens/HomeScreen/DetailsScreen/components/Cast';
import { Dimensions } from 'react-native';

type Props = {
  route?: any; // TODO: find the corrent type for that
  navigation?: any; // TODO: find the corrent type for that
};

const DetailView: React.FC<Props> = ({ route, navigation }) => {
  const { event } = route.params;

  const showPlayer = () => {
    navigation.navigate('Player', {});
  };

  let _scrollView = useRef<any>();

  const scrollToElement = () => {
    // we need this only to scroll to top at this point, but in the future most likely could be wider
    _scrollView?.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.root}>
      <GoBack />
      <ScrollView
        style={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={_scrollView}>
        <General
          event={event}
          scrollToMe={scrollToElement}
          showPlayer={showPlayer}
        />
        <Synopsys event={event} />
        <Cast event={event} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
  },
});

export default DetailView;
