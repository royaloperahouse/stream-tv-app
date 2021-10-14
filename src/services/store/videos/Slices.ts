import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/src/createAction';

interface VideoState {
  performanceVideoURLhasLoaded: boolean;
  performanceVideoURL: string;
  performanceVideoURLErrorString: string;
  videosLoaded: boolean;
  // TODO: if necessary, handle other types of videos
  // Currently available: trailers and behind-the-scenes videos
}

const initialState: VideoState = {
  performanceVideoURLhasLoaded: false,
  performanceVideoURL: '',
  performanceVideoURLErrorString: '',
  videosLoaded: false
};

const videoURLsSlice = createSlice({
  name: 'videoURLs',
  initialState,
  reducers: {
    getVideoListLoopStart: (state: VideoState) => {
      (state: VideoState) => state
    },
    getVideoListLoopStop: (state: VideoState) => {
      (state: VideoState) => state
    },
    getVideoListLoopSuccess: (state: VideoState, action: PayloadAction<string>)  => {
      console.log("payload action: ", action.payload);
      state.videosLoaded = true;
    },
    getPerformanceVideoURL: (state: VideoState, action: PayloadAction<string>) => {
      (state: VideoState) => state
    },
    performanceVideoURLReceived: (state: VideoState, action: PayloadAction<string>) => {
      state.performanceVideoURL = action.payload;
      state.performanceVideoURLhasLoaded = true;
    },
    getPerformanceVideoURLError: (state: VideoState, action: PayloadAction<string>) => {
      state.performanceVideoURLErrorString = action.payload;
      state.performanceVideoURLhasLoaded = false;
    },
  }
});

export const {
  getVideoListLoopStart,
  getVideoListLoopSuccess,
  getVideoListLoopStop,
  getPerformanceVideoURL,
  performanceVideoURLReceived,
  getPerformanceVideoURLError,
} = videoURLsSlice.actions;

export const { reducer, name } = videoURLsSlice;
