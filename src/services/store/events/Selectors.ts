import Fuse from 'fuse.js';
import { detailEventsSearchOptions } from '@configs/fuseConfig';
import { TEventContainer } from '@services/types/models';
import { myListTitle } from '@configs/myListConfig';
import { removeIdsFromMyList } from '@services/myList';
import {
  homePageWhiteList,
  operaAndMusicWhiteList,
  balletAndDanceWhiteList,
} from '@configs/eventListScreensConfig';
import get from 'lodash.get';
import { continueWatchingRailTitle } from '@configs/bitMovinPlayerConfig';
import { removeItemsFromSavedPositionListByEventIds } from '@services/bitMovinPlayer';

export const digitalEventDetailsSearchSelector = (store: {
  [key: string]: any;
}) =>
  new Fuse(
    Object.values(store.events.allDigitalEventsDetail),
    detailEventsSearchOptions,
  )
    .search<any>(`${store.events.searchQueryString}`)
    .map(({ item }) => item);

export const searchQuerySelector = (store: { [key: string]: any }) =>
  store.events.searchQueryString;

export const digitalEventsForHomePageSelector =
  (myList: Array<string>, continueWatchingList: Array<string>) =>
  (store: { [key: string]: any }) => {
    const eventGroupsArray = Object.entries<{
      title: string;
      ids: Array<string>;
    }>(store.events.eventGroups).filter(([key]) => key in homePageWhiteList);
    const arrayOfIdsForRemoveFromMyList: Array<string> = [];
    const arrayOfIdsForRemoveFromContinueWatchingList: Array<string> = [];
    if (eventGroupsArray.length) {
      eventGroupsArray.unshift(['', { title: myListTitle, ids: myList }]);
      eventGroupsArray.unshift([
        '',
        { title: continueWatchingRailTitle, ids: continueWatchingList },
      ]);
    }

    const eventSections = eventGroupsArray.reduce<
      Array<{
        sectionIndex: number;
        title: string;
        data: Array<TEventContainer>;
      }>
    >((acc, [_, groupInfo], index) => {
      const rail = {
        sectionIndex: index,
        title: groupInfo.title,
        data: groupInfo.ids.reduce<Array<TEventContainer>>((accEvents, id) => {
          if (id in store.events.allDigitalEventsDetail) {
            accEvents.push(store.events.allDigitalEventsDetail[id]);
          } else if (groupInfo.title === myListTitle) {
            arrayOfIdsForRemoveFromMyList.push(id);
          } else if (groupInfo.title === continueWatchingRailTitle) {
            arrayOfIdsForRemoveFromContinueWatchingList.push(id);
          }
          return accEvents;
        }, []),
      };
      if (rail.data.length) {
        acc.push(rail);
      }
      return acc;
    }, []);
    if (store.events.eventsLoaded) {
      removeIdsFromMyList(arrayOfIdsForRemoveFromMyList);
      removeItemsFromSavedPositionListByEventIds(
        arrayOfIdsForRemoveFromContinueWatchingList,
      );
    }

    return { data: eventSections, eventsLoaded: store.events.eventsLoaded };
  };

export const digitalEventsForMyListScreenSelector =
  (myList: Array<string>) => (store: { [key: string]: any }) => {
    const arrayOfIdsForRemoveFromMyList: Array<string> = [];
    const eventListForMyList = myList.reduce<Array<TEventContainer>>(
      (acc, id) => {
        if (id in store.events.allDigitalEventsDetail) {
          acc.push(store.events.allDigitalEventsDetail[id]);
        } else {
          arrayOfIdsForRemoveFromMyList.push(id);
        }
        return acc;
      },
      [],
    );
    if (store.events.eventsLoaded) {
      removeIdsFromMyList(arrayOfIdsForRemoveFromMyList);
    }
    return eventListForMyList;
  };

