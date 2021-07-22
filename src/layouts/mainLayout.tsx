import React from 'react';
import { View, StyleSheet } from 'react-native';
import WithLogo from '@components/WithLogo';
import { scaleSize } from '@utils/scaleSize';
import WithBackground from '@components/WithBackground';
import NavMenu from '@components/NavMenu';
import NavigationContainer from '@navigations/navigationContainer';
import ContentLayout from '@layouts/contentLayout';
type TMainLayoutProps = {};

const MainLayout: React.FC<TMainLayoutProps> = () => {
  return (
    <WithBackground>
      <WithLogo>
        <NavigationContainer>
          <View style={styles.root}>
            <NavMenu />
            <ContentLayout />
          </View>
        </NavigationContainer>
      </WithLogo>
    </WithBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginLeft: scaleSize(60),
    flexDirection: 'row',
  },
});

export default MainLayout;
