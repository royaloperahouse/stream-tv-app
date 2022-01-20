import { createSlice } from '@reduxjs/toolkit';

import { TEventContainer } from '@services/types/models';

interface EventsState {
  allDigitalEventsDetail: { [key: string]: TEventContainer };
  eventGroups: { [key: string]: { title: string; ids: string[] } };
  searchQueryString: string;
  eventsLoaded: boolean;
}

const initialState: EventsState = {
  allDigitalEventsDetail: {},
  eventGroups: {},
  searchQueryString: '',
  eventsLoaded: false,
};
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    getEventListLoopStart: state => state,
    getEventListSuccess: (state, { payload }) => {
      state.allDigitalEventsDetail =
        payload.digitalEventDetailsList.allDigitalEventsDetail;
      state.eventGroups = payload.digitalEventDetailsList.eventGroups;
      state.eventsLoaded = true;
    },
    getEventListLoopStop: state => state,
    setSearchQuery: (state, { payload }) => {
      if (payload.searchQuery.length) {
        state.searchQueryString += payload.searchQuery;
      } else {
        state.searchQueryString = state.searchQueryString.length
          ? state.searchQueryString.substr(
              0,
              state.searchQueryString.length - 1,
            )
          : state.searchQueryString;
      }
    },
    setFullSearchQuery: (state, { payload }) => {
      state.searchQueryString = payload.searchQuery;
    },
    clearSearchQuery: state => {
      state.searchQueryString = { ...initialState }.searchQueryString;
    },
    saveSearchResultQuery: state => state,
    clearEventState: () => ({ ...initialState }),
  },
});

export const {
  getEventListLoopStart,
  getEventListSuccess,
  getEventListLoopStop,
  setSearchQuery,
  clearSearchQuery,
  setFullSearchQuery,
  saveSearchResultQuery,
  clearEventState,
} = eventsSlice.actions;

export const { reducer, name } = eventsSlice;
