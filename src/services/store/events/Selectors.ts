import Fuse from 'fuse.js';
import { detailEventsSearchOptions } from '@configs/fuseConfig';
import { TEventContainer } from '@services/types/models';
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

export const digitalEventsForHomePageSelector = (store: {
  [key: string]: any;
}) =>
  Object.entries<{ title: string; ids: Array<string> }>(
    store.events.eventGroups,
  ).reduce<
    Array<{ sectionIndex: number; title: string; data: Array<TEventContainer> }>
  >((acc, [_, groupInfo], index) => {
    acc.push({
      sectionIndex: index,
      title: groupInfo.title,
      data: groupInfo.ids.reduce<Array<TEventContainer>>((accEvents, id) => {
        if (id in store.events.allDigitalEventsDetail) {
          accEvents.push(store.events.allDigitalEventsDetail[id]);
        }
        return accEvents;
      }, []),
    });
    return acc;
  }, []);
