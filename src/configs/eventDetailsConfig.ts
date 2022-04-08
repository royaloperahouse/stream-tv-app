import {
  General,
  Cast,
  Creatives,
  Synopsis,
  AboutProduction,
  Extras,
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
  info: {
    key: 'info',
    nextSectionTitle: 'INFO & MORE',
    Component: AboutProduction,
  },
  extra: {
    key: 'extras',
    nextSectionTitle: 'EXTRAS & MORE',
    Component: Extras,
  },
};

const collectionOfEventDetailsSections: Array<TEventDetailsSection> =
  Object.values(eventDetailsSectionsConfig);

export default collectionOfEventDetailsSections;
