export const detailEventsSearchOptions = {
  minMatchCharLength: 2,
  isCaseSensitive: false,
  useExtendedSearch: false,
  keys: [
    {
      name: 'data.vs_title.text',
      weight: 0.7,
    },
    {
      name: 'data.vs_event_details.title',
      weight: 0.5,
    },
  ],
};
