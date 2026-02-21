import { createListenerMiddleware, createAction } from '@reduxjs/toolkit';
import {
  addNodeToSession,
  endSession,
  markNodeInteracted,
  startSession,
} from '../slices/session';
import { clearMapData } from '../slices/map';
import { getUserSessions } from '../slices/history';
import { RootState } from '../store';
import { fetchPastSessionNodes } from './../slices/pastSession';

export const startSessionTrigger = createAction('session/startSessionTrigger');

export const endSessionTrigger = createAction('session/endSessionTrigger');

export const historyLoadTrigger = createAction('history/historyLoadTrigger');

export const communityLoadTrigger = createAction(
  'community/communityLoadTrigger',
);

export const startPastSessionTrigger = createAction<{
  sessionId: string;
  page: number;
}>('session/startPastSessionTrigger');

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: startSessionTrigger,
  effect: async (_, listenerApi) => {
    const currentState = listenerApi.getState() as RootState;

    if (!currentState.session.currentSessionId) {
      await listenerApi.dispatch(startSession());
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: endSessionTrigger,
  effect: async (_, listenerApi) => {
    await listenerApi.dispatch(endSession());
    listenerApi.dispatch(clearMapData());
  },
});

listenerMiddleware.startListening({
  actionCreator: historyLoadTrigger,
  effect: async (_, listenerApi) => {
    const currentState = listenerApi.getState() as RootState;

    if (!currentState.history.sessions.length) {
      await listenerApi.dispatch(getUserSessions({ page: 1 }));
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: startPastSessionTrigger,
  effect: async (action, listenerApi) => {
    const { sessionId, page } = action.payload;

    await listenerApi.dispatch(fetchPastSessionNodes({ sessionId, page }));
  },
});

listenerMiddleware.startListening({
  predicate: (_, currentStateArg, previousStateArg) => {
    const currentState = currentStateArg as RootState;
    const previousState = previousStateArg as RootState;
    const currentNode = currentState.session.currentNode;
    return !!currentNode && currentNode !== previousState.session.currentNode;
  },
  effect: async (_, listenerApi) => {
    const currentState = listenerApi.getState() as RootState;
    const { currentNode, currentSessionId, nonReplayNodes } =
      currentState.session;

    if (
      currentSessionId &&
      currentNode &&
      !nonReplayNodes?.includes(currentNode)
    ) {
      listenerApi.dispatch(markNodeInteracted(currentNode));
      listenerApi.dispatch(addNodeToSession(currentNode));
    }
  },
});

export default listenerMiddleware;
