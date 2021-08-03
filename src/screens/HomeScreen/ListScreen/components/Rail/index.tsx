import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { EventModel } from '@services/types/models';
import RohText from '@components/RohText';
import Item from '@screens/HomeScreen/ListScreen/components/Item';

type Props = {
  title: string;
  events: Array<EventModel>;
  selectEvent: (event: EventModel) => void;
  goToEvent: (event: EventModel) => void;
  canMoveUp?: boolean;
  defaultFocus?: boolean;
};

const Rail: React.FC<Props> = ({
  title,
  events,
  selectEvent,
  goToEvent,
  canMoveUp,
  defaultFocus,
}) => {
  return (
    <View style={styles.container}>
      <RohText style={styles.title}>{title}</RohText>
      <ScrollView horizontal>
        {events.map((event, index) => (
          <Item
            hasTVPreferredFocus={defaultFocus && index === 0}
            event={event}
            selectEvent={selectEvent}
            key={event.id}
            goToEvent={goToEvent}
            canMoveUp={canMoveUp}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: scaleSize(328),
    marginBottom: scaleSize(44),
  },
  title: {
    color: 'white',
    fontSize: scaleSize(26),
    marginBottom: scaleSize(20),
    textTransform: 'uppercase',
  },
});

export default Rail;
