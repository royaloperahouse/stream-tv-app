import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit/src/createAction';
import {
  startLoginLoop,
  endLoginLoop,
  checkDeviceSuccess,
  checkDeviceError,
  checkDeviceStart,
} from '@services/store/auth/Slices';
import {
  getEventListLoopStart,
  //getEventListLoopStop, // fire on logout
} from '@services/store/events/Slices';

import { Task } from 'redux-saga';
import { all, call, cancel, delay, fork, put, take } from 'redux-saga/effects';
import { verifyDevice } from '@services/apiClient';
import { logError } from '@utils/loger';
import { TAuthResponseError } from '@services/types/authReqResp';

export default function* authRootSagas() {
  yield all([call(loginLoopWatcher)]);
}

function* loginLoopWatcher(): any {
  let task: null | Task = null;
  while (true) {
    const action: ActionCreatorWithoutPayload<string> = yield take([
      startLoginLoop.toString(),
      endLoginLoop.toString(),
    ]);
    if (
      action.type === startLoginLoop.toString() &&
      (!task || !task.isRunning())
    ) {
      task = yield fork(loginLoopWorker);
      continue;
    }

    if (action.type === endLoginLoop.toString() && task) {
      yield cancel(task);
      task = null;
    }
  }
}

function* loginLoopWorker(): any {
  let runLoop: boolean = true;
  while (runLoop) {
    yield put(checkDeviceStart());
    try {
      const response: any = yield call(verifyDevice);
      if (response?.data?.data?.attributes?.customerId) {
        runLoop = false;
        yield put(getEventListLoopStart());
        yield put(checkDeviceSuccess(response.data));
      } else if (
        response?.data?.errors?.some(
          (error: TAuthResponseError) => error.detail,
        )
      ) {
        const errObj: TAuthResponseError = response.data.errors.find(
          (error: TAuthResponseError) => error.detail,
        );
        yield put(checkDeviceError(errObj));
      } else {
        throw Error();
      }
    } catch (err) {
      logError('something went wrong', err);
      yield put(checkDeviceError({}));
    }
    yield delay(10000);
  }
}
