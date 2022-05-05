import React, {
  useCallback,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
} from 'react';
import {
  View,
  ViewProps,
  VirtualizedList,
  NativeSyntheticEvent,
  TargetedEvent,
  TouchableHighlight,
  findNodeHandle,
  ViewToken,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TTouchableHighlightWrapperRef } from '@components/TouchableHighlightWrapper';
import { TVEventManager } from '@services/tvRCEventListener';
import debounce from 'lodash.debounce';

type TRailSectionsProps = {
  containerStyle?: ViewProps['style'];
  sections: Array<{ [key: string]: any }>;
  sectionKeyExtractor?: (data: { [key: string]: any }) => string;
  sectionItemKeyExtractor?: (data: { [key: string]: any }) => string;
  sectionsInitialNumber?: number;
  sectionItemsInitialNumber?: number;
  railStyle?: ViewProps['style'];
  renderHeader?: (data: any) => JSX.Element | null;
  headerContainerStyle?: ViewProps['style'];
  renderItem: (info: { [key: string]: any }) => JSX.Element | null;
  sectionsWindowSize?: number;
  railWindowSize?: number;
  sectionIndex?: number;
};

const RailSections: React.FC<TRailSectionsProps> = props => {
  const {
    containerStyle = {},
    sections,
    sectionKeyExtractor = data => data.id,
    sectionItemKeyExtractor = data => data.id,
    sectionsInitialNumber = 2,
    sectionItemsInitialNumber = 5,
    railStyle = {},
    renderHeader = _ => null,
    headerContainerStyle = {},
    sectionsWindowSize = 2,
    railWindowSize = 5,
    renderItem,
    sectionIndex = 0,
  } = props;
  const mountedRef = useRef<boolean>(false);
  const sectionsListRef = useRef<VirtualizedList<any> | null>(null);
  const bottomEndlessScrollRef = useRef<TEndlessScrollRef>(null);
  const scrollToTop = useRef<boolean>(false);
  const scrollToBottom = useRef<boolean>(false);
  const railItemsListRef = useRef<VirtualizedList<any> | null>(null);
  const railsItemsNodesRef = useRef<{
    [key: string]: string;
  }>({});
  const railsItemsRef = useRef<
    Map<string, React.RefObject<TouchableHighlight>>
  >(new Map());

  const setRailItemRef = useCallback(
    (
      eventId: string,
      ref: React.MutableRefObject<TTouchableHighlightWrapperRef | undefined>,
      sectionIdx: number,
    ) => {
      const nodeId = ref.current?.getNode?.();
      if (nodeId === undefined) {
        return;
      }
      if (!railsItemsNodesRef.current[nodeId]) {
        railsItemsNodesRef.current[nodeId] = `${eventId} - ${nodeId}`;
      }
      if (!ref.current?.getRef?.()) {
        return;
      }
      if (railsItemsRef.current.has(`${eventId}-${sectionIdx}`)) {
        railsItemsRef.current.delete(`${eventId}-${sectionIdx}`);
      }
      railsItemsRef.current.set(
        `${eventId}-${sectionIdx}`,
        ref.current.getRef(),
      );
    },
    [],
  );
  const removeRailItemRef = useCallback(
    (
      eventId: string,
      ref: React.MutableRefObject<TTouchableHighlightWrapperRef | undefined>,
      sectionIdx: number,
    ) => {
      const nodeId = ref.current?.getNode?.();
      if (nodeId === undefined || !railsItemsNodesRef.current[nodeId]) {
        return;
      }
      delete railsItemsNodesRef.current[nodeId];
      if (!ref.current?.getRef?.()) {
        return;
      }
      if (railsItemsRef.current.has(`${eventId}-${sectionIdx}`)) {
        railsItemsRef.current.delete(`${eventId}-${sectionIdx}`);
      }
    },
    [],
  );
  const getSectionCount = useCallback(
    data => (Array.isArray(data) ? data.length : 0),
    [],
  );
  const getSectionItemCount = useCallback(
    data => (Array.isArray(data) ? data.length : 0),
    [],
  );
  const viewableItemsChangeHandler = useMemo(
    () =>
      debounce((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
        if (scrollToBottom.current || scrollToTop.current) {
          const sectionIndexToScroll = scrollToBottom.current
            ? sections.length - 1
            : 0;
          scrollToBottom.current = false;
          scrollToTop.current = false;
          const section = info.viewableItems.find(
            viewableItem =>
              viewableItem.index === sectionIndexToScroll &&
              viewableItem.isViewable,
          );
          if (
            !section ||
            !section?.item?.data.length ||
            !railsItemsRef.current.has(
              `${section.item.data[0].id}-${sectionIndexToScroll}`,
            )
          ) {
            return;
          }
          railsItemsRef.current
            .get(`${section.item.data[0].id}-${sectionIndexToScroll}`)
            ?.current?.setNativeProps({ hasTVPreferredFocus: true });
        }
      }, 500),
    [sections.length],
  );
  const scrollToRail = (index: number) => () => {
    if (sectionsListRef.current) {
      sectionsListRef.current.scrollToIndex({
        animated: true,
        index,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      mountedRef.current = true;
      return () => {
        if (mountedRef && mountedRef.current) {
          mountedRef.current = false;
        }
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let outerBlur: boolean = true;
      let outerFocus: boolean = true;
      const cb = (_: any, eve: any) => {
        if (eve?.eventType === 'blur' && mountedRef.current) {
          outerBlur = !(
            Boolean(railsItemsNodesRef.current[eve.target]) ||
            bottomEndlessScrollRef.current?.getNode?.() === eve.target
          );
          return;
        }
        if (eve?.eventType === 'focus' && mountedRef.current) {
          outerFocus = !(
            Boolean(railsItemsNodesRef.current[eve.target]) ||
            bottomEndlessScrollRef.current?.getNode?.() === eve.target
          );
          if ((!outerFocus && outerBlur) || (!outerFocus && !outerBlur)) {
            bottomEndlessScrollRef.current?.setAccessible?.(true);
            return;
          }
          if ((outerFocus && !outerBlur) || (outerFocus && outerBlur)) {
            bottomEndlessScrollRef.current?.setAccessible?.(false);
            return;
          }
        }
      };
      TVEventManager.addEventListener(cb);
      return () => {
        TVEventManager.removeEventListener(cb);
        outerBlur = true;
        outerFocus = true;
        bottomEndlessScrollRef.current?.setAccessible?.(false);
        scrollToTop.current = false;
        scrollToBottom.current = false;
      };
    }, []),
  );
  return (
    <View style={[containerStyle]}>
      <VirtualizedList
        ref={sectionsListRef}
        data={sections}
        keyExtractor={item => sectionKeyExtractor(item)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={sectionsInitialNumber}
        initialScrollIndex={
          !sections.length
            ? 0
            : sectionIndex < sections.length
            ? sectionIndex
            : sections.length - 1
        }
        getItemCount={getSectionCount}
        windowSize={sectionsWindowSize}
        getItem={(data, index) => data[index]}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            if (
              !mountedRef ||
              !mountedRef.current ||
              info.index === undefined ||
              !sectionsListRef.current
            ) {
              return;
            }
            sectionsListRef.current.scrollToIndex({
              animated: true,
              index: info.index,
            });
          });
        }}
        onViewableItemsChanged={viewableItemsChangeHandler}
        renderItem={({ item: sectionItem, index: sectionItemIndex }) => (
          <View style={[railStyle]}>
            <View style={[headerContainerStyle]}>
              {renderHeader(sectionItem)}
            </View>
            <VirtualizedList
              horizontal
              listKey={sectionItem.sectionIndex?.toString()}
              windowSize={railWindowSize}
              initialNumToRender={sectionItemsInitialNumber}
              getItem={(data, index) => data[index]}
              data={sectionItem.data}
              ref={
                sectionItemIndex === sectionIndex ? railItemsListRef : undefined
              }
              keyExtractor={(sectionItemForKeyExtracting: any) =>
                sectionItemKeyExtractor(sectionItemForKeyExtracting)
              }
              onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 1000));
                wait.then(() => {
                  if (
                    !mountedRef ||
                    !mountedRef.current ||
                    info.index === undefined ||
                    !railItemsListRef.current
                  ) {
                    return;
                  }
                  railItemsListRef.current.scrollToIndex({
                    animated: false,
                    index: info.index,
                  });
                });
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              getItemCount={getSectionItemCount}
              renderItem={({
                index: railItemIndexInList,
                item: railItemInList,
              }) => {
                return renderItem({
                  index: railItemIndexInList,
                  item: railItemInList,
                  section: sectionItem,
                  scrollToRail: scrollToRail(sectionItemIndex),
                  isFirstRail: sectionItemIndex === 0,
                  sectionIndex: sectionItemIndex,
                  railItemIndex: railItemIndexInList,
                  isLastRail: sections.length - 1 === sectionItemIndex,
                  setRailItemRefCb: setRailItemRef,
                  removeRailItemRefCb: removeRailItemRef,
                  hasEndlessScroll: sections.length > 2,
                });
              }}
            />
          </View>
        )}
      />
      <EndlessScroll
        countOfRails={sections.length}
        ref={bottomEndlessScrollRef}
        onFocusCb={() => {
          if (mountedRef.current) {
            scrollToTop.current = true;
            sectionsListRef.current?.scrollToOffset?.({ offset: 0 });
          }
        }}
      />
    </View>
  );
};

