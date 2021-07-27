import React, { useState, useRef, useEffect } from 'react';
import { Animated, View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { scaleSize } from '@utils/scaleSize';

import { EventModel } from '@services/types/models';
import { navMenuManager } from '@components/NavMenu';
import Preview from '@screens/HomeScreen/ListScreen/components/Preview';
import Rail from '@screens/HomeScreen/ListScreen/components/Rail';

type Props = {
  navigation?: any; // TODO: find the corrent type for that
};

const ListView: React.FC<Props> = ({ navigation }) => {
  const { myList, featured } = useSelector((state: TRootState) => state.events);

  const [selectedEvent, selectEvent] = useState({});

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const fadeInPreview = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(fadeInPreview, [selectedEvent]);

  const fadeOutPreview = (event: EventModel) => {
    if (event.id != selectedEvent.id) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => selectEvent(event));
    }
  };

  const goToEvent = (event: EventModel) => {
    navMenuManager.hideNavMenu();
    navigation.navigate('Detail', { event });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.preview, { opacity: fadeAnimation }]}>
        <Preview event={selectedEvent} />
      </Animated.View>
      <ScrollView style={styles.rails}>
        <Rail
          title="My list"
          events={myList}
          selectEvent={fadeOutPreview}
          goToEvent={goToEvent}
        />
        <Rail
          title="Featured"
          events={featured}
          selectEvent={fadeOutPreview}
          goToEvent={goToEvent}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    height: scaleSize(600),
  },
  rails: {
    marginTop: scaleSize(10),
    flex: 1,
  },
});

export default ListView;
