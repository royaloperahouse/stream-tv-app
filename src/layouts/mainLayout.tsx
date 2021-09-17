import React from 'react';
import { View, StyleSheet } from 'react-native';
import WithLogo from '@components/WithLogo';
import WithBackground from '@components/WithBackground';
import NavMenu from '@components/NavMenu';
import NavigationContainer from '@navigations/navigationContainer';
import ContentLayout from '@layouts/contentLayout';
import { routes } from '@navigations/routes';
type TMainLayoutProps = {};

const MainLayout: React.FC<TMainLayoutProps> = () => {
  const navMenuConfig = routes.map(route => ({
    navMenuScreenName: route.navMenuScreenName,
    SvgIconActiveComponent: route.SvgIconActiveComponent,
    SvgIconInActiveComponent: route.SvgIconInActiveComponent,
    navMenuTitle: route.navMenuTitle,
    position: route.position,
    isDefault: route.isDefault,
  }));
  return (
    <WithBackground>
      <WithLogo>
        <NavigationContainer>
          <View style={styles.root}>
            <NavMenu navMenuConfig={navMenuConfig} />
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
    flexDirection: 'row',
  },
});

export default MainLayout;
