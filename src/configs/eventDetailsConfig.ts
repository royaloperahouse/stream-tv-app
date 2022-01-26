import {
  General,
  Cast,
  Creatives,
  Synopsis,
} from '@components/EventDetailsComponents/';

export type TEventDetailsSection = {
  key: string;
  nextSectionTitle: string;
  Component: React.FC<any>;
};

export const eventDetailsSectionsConfig: {
  [key: string]: TEventDetailsSection;
} = {
  general: {
    key: 'general',
    nextSectionTitle: '',
    Component: General,
  },
  cast: {
    key: 'cast',
    nextSectionTitle: 'CAST & MORE',
    Component: Cast,
  },
  creatives: {
    key: 'creatives',
    nextSectionTitle: 'CREATIVES & MORE',
    Component: Creatives,
  },
  synopsis: {
    key: 'synopsis',
    nextSectionTitle: 'SYNOPSIS & MORE',
    Component: Synopsis,
  },
};

const collectionOfEventDetailsSections: Array<TEventDetailsSection> =
  Object.values(eventDetailsSectionsConfig);

export default collectionOfEventDetailsSections;
