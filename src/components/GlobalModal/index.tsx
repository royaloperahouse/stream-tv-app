import React, {
  useState,
  createRef,
  useImperativeHandle,
  useRef,
  useLayoutEffect,
} from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import WithLogo from '@components/WithLogo';
import WithBackground from '@components/WithBackground';
import { TDefaultGlobalModalContentProps } from '@services/types/globalModal';
const fadeDuration = 500;
type TGlobalModalProps = {};
export type TGlobalModalConfig = {
  hasLogo?: boolean;
  hasBackground?: boolean;
  contentComponent: React.FC<
    TDefaultGlobalModalContentProps & { [key: string]: any }
  >;
  contentProps: TDefaultGlobalModalContentProps & { [key: string]: any };
};
const globalModalRef = createRef<
  Partial<{
    openModal: (config: TGlobalModalConfig) => void;
    closeModal: (cb?: (...args: Array<any>) => void) => void;
    isModalOpen: () => boolean;
  }>
>();

export const globalModalManager = Object.freeze({
  openModal: (config: TGlobalModalConfig) => {
    if (typeof globalModalRef.current?.openModal === 'function') {
      globalModalRef.current.openModal(config);
    }
  },
  closeModal: (cb?: (...args: Array<any>) => void) => {
    if (typeof globalModalRef.current?.closeModal === 'function') {
      globalModalRef.current.closeModal(cb);
    }
  },
  isModalOpen: () => {
    if (typeof globalModalRef.current?.isModalOpen === 'function') {
      return globalModalRef.current.isModalOpen();
    }
  },
});

const GlobalModal: React.FC<TGlobalModalProps> = () => {
  const [open, setOpen] = useState<TGlobalModalConfig | null>(null);
  const mounted = useRef<boolean>(false);
  const fadeAnimation = useRef<Animated.Value>(new Animated.Value(0)).current;
  const Content = open && open.contentComponent;
  let returnetContent =
    open !== null && Content !== null ? (
      <View style={styles.root}>
        <Content {...open.contentProps} />
      </View>
    ) : null;
  const isModalOpen: boolean = open !== null;
  useImperativeHandle(
    globalModalRef,
    () => ({
      openModal: (config: TGlobalModalConfig) => {
        if (!mounted.current) {
          return;
        }
        setOpen(config);
      },
      closeModal: (cb?: (...args: Array<any>) => void) => {
        if (!mounted.current) {
          return;
        }
        fadeAnimation.setValue(1);
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: fadeDuration,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (!mounted.current) {
            return;
          }
          if (!finished) {
            fadeAnimation.setValue(0);
          }
          if (typeof cb === 'function') {
            cb();
          }
          setOpen(null);
        });
      },
      isModalOpen: () => open !== null,
    }),
    [fadeAnimation, open],
  );

  useLayoutEffect(() => {
    if (!mounted.current) {
      return;
    }
    if (isModalOpen) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!mounted.current) {
          return;
        }
        if (!finished) {
          fadeAnimation.setValue(1);
        }
      });
    }
  }, [isModalOpen]);

  useLayoutEffect(() => {
    mounted.current = true;
  }, []);

  if (open && open.hasLogo !== false) {
    returnetContent = <WithLogo>{returnetContent}</WithLogo>;
  }
  if (open && open.hasBackground !== false) {
    returnetContent = <WithBackground>{returnetContent}</WithBackground>;
  }
  return (
    <Animated.View style={[styles.overlayLayer, { opacity: fadeAnimation }]}>
      {returnetContent}
    </Animated.View>
  );
};

export default GlobalModal;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlayLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
