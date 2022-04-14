import React, {
  useRef,
  forwardRef,
  useLayoutEffect,
  useState,
  useImperativeHandle,
} from 'react';
import { StyleSheet } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import GoDown from './GoDown';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
//sectionsShema: { [screenKey: string]: { availabilety?: boolean } };
type Props = {
  focusCallback: () => void;
  screensNames: Array<string>;
};

export type TMoveToTopSectionButtonRef = {
  showButton: () => void;
  hideButton: () => void;
  setScreenAvailabilety: (screenName: string, availabilety?: boolean) => void;
  setActiveScreenIndex: (screenIndex: number) => void;
};

const MoveToTopSectionButton = forwardRef<TMoveToTopSectionButtonRef, Props>(
  ({ focusCallback, screensNames }, ref) => {
    const [show, setShow] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(true);
    const isMounted = useRef<boolean>(false);
    const [schema, setSchema] = useState<
      Array<{
        availabilety?: boolean;
        index: number;
        screenName: string;
      }>
    >(
      screensNames.reduce(
        (
          acc: Array<{
            availabilety?: boolean;
            index: number;
            screenName: string;
          }>,
          screenName: string,
          index,
        ) => {
          acc.push({
            screenName,
            index,
          });
          return acc;
        },
        [],
      ),
    );
    const [activeScreenIndex, setActiveScreenIndex] = useState<number>(-1);
    const prevActiveIndex = useRef<number>(activeScreenIndex);
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
        setScreenAvailabilety: (
          screenName: string,
          availabilety?: boolean,
        ): void => {
          const currentIndex = schema.findIndex(
            sceeninfo => sceeninfo.screenName === screenName,
          );
          if (
            isMounted.current &&
            currentIndex !== -1 &&
            schema[currentIndex].availabilety !== availabilety
          ) {
            setSchema(prevState => {
              const newSchema = [...prevState];
              newSchema[currentIndex].availabilety = availabilety;
              return newSchema;
            });
          }
        },
        setActiveScreenIndex: (screenIndex: number) => {
          if (isMounted.current) {
            if (screenIndex === -1) {
              setVisible(true);
            }
            setActiveScreenIndex(screenIndex);
          }
        },
      }),
      [schema],
    );
    useLayoutEffect(() => {
      let needToShow = true;
      if (
        activeScreenIndex === -1 ||
        !schema.length ||
        activeScreenIndex <= prevActiveIndex.current
      ) {
        needToShow = false;
      }
      if (
        schema.length &&
        activeScreenIndex !== -1 &&
        activeScreenIndex !== schema.length - 1 &&
        activeScreenIndex > prevActiveIndex.current
      ) {
        for (let i = activeScreenIndex + 1; i < schema.length; i++) {
          if (schema[i].availabilety || schema[i].availabilety === undefined) {
            needToShow = false;
            break;
          }
        }
      }
      setShow(needToShow);
    }, [activeScreenIndex, schema]);
    useLayoutEffect(() => {
      if (isMounted.current) {
        prevActiveIndex.current = activeScreenIndex;
      }
    }, [activeScreenIndex]);

    useLayoutEffect(() => {
      if (!isMounted.current) {
        return;
      }
      if (!visible) {
        focusCallback();
      }
    }, [visible]);

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
        canMoveRight={false}
        canMoveUp={false}
        canMoveDown={false}
        canMoveLeft={false}
        style={{ opacity: visible ? 1 : 0 }}
        onFocus={() => {
          if (isMounted.current) {
            setVisible(false);
          }
        }}>
        <GoDown text="Event details & more" />
      </TouchableHighlightWrapper>
    );
  },
);

export default MoveToTopSectionButton;
