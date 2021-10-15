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
    nextSectionTitle: 'CAST & MORE',
    Component: General,
  },
  cast: {
    key: 'cast',
    nextSectionTitle: 'CREATIVES & MORE',
    Component: Cast,
  },
  creatives: {
    key: 'creatives',
    nextSectionTitle: 'SYNOPSIS & MORE',
    Component: Creatives,
  },
  synopsis: {
    key: 'synopsis',
    nextSectionTitle: 'INFO & MORE',
    Component: Synopsis,
  },
};

const collectionOfEventDetailsSections: Array<TEventDetailsSection> =
  Object.values(eventDetailsSectionsConfig);

export default collectionOfEventDetailsSections;
