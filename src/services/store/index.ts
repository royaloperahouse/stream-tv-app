import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { getDefaultMiddleware, configureStore } from '@reduxjs/toolkit';
// reducers
import {
  reducer as authReducer,
  name as authReducerName,
} from '@services/store/auth/Slices';
import {
  reducer as eventsReducer,
  name as eventsReducerName,
} from '@services/store/events/Slices';
import {
  reducer as videoURLsReducer,
  name as videoURLsReducerName,
} from '@services/store/videos/Slices';
import { rootSaga } from '@services/store/rootSaga';

const rootReducer = combineReducers({
  [authReducerName]: authReducer,
  [eventsReducerName]: eventsReducer,
  [videoURLsReducerName]: videoURLsReducer
});

const sagaMiddleware = createSagaMiddleware();
const anyMiddlewares = [sagaMiddleware];
const middlewares = [
  ...getDefaultMiddleware({
    thunk: false,
    serializableCheck: false,
  }),
  ...anyMiddlewares,
];

const enhancers: any[] = [];
export const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
  devTools: __DEV__,
  enhancers: enhancers,
});
export type TRootState = ReturnType<typeof rootReducer>;
sagaMiddleware.run(rootSaga);