export default RailSections;

type TEndlessScrollProps = {
  onFocusCb: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  countOfRails: number;
};

type TEndlessScrollRef = {
  setAccessible?: (isAccessible: boolean) => void;
  getNode?: () => number | null | undefined;
};

const EndlessScroll = forwardRef<TEndlessScrollRef, TEndlessScrollProps>(
  ({ onFocusCb, countOfRails }, ref) => {
    const [accessible, setAccessible] = useState<boolean>(false);
    const touchableRef = useRef<TouchableHighlight>(null);
    const isMounted = useRef<boolean>(false);
    useImperativeHandle(
      ref,
      () => ({
        setAccessible: (isAccessible: boolean) => {
          if (isMounted.current) {
            setAccessible(isAccessible);
          }
        },
        getNode: () => {
          if (isMounted.current) {
            return findNodeHandle(touchableRef.current);
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
    return (
      <TouchableHighlight
        ref={touchableRef}
        accessible={countOfRails > 2 && accessible}
        nextFocusRight={findNodeHandle(touchableRef.current)}
        nextFocusLeft={findNodeHandle(touchableRef.current)}
        nextFocusUp={findNodeHandle(touchableRef.current)}
        nextFocusDown={findNodeHandle(touchableRef.current)}
        onFocus={onFocusCb}>
        <View
          style={{
            height: 1,
            width: '100%',
          }}
        />
      </TouchableHighlight>
    );
  },
);
