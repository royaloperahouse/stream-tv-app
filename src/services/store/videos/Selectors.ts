export const performanceVideoURLHasLoadedSelector = (store: {
  [key: string]: any 
}) => store.videoURLs.performanceVideoURLhasLoaded;

export const performanceVideoURLSelector = (store: {
  [key: string]: any 
}) => store.videoURLs.performanceVideoURL;

export const performanceVideoURLErrorSelector = (store: {
  [key: string]: any;
}) => store.videoURLs.performanceVideoURLErrorString;

export const videoListSelector = (store: {
  [key: string]: any;
}) => store.videoURLs.eventVideoList;