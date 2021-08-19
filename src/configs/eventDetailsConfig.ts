import {
  General,
  CastAndCreatives,
  Synopsis,
} from '@components/EventDetailsComponents/';

export type TEventDitailsSection = {
  key: string;
  nextSectionTitle: string;
  Component: React.FC<any>;
};

export const eventDetailsSectionsConfig: {
  [key: string]: TEventDitailsSection;
} = {
  general: {
    key: 'general',
    nextSectionTitle: 'CAST & MORE',
    Component: General,
  },
  castAndCreatives: {
    key: 'castAndCreatives',
    nextSectionTitle: 'SYNOPSIS & MORE',
    Component: CastAndCreatives,
  },
  synopsis: {
    key: 'synopsis',
    nextSectionTitle: 'INFO & MORE',
    Component: Synopsis,
  },
};

const collectionOfEventDetailsSections: Array<TEventDitailsSection> =
  Object.values(eventDetailsSectionsConfig);

export default collectionOfEventDetailsSections;
