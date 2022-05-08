import { Colors } from '@themes/Styleguide';
import { scaleSize } from '@utils/scaleSize';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useLayoutEffect,
  useRef,
} from 'react';
import { View, StyleSheet } from 'react-native';
import RohText from './RohText';
export type TScrollingArrowPaginationRef = {
  setCurrentIndex?: (index: number) => void;
};
type TScrollingArrowPaginationProps = {
  countOfItems: number;
  initialIndex?: number;
};
const ScrollingArrowPagination = forwardRef<
  TScrollingArrowPaginationRef,
  TScrollingArrowPaginationProps
>((props, ref) => {
  const leftArrow = '<';
  const rightArrow = '>';
  const { countOfItems, initialIndex = 0 } = props;
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const mounted = useRef<boolean>(false);
  useImperativeHandle(
    ref,
    () => ({
      setCurrentIndex: (index: number) => {
        if (mounted.current) {
          setActiveIndex(index);
        }
      },
    }),
    [],
  );
  useLayoutEffect(() => {
    mounted.current = true;
  }, []);
  return (
    <View style={styles.root}>
      {!!activeIndex && (
        <View style={styles.leftArrowContainer}>
          <RohText style={styles.arrowsText}>{leftArrow}</RohText>
        </View>
      )}
      {activeIndex !== countOfItems - 1 && (
        <View style={styles.rightArrowContainer}>
          <RohText style={styles.arrowsText}>{rightArrow}</RohText>
        </View>
      )}
    </View>
  );
});

export default ScrollingArrowPagination;
const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    position: 'absolute',
  },
  leftArrowContainer: {
    position: 'absolute',
    left: -1 * scaleSize(130),
  },
  rightArrowContainer: {
    position: 'absolute',
    right: -1 * scaleSize(130),
  },
  arrowsText: {
    color: Colors.tVMidGrey,
    fontSize: scaleSize(68),
  },
});
