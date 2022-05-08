import React, { useState, useCallback } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import RohText from '@components/RohText';
import { scaleSize } from '@utils/scaleSize';
import { Colors } from '@themes/Styleguide';
import debounce from 'lodash.debounce';

type OverflowingContainerProps = {
  contentMaxVisibleHeight: number;
  contentMaxVisibleWidth?: number;
  addBorder?: boolean;
  fixedHeight?: boolean;
};

export const OverflowingContainer: React.FC<OverflowingContainerProps> = ({
  children,
  contentMaxVisibleHeight,
  contentMaxVisibleWidth,
  addBorder,
  fixedHeight,
}) => {
  const [showThreeDots, setShowThreeDots] = useState<boolean>(false);
  const setThreeDotsEnding = debounce(
    (height: number) => {
      const newstate = height >= contentMaxVisibleHeight;
      setShowThreeDots(prevState =>
        prevState === newstate ? prevState : newstate,
      );
    },
    250,
    { leading: false, trailing: true },
  );
  const onLayoutEventHaandler = useCallback(
    (event: LayoutChangeEvent) => {
      event.persist();
      const { nativeEvent: { layout: { height = 0 } = {} } = {} } = event;
      setThreeDotsEnding(height);
    },
    [setThreeDotsEnding],
  );

  if (!children) {
    return null;
  }
  return (
    <View>
      <View
        style={[
          styles.root,
          {
            [fixedHeight ? 'height' : 'maxHeight']: contentMaxVisibleHeight,
          },
          contentMaxVisibleWidth ? { maxWidth: contentMaxVisibleWidth } : {},
          addBorder ? styles.rootWithBC : {},
        ]}>
        <View
          onLayout={onLayoutEventHaandler}
          style={[addBorder ? styles.contentWithBC : {}]}>
          {children}
        </View>
      </View>
      {showThreeDots && (
        <View style={styles.threeDotsContainer}>
          <RohText style={styles.threeDotsText}>...</RohText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  rootWithBC: {
    borderWidth: 2,
    borderColor: 'red',
  },
  contentWithBC: {
    borderWidth: 2,
    borderColor: 'green',
  },
  threeDotsContainer: {
    position: 'absolute',
    bottom: -scaleSize(25),
    right: scaleSize(20),
  },
  threeDotsText: {
    color: Colors.defaultTextColor,
    fontSize: scaleSize(40),
    textTransform: 'uppercase',
    //lineHeight: scaleSize(8),
    letterSpacing: scaleSize(2),
  },
});
