import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TVFocusGuideView,
  View,
} from 'react-native';
import { isTVOS } from '@configs/globalConfig';
export type TNavMenuScreenRedirectRef = {
  setDefaultRedirectFromNavMenu: (
    key: string,
    cp:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number,
  ) => void;
  removeDefaultRedirectFromNavMenu: (key: string) => void;
  removeAllDefaultRedirectFromNavMenu: () => void;
  setDefaultRedirectToNavMenu: (
    key: string,
    cp:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number,
  ) => void;
  removeDefaultRedirectToNavMenu: (key: string) => void;
  removeAllDefaultRedirectToNavMenu: () => void;
};

type TNavMenuScreenRedirectProps = { screenName?: string };

const navMenuItemsRefs: { [key: string]: React.RefObject<TouchableHighlight> } =
  {};
export function setNavMenuItemsRefs(
  screenName: string,
  ref: React.RefObject<TouchableHighlight>,
) {
  if (!isTVOS) {
    return;
  }
  navMenuItemsRefs[screenName] = ref;
}

export const NavMenuScreenRedirect = forwardRef<
  TNavMenuScreenRedirectRef,
  TNavMenuScreenRedirectProps
>((props, ref) => {
  const isMounted = useRef(false);
  const [difaultRedirectFromNavMenu, setDefRedirectFromNavMenu] = useState<{
    [key: string]:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number;
  }>({});

  const [difaultRedirectToNavMenu, setDefRedirectToNavMenu] = useState<{
    [key: string]:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number;
  }>({});

  useImperativeHandle(
    ref,
    () => ({
      setDefaultRedirectFromNavMenu: (key, cp) => {
        if (!isMounted.current || !isTVOS) {
          return;
        }

        setDefRedirectFromNavMenu(prevState => {
          const newState = { ...prevState };
          newState[key] = cp;
          return newState;
        });
      },
      setDefaultRedirectToNavMenu: (key, cp) => {
        if (!isMounted.current || !isTVOS) {
          return;
        }

        setDefRedirectToNavMenu(prevState => {
          const newState = { ...prevState };
          newState[key] = cp;
          return newState;
        });
      },

      removeDefaultRedirectFromNavMenu: key => {
        if (!isMounted.current || !isTVOS) {
          return;
        }
        setDefRedirectFromNavMenu(prevState => {
          if (!(key in prevState)) {
            return prevState;
          }
          const newState = { ...prevState };
          delete newState[key];
          return newState;
        });
      },
      removeAllDefaultRedirectFromNavMenu: () => {
        if (!isMounted.current || !isTVOS) {
          return;
        }
        setDefRedirectFromNavMenu({});
      },
      removeDefaultRedirectToNavMenu: key => {
        if (!isMounted.current || !isTVOS) {
          return;
        }
        setDefRedirectToNavMenu(prevState => {
          if (!(key in prevState)) {
            return prevState;
          }
          const newState = { ...prevState };
          delete newState[key];
          return newState;
        });
      },
      removeAllDefaultRedirectToNavMenu: () => {
        if (!isMounted.current || !isTVOS) {
          return;
        }
        setDefRedirectToNavMenu({});
      },
    }),
    [],
  );
  const redirectToContent =
    Object.values(difaultRedirectFromNavMenu).length === 0
      ? undefined
      : Object.entries(difaultRedirectFromNavMenu)
          .sort(([firstKey], [nextKey]) => {
            const firstKeyNumber = Number(firstKey);
            const nextKeyNumber = Number(nextKey);
            if (Number.isNaN(firstKeyNumber) || Number.isNaN(nextKeyNumber)) {
              return 0;
            }
            return firstKeyNumber - nextKeyNumber;
          })
          .map(([_, value]) => value);

  const redirectFromContent =
    props.screenName && props.screenName in navMenuItemsRefs
      ? [navMenuItemsRefs[props.screenName].current]
      : Object.values(difaultRedirectToNavMenu).length === 0
      ? undefined
      : Object.entries(difaultRedirectToNavMenu)
          .sort(([firstKey], [nextKey]) => {
            const firstKeyNumber = Number(firstKey);
            const nextKeyNumber = Number(nextKey);
            if (Number.isNaN(firstKeyNumber) || Number.isNaN(nextKeyNumber)) {
              return 0;
            }
            return firstKeyNumber - nextKeyNumber;
          })
          .map(([_, value]) => value);

  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  if (!isTVOS) {
    return null;
  }
  return (
    <View style={styles.root}>
      <TVFocusGuideView
        style={[styles.redirectBlock]}
        destinations={redirectToContent}
      />
      <TVFocusGuideView
        style={[styles.redirectBlock]}
        destinations={redirectFromContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('window').height,
    width: 2,
    flexDirection: 'row',
  },
  redirectBlock: {
    flex: 1,
  },
});
