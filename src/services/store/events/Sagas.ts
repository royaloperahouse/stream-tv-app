import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import {
  getEventListLoopStart,
  getEventListSuccess,
  getEventListLoopStop,
} from '@services/store/events/Slices';
import { Task } from 'redux-saga';
import { all, call, cancel, delay, fork, put, take } from 'redux-saga/effects';
import { logError, log } from '@utils/loger';
import { getDigitalEventDetails } from '@services/prismicApiClient';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

export default function* eventRootSagas() {
  yield all([call(getEventListLoopWatcher)]);
}

function* getEventListLoopWatcher() {
  let task: null | Task = null;
  while (true) {
    const action: ActionCreatorWithoutPayload<string> = yield take([
      getEventListLoopStart.toString(),
      getEventListLoopStop.toString(),
    ]);
    if (
      action.type === getEventListLoopStart.toString() &&
      (!task || !task.isRunning())
    ) {
      task = yield fork(getEventListLoopWorker);
      continue;
    }

    if (action.type === getEventListLoopStop.toString() && task) {
      yield cancel(task);
      task = null;
    }
  }
}

function* getEventListLoopWorker(): any {
  while (true) {
    const result = [];
    const eventIdsForHomePage: Array<string> = [];
    try {
      const initialResponse: ApiSearchResponse = yield call(
        getDigitalEventDetails,
      );
      result.push(...initialResponse.results);
      if (initialResponse.total_pages !== initialResponse.page) {
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
                acc.push(pageRequestsResult.value.results);
              }
              return acc;
            },
            [],
          ),
        );
      }
      eventIdsForHomePage.push(
        ...result.reduce((acc, event: any, index) => {
          if (index % 2 === 0) {
            acc.push(event.id);
          }
          return acc;
        }, []),
      );
    } catch (err) {
      logError('something went wrong with prismic request', err);
    }
    if (result.length) {
      const resultForDigitalEventsDitailUpdate = groupDigitalEvents(result);
      resultForDigitalEventsDitailUpdate.eventIdsForHomePage =
        eventIdsForHomePage;
      yield put(
        getEventListSuccess({
          digitalEventDetailsList: resultForDigitalEventsDitailUpdate,
        }),
      );
    }
    yield call(bigDelay, 30 * 60 * 1000);
  }
}

function eventPromiseFill(
  from: number,
  to: number,
): Promise<PromiseSettledResult<ApiSearchResponse>[]> {
  const allPromises: Array<Promise<ApiSearchResponse>> = [];
  for (let i = from; i <= to; i++) {
    allPromises.push(getDigitalEventDetails({ queryOptions: { page: i } }));
  }
  return Promise.allSettled(allPromises);
}

function groupDigitalEvents(digitalEventsDetail: Array<any>): any {
  return digitalEventsDetail.reduce<any>(
    (acc, digitalEventDetail) => {
      acc.allDigitalEventsDitail[digitalEventDetail.id] = {
        id: digitalEventDetail.id,
        last_publication_date: digitalEventDetail.last_publication_date,
        data: digitalEventDetail.data,
      };
      const groupKeys: Array<string> =
        digitalEventDetail.data.vs_event_details.tags.reduce<Array<string>>(
          (acc, tag) => {
            const key = tag.attributes.title
              .toLowerCase()
              .trim()
              .replace(/\s/g, '_');
            acc.push(key);
            return acc;
          },
          [],
        );
      for (let i = 0; i < groupKeys.length; i++) {
        if (groupKeys[i] in acc.eventGroups) {
          acc.eventGroups[groupKeys[i]].push(digitalEventDetail.id);
        } else {
          acc.eventGroups[groupKeys[i]] = [digitalEventDetail.id];
        }
      }
      return acc;
    },
    {
      allDigitalEventsDitail: {},
      eventGroups: {},
    },
  );
}

function* bigDelay(seconds: number) {
  const sec: number = Math.ceil(seconds / 10000);
  for (let i = 0; i < sec; i++) {
    yield delay(10000);
  }
}
