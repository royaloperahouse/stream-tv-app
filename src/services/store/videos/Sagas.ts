import {
  getPerformanceVideoURL,
  performanceVideoURLReceived,
  getPerformanceVideoURLError,
} from '@services/store/videos/Slices';

import {
  all,
  call,
  put,
  takeEvery,
} from 'redux-saga/effects';
import { fetchVideoURL } from '@services/apiClient';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { logError } from '@utils/loger';

export default function* getVideoURLRootSagas() {
   yield all([call(getVideoURLWatcher)]);
}

function* getVideoURLWatcher() {
  yield takeEvery(getPerformanceVideoURL.toString(), getVideoURLWorker);
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
    logError('Something went wrong', err);
    yield put(yield put(getPerformanceVideoURLError(err)));
  }
}