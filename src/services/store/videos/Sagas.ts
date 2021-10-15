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
import { TEventVideo } from '@services/types/models';

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
    const id = action.payload;
    const response: any = yield call(fetchVideoURL, id);
    if (response?.data?.data?.attributes?.hlsManifestUrl) {
      yield put(performanceVideoURLReceived(
        {
          url: response?.data?.data?.attributes?.hlsManifestUrl,
          id
        }));
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
  while (true) {
    const result = [];
    const eventVideoList: Array<TEventVideo> = [];
    try {
      const initialResponse: ApiSearchResponse = yield call(
        getVideoDetails,
      );
      result.push(...initialResponse.results);
      // TODO - identical page handling code to events, factor out...
      if (initialResponse.total_pages != initialResponse.page) {
        const allPagesRequestsResult: Array<
          PromiseSettledResult<ApiSearchResponse>
        > = yield call(
          eventPromiseFill,
          initialResponse.page + 1,
          initialResponse.total_pages,
        );
        result.push(
          ...allPagesRequestsResult.reduce<Array<any>>( //todo create type for prismicResult
            (
              acc,
              pageRequestsResult: PromiseSettledResult<ApiSearchResponse>,
            ) => {
              if (pageRequestsResult.status === 'fulfilled') {
                acc.push(...pageRequestsResult.value.results);
              }
              return acc;
            },
            [],
          ),
        );

      }
    } catch (err) {
      logError('Something went wrong with the Prismic request')
    }
    if(result.length) {
      console.log('vids result: ', result);
      eventVideoList.push(
        ...result.reduce((acc: Array<TEventVideo>, video: any, index) => {
          if(video.data?.video?.video_type) {
            const vid = {
              id: video.id,
              video_type: video.data?.video?.video_type,
              performanceVideoURL: ''
            } as TEventVideo;
            acc.push(vid);
          }
          return acc;
        }, []),
      );

      yield put(
        getVideoListLoopSuccess(eventVideoList)
      );
    }
    yield call(bigDelay, 30 * 60 * 1000);
  }

  function eventPromiseFill(
    from: number,
    to: number,
  ): Promise<PromiseSettledResult<ApiSearchResponse>[]> {
    const allPromises: Array<Promise<ApiSearchResponse>> = [];
    for (let i = from; i <= to; i++) {
      allPromises.push(getVideoDetails({ queryOptions: { page: i } }));
    }
    return Promise.allSettled(allPromises);
  }
  
}