export const digitalEventsForBalletAndDanceSelector = (store: {
  [key: string]: any;
}) => {
  const eventGroupsArray = Object.entries<{
    title: string;
    ids: Array<string>;
  }>(store.events.eventGroups).filter(
    ([key]) => key in balletAndDanceWhiteList,
  );
  let sectionIndex = 0;
  const eventsWithoutSubtags: {
    sectionIndex: number;
    title: string;
    data: Array<TEventContainer>;
  } = {
    sectionIndex: 0,
    title: '',
    data: [],
  };
  const eventSections = Array.from(
    new Set(
      eventGroupsArray.reduce<Array<string>>((acc, [_, groupInfo]) => {
        acc.push(...groupInfo.ids);
        return acc;
      }, []),
    ),
  ).reduce<{
    [key: string]: {
      sectionIndex: number;
      title: string;
      data: Array<TEventContainer>;
    };
  }>((acc, id) => {
    const event = store.events.allDigitalEventsDetail[id];
    const subtags: Array<{ tag: string }> = get(event.data, 'vs_subtags', []);
    for (let i = 0; i < subtags.length; i++) {
      const subtag = subtags[i].tag || 'without subtag';
      if (subtag in acc) {
        acc[subtag].data.push(store.events.allDigitalEventsDetail[id]);
      } else {
        acc[subtag] = {
          sectionIndex: sectionIndex++,
          title: subtag,
          data: [store.events.allDigitalEventsDetail[id]],
        };
      }
    }
    return acc;
  }, {});
  if (!eventsWithoutSubtags.data.length) {
    return {
      data: Object.values(eventSections),
      eventsLoaded: store.events.eventsLoaded,
    };
  }
  const sections = Object.values(eventSections).map(eventSection => ({
    ...eventSection,
    sectionIndex: ++eventSection.sectionIndex,
  }));
  sections.unshift(eventsWithoutSubtags);
  return { data: sections, eventsLoaded: store.events.eventsLoaded };
};

export const digitalEventsForOperaAndMusicSelector = (store: {
  [key: string]: any;
}) => {
  const eventGroupsArray = Object.entries<{
    title: string;
    ids: Array<string>;
  }>(store.events.eventGroups).filter(([key]) => key in operaAndMusicWhiteList);
  let sectionIndex = 0;
  const eventsWithoutSubtags: {
    sectionIndex: number;
    title: string;
    data: Array<TEventContainer>;
  } = {
    sectionIndex: 0,
    title: '',
    data: [],
  };
  const eventSections = Array.from(
    new Set(
      eventGroupsArray.reduce<Array<string>>((acc, [_, groupInfo]) => {
        acc.push(...groupInfo.ids);
        return acc;
      }, []),
    ),
  ).reduce<{
    [key: string]: {
      sectionIndex: number;
      title: string;
      data: Array<TEventContainer>;
    };
  }>((acc, id) => {
    const event = store.events.allDigitalEventsDetail[id];
    const subtags: Array<{ tag: string }> = get(event.data, 'vs_subtags', []);
    if (!subtags.length) {
      eventsWithoutSubtags.data.push(store.events.allDigitalEventsDetail[id]);
      return acc;
    }
    for (let i = 0; i < subtags.length; i++) {
      const subtag = subtags[i].tag;
      if (subtag in acc) {
        acc[subtag].data.push(store.events.allDigitalEventsDetail[id]);
      } else {
        acc[subtag] = {
          sectionIndex: sectionIndex++,
          title: subtag,
          data: [store.events.allDigitalEventsDetail[id]],
        };
      }
    }
    return acc;
  }, {});

  if (!eventsWithoutSubtags.data.length) {
    return {
      data: Object.values(eventSections),
      eventsLoaded: store.events.eventsLoaded,
    };
  }
  const sections = Object.values(eventSections).map(eventSection => ({
    ...eventSection,
    sectionIndex: ++eventSection.sectionIndex,
  }));
  sections.unshift(eventsWithoutSubtags);
  return { data: sections, eventsLoaded: store.events.eventsLoaded };
};
