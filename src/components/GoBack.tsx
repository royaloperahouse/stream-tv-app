import React, {
  useLayoutEffect,
  createRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { navMenuManager } from '@components/NavMenu';
import { scaleSize } from '@utils/scaleSize';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import GoBackIcon from '@assets/svg/navIcons/GoBack.svg';
import TouchableHighlightWrapper from './TouchableHighlightWrapper';
import { globalModalManager } from '@components/GlobalModal';
import { goBackButtonWidth } from '@configs/eventDetailsConfig';
const goBackButtonRef = createRef<
  Partial<{
    showGoBackButton: () => void;
    hideGoBackButton: () => void;
  }>
>();

export const goBackButtonuManager = Object.freeze({
  showGoBackButton: () => {
    if (typeof goBackButtonRef.current?.showGoBackButton === 'function') {
      goBackButtonRef.current.showGoBackButton();
    }
  },
  hideGoBackButton: () => {
    if (typeof goBackButtonRef.current?.hideGoBackButton === 'function') {
      goBackButtonRef.current.hideGoBackButton();
    }
  },
});

type TGoBackProps = {};

const GoBack: React.FC<TGoBackProps> = () => {
  const [show, setShow] = useState<boolean>(true);
  const navigation = useNavigation();
  const isMounted = useRef<boolean>(false);
  const route = useRoute<RouteProp<any, string>>();
  const onFocusHandler = () => {
    if (route.params?.screenNameFrom) {
      navigation.navigate(route.params.screenNameFrom, {
        fromEventDetails: true,
        sectionIndex: route.params.sectionIndex,
        eventId: route.params.event.id,
      });
      navMenuManager.showNavMenu();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
      navMenuManager.showNavMenu();
    }
  };
  useLayoutEffect(() => {
    const handleBackButtonClick = () => {
      if (globalModalManager.isModalOpen() || !show) {
        return true;
      }
      if (route.params?.screenNameFrom) {
        navigation.navigate(route.params.screenNameFrom, {
          fromEventDetails: true,
          sectionIndex: route.params.sectionIndex,
          eventId: route.params.event.id,
        });
        navMenuManager.showNavMenu();
      } else if (navigation.canGoBack()) {
        navigation.goBack();
        navMenuManager.showNavMenu();
      }
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [navigation, route.params, show]);
  useImperativeHandle(
    goBackButtonRef,
    () => ({
      showGoBackButton: () => {
        if (isMounted.current) {
          setShow(true);
        }
      },
      hideGoBackButton: () => {
        if (isMounted.current) {
          setShow(false);
        }
      },
    }),
    [],
  );
  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  if (!show) {
    return null;
  }
  return (
    <TouchableHighlightWrapper
      onFocus={onFocusHandler}
      style={styles.wrapperStyle}
      styleFocused={styles.wrapperStyleActive}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <GoBackIcon width={scaleSize(40)} height={scaleSize(40)} />
        </View>
      </View>
    </TouchableHighlightWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: goBackButtonWidth,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  wrapperStyle: {
    opacity: 0.5,
  },
  wrapperStyleActive: {
    opacity: 0.7,
  },
});

export default GoBack;
