import { TEventVideo } from "@services/types/models";

export const performanceVideoURLErrorSelector = (store: {
  [key: string]: any;
}) => store.videoURLs.performanceVideoURLErrorString;

export const videoListSelector = (store: {
  [key: string]: any;
}) => store.videoURLs.eventVideoList;

export const videoListItemSelector =
  (id: string) => (store: { [key: string]: any }) => {
    const eventVideo = store.videoURLs.eventVideoList.find((eventVideo: TEventVideo) => eventVideo.id === id);
    return eventVideo;
  }