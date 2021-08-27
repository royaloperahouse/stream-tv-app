// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import RohText from '@components/RohText';
// import { scaleSize } from '@utils/scaleSize';

// type TSettingsScreenProps = {};
// const SettingsScreen: React.FC<TSettingsScreenProps> = () => {
//   return (
//     <View style={styles.root}>
//       <RohText style={styles.rootText} bold>
//         Settings Screen will be soon
//       </RohText>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   rootText: {
//     color: 'white',
//     fontSize: scaleSize(48),
//   },
// });

// export default SettingsScreen;


import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListView from '@screens/HomeScreen/ListScreen';
import DetailView from '@screens/HomeScreen/DetailsScreen';
import PlayerView from '@screens/HomeScreen/PlayerScreen';

const RailStack = createStackNavigator();

type Props = {};

const SettingsScreen: React.FC<Props> = () => {
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

export default SettingsScreen;
