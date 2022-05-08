import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { allRoutes } from '@navigations/routes';
import { useFeature } from 'flagged';
const Stack = createStackNavigator();

type TContentLayoutProps = {};

const ContentLayout: React.FC<TContentLayoutProps> = () => {
  const showLiveStream = useFeature('showLiveStream');
  const initialRoute = allRoutes.find(route => route.isDefault);
  return (
    <View style={styles.root}>
      <Stack.Navigator
        initialRouteName={initialRoute?.navMenuScreenName}
        detachInactiveScreens={true}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animationEnabled: false,
          detachPreviousScreen: true,
        }}>
        {allRoutes
          .filter(route => {
            if (showLiveStream) {
              return true;
            }
            return route.navMenuScreenName !== 'liveStream';
          })
          .map(route => (
            <Stack.Screen
              key={route.navMenuScreenName}
              name={route.navMenuScreenName}
              component={route.ScreenComponent}
            />
          ))}
      </Stack.Navigator>
    </View>
  );
};

export default ContentLayout;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
