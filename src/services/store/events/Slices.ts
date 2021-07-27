import { createSlice } from '@reduxjs/toolkit';

import { EventModel } from '@services/types/models';

interface EventsState {
  myList: Array<EventModel>;
  featured: Array<EventModel>;
  allDigitalEventsDitail: { [key: string]: any };
  eventGroups: { [key: string]: [string] };
  digitalEventDitailsIdsForHomePage: Array<string>;
}

const initialState: EventsState = {
  myList: [],
  featured: [],
  allDigitalEventsDitail: {},
  eventGroups: {},
  digitalEventDitailsIdsForHomePage: [],
};

initialState.myList = [
  {
    id: 1001,
    title: 'Covent Garden Legends',
    type: 'Tours',
    captionText: 'This tour lasts about 1 hour 15 minutes',
    shortDescription:
      'Step back into history and discover more about the Royal Opera House and the legends of London’s Covent Garden.',
    description:
      'Step back into history and discover more about the Royal Opera House and the legends of London’s Covent Garden.',
    thumbnailImage:
      'https://static.roh.org.uk/tours/covent-garden-legends-and-landmarks-tour/images/result-mobile.jpg',
    previewImage:
      'https://static.roh.org.uk/events/tours/covent-garden-legends-and-landmarks-tour/event-header.jpg',
    info: '2Hrs 55 Mins, 2 intervals   2013   12+',
    cast: [
      { role: 'Princess Turandot', name: 'Lise Lindstrom' },
      { role: 'The unknown Prince', name: 'Marco Berti' },
    ],
    creatives: [
      { role: 'Music', name: 'Lise Lindstrom' },
      { role: 'Director', name: 'Marco Berti' },
    ],
  },
  {
    id: 1002,
    title: 'Friends Rehearsals',
    type: 'Ballet and dance',
    captionText: 'Multiple venues',
    shortDescription:
      'Friends of Covent Garden have the opportunity to purchase tickets to open rehearsals.',
    description:
      'Friends of Covent Garden have the opportunity to purchase tickets to open rehearsals.',
    thumbnailImage:
      'https://static.roh.org.uk/rehearsals/friends-rehearsals/images/result-thumbnail.jpg',
    previewImage:
      'https://static.roh.org.uk/events/friends-rehearsals/event-header.jpg',
    info: '2Hrs 55 Mins, 2 intervals   2013   12+',
    cast: [
      { role: 'Princess Turandot', name: 'Lise Lindstrom' },
      { role: 'The unknown Prince', name: 'Marco Berti' },
    ],
    creatives: [
      { role: 'Music', name: 'Lise Lindstrom' },
      { role: 'Director', name: 'Marco Berti' },
    ],
  },
  {
    id: 1003,
    title: 'Balanchine and Robbins',
    type: 'Ballet and dance',
    captionText: 'Online only',
    shortDescription:
      'The Royal Ballet celebrate the rich history of American ballet as they perform classic works by George Balanchine and Jerome Robbins. Available to watch via ROH Stream.',
    description:
      'The Royal Ballet celebrate the rich history of American ballet as they perform classic works by George Balanchine and Jerome Robbins. Available to watch via ROH Stream.',
    thumbnailImage:
      'https://static.roh.org.uk/productions/balanchine-and-robbins/images/result-thumbnail.jpg',
    previewImage:
      'https://vhx.imgix.net/roh/assets/d6c49d80-ee5f-45ee-8398-cd2bbeb8f1c1-eb248809.jpg?auto=format%2Ccompress&fit=crop&h=360&w=640',
    info: '2Hrs 55 Mins, 2 intervals   2013   12+',
    cast: [
      { role: 'Princess Turandot', name: 'Lise Lindstrom' },
      { role: 'The unknown Prince', name: 'Marco Berti' },
    ],
    creatives: [
      { role: 'Music', name: 'Lise Lindstrom' },
      { role: 'Director', name: 'Marco Berti' },
    ],
  },
  {
    id: 1004,
    title: 'La bohème',
    type: 'Opera and music',
    captionText: 'The performance will last approximately 2 hours 25 minutes',
    shortDescription:
      "Puccini's opera of passion, friendship and heartbreak – one of the best-loved operas worldwide.",
    description:
      "Puccini's opera of passion, friendship and heartbreak – one of the best-loved operas worldwide.",
    thumbnailImage:
      'https://static.roh.org.uk/productions/la-boheme-by-dan-dooner/images/result-thumbnail.jpg',
    previewImage:
      'https://static.roh.org.uk/productions/la-boheme-by-dan-dooner/images/event-details.jpg',
    info: '2Hrs 55 Mins, 2 intervals   2013   12+',
    cast: [
      { role: 'Princess Turandot', name: 'Lise Lindstrom' },
      { role: 'The unknown Prince', name: 'Marco Berti' },
    ],
    creatives: [
      { role: 'Music', name: 'Lise Lindstrom' },
      { role: 'Director', name: 'Marco Berti' },
    ],
  },
];
initialState.featured = initialState.myList.reverse();

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    getEventListLoopStart: state => state,
    getEventListSuccess: (state, { payload }) => {
      state.allDigitalEventsDitail =
        payload.digitalEventDetailsList.allDigitalEventsDitail;
      state.eventGroups = payload.digitalEventDetailsList.eventGroups;
      state.digitalEventDitailsIdsForHomePage =
        payload.digitalEventDetailsList.eventIdsForHomePage;
    },
    getEventListLoopStop: state => state,
  },
});

export const {
  getEventListLoopStart,
  getEventListSuccess,
  getEventListLoopStop,
} = eventsSlice.actions;

export const { reducer, name } = eventsSlice;
