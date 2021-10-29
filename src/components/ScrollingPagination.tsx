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
export type TScrolingPaginationRef = {
  setCurrentIndex?: (index: number) => void;
};
type TScrolingPaginationProps = {
  countOfItems: number;
  initialIndex?: number;
};
const ScrollingPagination = forwardRef<
  TScrolingPaginationRef,
  TScrolingPaginationProps
>((props, ref) => {
  const { countOfItems, initialIndex = 0 } = props;
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const mounted = useRef<boolean>(false);
  const ceils = new Array(countOfItems).fill(null);
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
      {ceils.map((_, index) => (
        <View
          key={index}
          style={[
            styles.ceil,
            index === activeIndex ? styles.ceilActive : styles.ceilInActive,
          ]}
        />
      ))}
    </View>
  );
});

export default ScrollingPagination;
const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  ceil: {
    width: scaleSize(40),
    height: scaleSize(3),
    backgroundColor: Colors.defaultTextColor,
    marginHorizontal: scaleSize(10),
  },
  ceilActive: {
    opacity: 1,
  },
  ceilInActive: {
    opacity: 0.4,
  },
});
