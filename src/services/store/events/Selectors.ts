import Fuse from 'fuse.js';
import { detailEventsSearchOptions } from '@configs/fuseConfig';
import { TEventContainer } from '@services/types/models';
import { myListTitle } from '@configs/myListConfig';
import { removeIdsFromMyList } from '@services/myList';

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
    const eventGropsArray = Object.entries<{
      title: string;
      ids: Array<string>;
    }>(store.events.eventGroups);
    const arrayOfIdsForRemoveFromMyList: Array<string> = [];
    if (myList.length) {
      eventGropsArray.unshift(['', { title: myListTitle, ids: myList }]);
    }
    const eventSections = eventGropsArray.reduce<
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
