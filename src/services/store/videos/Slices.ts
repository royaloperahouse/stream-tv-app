import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/src/createAction';

interface VideoURLsState {
  performanceVideoURLhasLoaded: boolean;
  performanceVideoURL: string;
  performanceVideoURLErrorString: string;
  // TODO: if necessary, handle other types of videos
  // Currently available: trailers and behind-the-scenes videos
}

const initialState: VideoURLsState = {
  performanceVideoURLhasLoaded: false,
  performanceVideoURL: '',
  performanceVideoURLErrorString: ''
};

const videoURLsSlice = createSlice({
  name: 'videoURLs',
  initialState,
  reducers: {
    getPerformanceVideoURL: (state: VideoURLsState, action: PayloadAction<string>) => {
      (state: VideoURLsState) => state
    },
    performanceVideoURLReceived: (state: VideoURLsState, action: PayloadAction<string>) => {
      state.performanceVideoURL = action.payload;
      state.performanceVideoURLhasLoaded = true;
    },
    getPerformanceVideoURLError: (state: VideoURLsState, action: PayloadAction<string>) => {
      state.performanceVideoURLErrorString = action.payload;
      state.performanceVideoURLhasLoaded = false;
    },
  }
});

export const {
  getPerformanceVideoURL,
  performanceVideoURLReceived,
  getPerformanceVideoURLError,
} = videoURLsSlice.actions;

export const { reducer, name } = videoURLsSlice;
