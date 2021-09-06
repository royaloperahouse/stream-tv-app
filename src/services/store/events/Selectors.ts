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
  (myList: Array<string>) => (store: { [key: string]: any }) => {
    const eventGroupsArray = Object.entries<{
      title: string;
      ids: Array<string>;
    }>(store.events.eventGroups).filter(([key]) => key in homePageWhiteList);
    const arrayOfIdsForRemoveFromMyList: Array<string> = [];
    if (myList.length && eventGroupsArray.length) {
      eventGroupsArray.unshift(['', { title: myListTitle, ids: myList }]);
    }
    const eventSections = eventGroupsArray.reduce<
      Array<{
        sectionIndex: number;
        title: string;
        data: Array<TEventContainer>;
      }>
    >((acc, [_, groupInfo], index) => {
      acc.push({
        sectionIndex: index,
        title: groupInfo.title,
        data: groupInfo.ids.reduce<Array<TEventContainer>>((accEvents, id) => {
          if (id in store.events.allDigitalEventsDetail) {
            accEvents.push(store.events.allDigitalEventsDetail[id]);
          } else if (groupInfo.title === myListTitle) {
            arrayOfIdsForRemoveFromMyList.push(id);
          }
          return accEvents;
        }, []),
      });
      return acc;
    }, []);
    if (store.events.eventsLoaded) {
      removeIdsFromMyList(arrayOfIdsForRemoveFromMyList);
    }
    return eventSections;
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
    const genres: Array<{ tag: string }> = get(event.data, 'vs_genres', []);
    for (let i = 0; i < genres.length; i++) {
      const genre = genres[i].tag || 'without genre';
      if (genre in acc) {
        acc[genre].data.push(store.events.allDigitalEventsDetail[id]);
      } else {
        acc[genre] = {
          sectionIndex: sectionIndex++,
          title: genre,
          data: [store.events.allDigitalEventsDetail[id]],
        };
      }
    }
    return acc;
  }, {});
  return Object.values(eventSections);
};

export const digitalEventsForOperaAndMusicSelector = (store: {
  [key: string]: any;
}) => {
  const eventGroupsArray = Object.entries<{
    title: string;
    ids: Array<string>;
  }>(store.events.eventGroups).filter(([key]) => key in operaAndMusicWhiteList);
  let sectionIndex = 0;
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
    const genres: Array<{ tag: string }> = get(event.data, 'vs_genres', []);
    for (let i = 0; i < genres.length; i++) {
      const genre = genres[i].tag || 'without genre';
      if (genre in acc) {
        acc[genre].data.push(store.events.allDigitalEventsDetail[id]);
      } else {
        acc[genre] = {
          sectionIndex: sectionIndex++,
          title: genre,
          data: [store.events.allDigitalEventsDetail[id]],
        };
      }
    }
    return acc;
  }, {});
  return Object.values(eventSections);
};
