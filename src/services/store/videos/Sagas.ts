import {
  getVideoListLoopStart,
  getVideoListLoopSuccess,
  getVideoListLoopStop,
  getPerformanceVideoURL,
  performanceVideoURLReceived,
  getPerformanceVideoURLError,
} from '@services/store/videos/Slices';

import {
  all,
  call,
  put,
  take,
  takeEvery,
  fork,
  cancel,
} from 'redux-saga/effects';
import { fetchVideoURL } from '@services/apiClient';
import { PayloadAction, ActionCreatorWithoutPayload } from '@reduxjs/toolkit/dist/createAction';
import { logError } from '@utils/loger';
import { Task } from 'redux-saga';
import { bigDelay } from '@utils/bigDelay';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { getVideoDetails } from '@services/prismicApiClient';

export default function* getVideoURLRootSagas() {
  yield all([
     call(getVideoURLWatcher),
     call(getVideoListLoopWatcher)
  ]);
}

function* getVideoURLWatcher() {
  yield takeEvery(getPerformanceVideoURL.toString(), getVideoURLWorker);
}

function* getVideoListLoopWatcher() {
  let task: null | Task = null;
  while (true) {
    const action: ActionCreatorWithoutPayload<string> = yield take([
      getVideoListLoopStart.toString(),
      getVideoListLoopStop.toString(),
    ]);
    if (
      action.type === getVideoListLoopStart.toString() &&
      (!task || !task.isRunning())
    ) {
      task = yield fork(getVideoListLoopWorker);
      continue;
    }

    if (action.type === getVideoListLoopStop.toString() && task) {
      yield cancel(task);
      task = null;
    }
  }
}

function* getVideoURLWorker(action: PayloadAction<string>) {
  try {
    const response: any = yield call(fetchVideoURL, action.payload);
    if (response?.data?.data?.attributes?.hlsManifestUrl) {
      yield put(performanceVideoURLReceived(response?.data?.data?.attributes?.hlsManifestUrl));
    } else if (response?.data?.errors?.length) {
      const errString = response.data.errors[0].title;
      yield put(getPerformanceVideoURLError(errString));
    } else {
      throw Error();
    }
  } catch (err) {
    logError('Something went wrong retrieving video url', err);
    yield put(getPerformanceVideoURLError(err));
  }
}

function* getVideoListLoopWorker(): any {
  console.log('enter loop');
  while (true) {
    console.log('Working!');  
    const result = [];  
    try {
      const initialResponse: ApiSearchResponse = yield call(
        getVideoDetails,
      );
      console.log("Got video details!");
      result.push(...initialResponse.results);
    } catch (err) {
      logError('Something went wrong with the Prismic request')
    }
    if(result.length) {
      yield put(
        getVideoListLoopSuccess("Just testing!")
      );
    }
    yield call(bigDelay, 30 * 60 * 1000);
  }
}