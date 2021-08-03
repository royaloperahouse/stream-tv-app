import Fuse from 'fuse.js';
import { detailEventsSearchOptions } from '@configs/fuseConfig';

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
