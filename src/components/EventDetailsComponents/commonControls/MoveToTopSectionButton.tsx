import React, {
  useRef,
  forwardRef,
  useLayoutEffect,
  useState,
  useImperativeHandle,
} from 'react';
import { StyleSheet, View } from 'react-native';
import GoDown from './GoDown';
import TouchableHighlightWrapper, {
  TTouchableHighlightWrapperRef,
} from '@components/TouchableHighlightWrapper';
//sectionsShema: { [screenKey: string]: { availabilety?: boolean } };
type Props = {
  focusCallback: () => void;
  screensNames: Array<string>;
};

export type TMoveToTopSectionButtonRef = {
  showButton: () => void;
  hideButton: () => void;
};

const MoveToTopSectionButton = forwardRef<TMoveToTopSectionButtonRef, Props>(
  ({ focusCallback }, ref) => {
    const [show, setShow] = useState<boolean>(true);
    const isMounted = useRef<boolean>(false);
    const touchComponetnRef = useRef<TTouchableHighlightWrapperRef>(null);
    useImperativeHandle(
      ref,
      () => ({
        showButton: (): void => {
          if (isMounted.current) {
            setShow(true);
          }
        },
        hideButton: (): void => {
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
        ref={touchComponetnRef}
        canMoveRight={false}
        canMoveUp={false}
        canMoveDown={false}
        canMoveLeft={false}
        style={{ opacity: show ? 1 : 0 }}
        onFocus={focusCallback}>
        <View style={styles.root}>
          <GoDown text="Event details & more" />
        </View>
      </TouchableHighlightWrapper>
    );
  },
);

export default MoveToTopSectionButton;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
});
