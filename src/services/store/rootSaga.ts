import { all, call } from 'redux-saga/effects';
import authFlowSagas from './auth/Sagas';
import eventRootSagas from './events/Sagas';

export function* rootSaga() {
  console.log('Root Saga Run');
  yield all([call(authFlowSagas), call(eventRootSagas)]);
}
