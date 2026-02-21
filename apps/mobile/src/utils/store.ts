import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import userReducer from '../utils/slices/user';
import settingsReducer from '../utils/slices/settings';
import mapReducer from '../utils/slices/map';
import nodesReducer from '../utils/slices/nodes';
import sessionReducer from '../utils/slices/session';
import historyReducer from './slices/history';
import pastSessionReducer from './slices/pastSession';
import audioReducer from '../utils/slices/audio';
import listenerMiddleware from './middleware/storeMiddleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings'],
};

const rootReducer = combineReducers({
  user: userReducer,
  settings: settingsReducer,
  map: mapReducer,
  nodes: nodesReducer,
  session: sessionReducer,
  history: historyReducer,
  pastSession: pastSessionReducer,
  audio: audioReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // @ts-expect-error Weird, type file looks like this should be gucci, anyway it works
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
