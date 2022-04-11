import { createSlice } from '@reduxjs/toolkit';

import { TEventContainer } from '@services/types/models';

interface EventsState {
  allDigitalEventsDetail: { [key: string]: TEventContainer };
  eventGroups: { [key: string]: { title: string; ids: string[] } };
  searchQueryString: string;
  eventsLoaded: boolean;
  ppvEventsIds: Array<string>;
  availablePPVEventsIds: Array<string>;
  availablePPVEventsDateOfUpdate: string | null;
}

const initialState: EventsState = {
  allDigitalEventsDetail: {},
  eventGroups: {},
  searchQueryString: '',
  eventsLoaded: false,
  ppvEventsIds: [],
  availablePPVEventsIds: [],
  availablePPVEventsDateOfUpdate: null,
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
    setPPVEventsIds: (state, { payload }) => {
      state.ppvEventsIds = payload.ppvEventsIds;
    },
    clearPPVEventsIds: state => {
      state.ppvEventsIds = [...initialState.ppvEventsIds];
    },
    setAvailablePPVEventsIds: (state, { payload }) => {
      state.availablePPVEventsIds = payload.availablePPVEventsIds;
      state.availablePPVEventsDateOfUpdate =
        payload.availablePPVEventsDateOfUpdate;
    },
    clearAvailablePPVEventsIds: state => {
      state.availablePPVEventsIds = [...initialState.availablePPVEventsIds];
      state.availablePPVEventsDateOfUpdate =
        initialState.availablePPVEventsDateOfUpdate;
    },
    setAvailablePPVEventsDateOfUpdate: (state, { payload }) => {
      state.availablePPVEventsDateOfUpdate =
        payload.availablePPVEventsDateOfUpdate;
    },
    clearAvailablePPVEventsDateOfUpdate: state => {
      state.availablePPVEventsDateOfUpdate =
        initialState.availablePPVEventsDateOfUpdate;
    },
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
  setPPVEventsIds,
  clearPPVEventsIds,
  setAvailablePPVEventsIds,
  clearAvailablePPVEventsIds,
  setAvailablePPVEventsDateOfUpdate,
  clearAvailablePPVEventsDateOfUpdate,
} = eventsSlice.actions;

export const { reducer, name } = eventsSlice;
