import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListView from '@screens/HomeScreen/ListScreen';
import DetailView from '@screens/HomeScreen/DetailsScreen';
import PlayerView from '@screens/HomeScreen/PlayerScreen';

const RailStack = createStackNavigator();

type Props = {};

const Home: React.FC<Props> = () => {
  return (
    <RailStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="List">
      <RailStack.Screen name="List" component={ListView} />
      <RailStack.Screen name="Detail" component={DetailView} />
      <RailStack.Screen name="Player" component={PlayerView} />
    </RailStack.Navigator>
  );
};

export default Home;
