// default options;
// isCaseSensitive: false,
// includeScore: false,
// shouldSort: true,
// includeMatches: false,
// findAllMatches: false,
// minMatchCharLength: 1,
// location: 0,
// threshold: 0.6,
// distance: 100,
// useExtendedSearch: false,
// ignoreLocation: false,
// ignoreFieldNorm: false,

export const detailEventsSearchOptions = {
  minMatchCharLength: 2,
  isCaseSensitive: false,
  useExtendedSearch: false,
  keys: [
    {
      name: 'data.vs_event_details.title',
      weight: 0.7,
    },
    {
      name: 'data.vs_title.text',
      weight: 0.5,
    },
  ],
};
