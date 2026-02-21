import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import proxyReducer from './slices/proxy';

const rootReducer = combineReducers({
  proxy: proxyReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
