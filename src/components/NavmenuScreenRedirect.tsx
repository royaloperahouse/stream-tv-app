import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TVFocusGuideView,
  View,
} from 'react-native';
export type TNavMenuScreenRedirectRef = {
  setRedirectFromNavMenu: (
    cp:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | undefined,
  ) => void;
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
};

type TNavMenuScreenRedirectProps = { screenName: string };

const navMenuItemsRefs: { [key: string]: React.RefObject<TouchableHighlight> } =
  {};
export function setNavMenuItemsRefs(
  screenName: string,
  ref: React.RefObject<TouchableHighlight>,
) {
  navMenuItemsRefs[screenName] = ref;
}

export const NavMenuScreenRedirect = forwardRef<
  TNavMenuScreenRedirectRef,
  TNavMenuScreenRedirectProps
>((props, ref) => {
  const isMounted = useRef(false);
  const [redirectRromNavMenu, setRedirectFromNavMenu] = useState<
    | (
        | number
        | React.Component<any, any, any>
        | React.ComponentClass<any, any>
        | null
      )[]
    | undefined
  >();

  const [difaultRedirectRromNavMenu, setDefRedirectFromNavMenu] = useState<{
    [key: string]:
      | React.Component<any, any, any>
      | React.ComponentClass<any, any>
      | null
      | number;
  }>({});

  useImperativeHandle(
    ref,
    () => ({
      setRedirectFromNavMenu: cp => {
        if (true || !isMounted.current) {
          return;
        }
        const component = cp !== undefined ? [cp] : cp;
        setRedirectFromNavMenu(component);
      },
      setDefaultRedirectFromNavMenu: (key, cp) => {
        console.log(key, '  keyAdd');
        if (!isMounted.current) {
          return;
        }

        setDefRedirectFromNavMenu(prevState => {
          const newState = { ...prevState };
          newState[key] = cp;
          return newState;
        });
      },
      removeDefaultRedirectFromNavMenu: key => {
        if (!isMounted.current) {
          return;
        }
        console.log(key, '  keyremove');
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
        if (!isMounted.current) {
          return;
        }
        setDefRedirectFromNavMenu({});
      },
    }),
    [],
  );
  const redirectToContent =
    redirectRromNavMenu === undefined &&
    Object.values(difaultRedirectRromNavMenu).length === 0
      ? undefined
      : redirectRromNavMenu === undefined
      ? Object.values(difaultRedirectRromNavMenu)
      : [...redirectRromNavMenu, ...Object.values(difaultRedirectRromNavMenu)];
  console.log(
    props.screenName,
    redirectToContent,
    Object.keys(difaultRedirectRromNavMenu),
    '   navMenuItemsRefsCPs',
  );
  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <View style={styles.root}>
      <TVFocusGuideView
        style={[
          styles.redirectBlock,
          { borderEndWidth: 1, borderColor: 'green' },
        ]}
        destinations={redirectToContent}
      />
      <TVFocusGuideView
        style={[
          styles.redirectBlock,
          { borderEndWidth: 1, borderColor: 'red' },
        ]}
        destinations={
          props.screenName in navMenuItemsRefs
            ? [navMenuItemsRefs[props.screenName].current]
            : undefined
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: 2,
    flexDirection: 'row',
  },
  redirectBlock: {
    flex: 1,
  },
});
