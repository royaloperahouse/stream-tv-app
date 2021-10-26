import React from 'react';
import { View, StyleSheet } from 'react-native';
import WithLogo from '@components/WithLogo';
import WithBackground from '@components/WithBackground';
import NavMenu from '@components/NavMenu';
import NavigationContainer from '@navigations/navigationContainer';
import ContentLayout from '@layouts/contentLayout';
import { routes } from '@navigations/routes';
import RohText from '@components/RohText';
import { buildInfo } from '@configs/globalConfig';
import { scaleSize } from '@utils/scaleSize';
import GlobalModal from '@components/GlobalModal';
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
        <View style={styles.root}>
          <NavigationContainer>
            <View style={styles.maninContentContainer}>
              <NavMenu navMenuConfig={navMenuConfig} />
              <ContentLayout />
              {__DEV__ && (
                <View style={styles.buildInfo}>
                  <RohText
                    bold
                    style={styles.buildInfoText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {buildInfo}
                  </RohText>
                </View>
              )}
            </View>
          </NavigationContainer>
          <GlobalModal />
        </View>
      </WithLogo>
    </WithBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  maninContentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  buildInfo: {
    position: 'absolute',
    top: scaleSize(10),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buildInfoText: {
    color: 'white',
    fontSize: scaleSize(20),
  },
});

export default MainLayout;
