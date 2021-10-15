import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import {
  TEventContainer,
  TVSEventDetailsCast,
} from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import TouchableHighlightWrapper from '@components/TouchableHighlightWrapper';
import MultiColumnRoleNameList, { TMultiColumnRoleNameListRef } from '../commonControls/MultiColumnRoleNameList';
import { Colors } from '@themes/Styleguide';

type CastProps = {
  event: TEventContainer;
  nextScreenText: string;
  scrollToMe: () => void;
};

const MAX_NUM_COLUMNS = 3;

const Cast: React.FC<CastProps> = ({
  event,
  nextScreenText,
  scrollToMe,
}) => {
  const [active, toggleActive] = useState(false);
  const [numColumns, setNumColumns] = useState(1);
  const [shouldShowHasMore, setShouldShowHasMore] = useState(true);
  const columnContainerRef = useRef<TMultiColumnRoleNameListRef>(null);
  const accumulatedHeight = useRef(0);
  const containerHeight = useRef(0);

  const castList: Array<TVSEventDetailsCast> = get(
    event.data,
    ['vs_event_details', 'cast'],
    [],
  );
  const listOfEvalableCasts = castList.reduce<{ [key: string]: string }>(
    (acc, cast) => {
      const role = get(cast, ['attributes', 'role'], '');
      const name = get(cast, ['attributes', 'name'], '');
      if (!name) {
        return acc;
      }
      if (role && role in acc) {
        acc[role] += `, ${name}`;
      } else {
        acc[role] = name;
      }
      return acc;
    },
    {},
  );
  let data: Array<{role: string, name: string}> = [];
  Object.entries(listOfEvalableCasts).map(([role, name]) => data.push({ role, name }));

  const scroll = () => {
    if(!active) {
      if(columnContainerRef.current) {
        columnContainerRef.current.scrollToEnd && columnContainerRef.current.scrollToEnd();
      }
    } else {
      if(columnContainerRef.current) {
        columnContainerRef.current.scrollToTop && columnContainerRef.current.scrollToTop();
      }
    }
  }

  const accumulateHeight = (height: number) => {
    accumulatedHeight.current += height;
    if(containerHeight.current > 0 && accumulatedHeight.current > containerHeight.current) {
      incrementColumns();
      accumulatedHeight.current = 0;
    }
  }

  const setContainerHeight = (height: number) => {
    if(containerHeight.current == 0) containerHeight.current = height
  }
  
  const incrementColumns = () => {
    setNumColumns(Math.min(numColumns + 1, MAX_NUM_COLUMNS));
  }

  const updateReachedEnd = (distanceFromEnd: number) => {
    setShouldShowHasMore(false);
  }

  return (
    <TouchableHighlightWrapper
      onPress={() => {
          toggleActive(!active);
          scroll();
      }}
      >
      <View style={styles.generalContainer}>
        <View style={styles.wrapper}>
          <RohText style={styles.title}>Cast</RohText>
          <View style={active && shouldShowHasMore ? styles.highlightActive : styles.highlightHidden} />
            <View style={styles.castContainer}>
              <View style={styles.columnContainer}>
                <MultiColumnRoleNameList
                  numColumns={numColumns}
                  key={numColumns}
                  data={data}
                  ref={columnContainerRef}
                  setItemHeight={height => accumulateHeight(height)}
                  setContainerHeight={height => setContainerHeight(height)}
                  setReachedEnd={(distanceFromEnd) => updateReachedEnd(distanceFromEnd)}
                />
                {shouldShowHasMore && <RohText style={styles.hasMore}>Press select for more...</RohText>}
              </View>
            </View>
          </View>
        <View style={styles.downContainer}>
          <GoDown text={nextScreenText} scrollToMe={scrollToMe} />
        </View>
      </View>
    </TouchableHighlightWrapper>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    paddingRight: scaleSize(200),
  },
  wrapper: {
    marginTop: scaleSize(110),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: scaleSize(50),
    marginBottom: scaleSize(60),
  },
  title: {
    flex: 1,
    color: Colors.title,
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
  },
  castContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnTitle: {
    color: Colors.title,
    fontSize: scaleSize(26),
    textTransform: 'uppercase',
    marginBottom: scaleSize(20),
  },
  highlightActive: {
    position: 'absolute',
    left: scaleSize(720),
    width: scaleSize(960),
    height: scaleSize(900),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.defaultBlue,
    borderWidth: 5
  },
  highlightHidden: {
    display: 'none'
  },
  columnContainer: {
    flex: 1,
  },
  hasMore: {
    color: Colors.defaultTextColor,
    opacity: 0.8,
    position: 'absolute',
    bottom: scaleSize(10),
    alignSelf: 'center',
    backgroundColor: Colors.backgroundColorTransparent
  }
});

export default Cast;