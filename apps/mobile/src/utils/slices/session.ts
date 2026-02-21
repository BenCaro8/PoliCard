import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import TrackPlayer, { Event, RepeatMode } from 'react-native-track-player';
import { getUserSessions } from './history';
import { fetchPlaceNode } from './nodes';
import { apolloClient } from '../apollo';
import { RootState } from '../store';
import { gql } from '@gql';

/*
 * This is Redux Global State since we need efficiency and ability for users to navigate
 * the entire app without losing their session state...
 */
export type State = {
  nodeQueue: string[];
  nodeDisplayOrder: string[];
  currentNode?: string;
  rejectedNodes: string[];
  currentSessionId?: string;
  nonReplayNodes?: string[];
};

const initialState: State = {
  nodeQueue: [],
  nodeDisplayOrder: [],
  rejectedNodes: [],
};

const START_SESSION_MUTATION = gql(`
  mutation StartSession {
    startSession {
      sessionId
    }
  }
`);

const GET_USER_NON_REPLAY_NODES_QUERY = gql(`
  query GetUserNonReplayNodes {
    getUserNonReplayNodes
  }
`);

const UPDATE_SESSION_TITLE_MUTATION = gql(`
  mutation UpdateSessionTitle($sessionId: String!, $title: String!) {
    updateSessionTitle(sessionId: $sessionId, title: $title)
  }
`);

const END_SESSION_MUTATION = gql(`
  mutation EndSession($sessionId: String!) {
    endSession(sessionId: $sessionId)
  }
`);

const ADD_NODE_TO_SESSION_MUTATION = gql(`
  mutation AddSessionNode($sessionId: String!, $nodeId: String!) {
    addSessionNode(sessionId: $sessionId, nodeId: $nodeId)
  }
`);

const MARK_NODE_INTERACTED_MUTATION = gql(`
  mutation MarkNodeInteracted($nodeId: String!) {
    markNodeInteracted(nodeId: $nodeId)
  }
`);

const ENABLE_REPLAY_FOR_USER_NODES_MUTATION = gql(`
  mutation EnableReplayForUserNodes {
    enableReplayForUserNodes
  }
`);

export const startSession = createAsyncThunk(
  'session/startSession',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { data: sessionData } = await apolloClient.mutate({
      mutation: START_SESSION_MUTATION,
    });
    const { data: nonReplayNodesData } = await apolloClient.query({
      query: GET_USER_NON_REPLAY_NODES_QUERY,
      fetchPolicy: 'no-cache',
    });

    dispatch(
      sessionSlice.actions.setCurrentSessionId(
        sessionData?.startSession.sessionId || '',
      ),
    );
    dispatch(
      sessionSlice.actions.setNonReplayNodes(
        state.settings.replayAllNodes
          ? []
          : nonReplayNodesData.getUserNonReplayNodes,
      ),
    );
    return sessionData?.startSession.sessionId;
  },
);

export const updateSessionName = createAsyncThunk(
  'session/updateSessionName',
  async ({ title }: { title: string }, { getState }) => {
    const state = getState() as RootState;
    if (!state.session.currentSessionId) {
      return;
    }

    await apolloClient.mutate({
      mutation: UPDATE_SESSION_TITLE_MUTATION,
      variables: {
        sessionId: state.session.currentSessionId,
        title,
      },
    });
  },
);

export const endSession = createAsyncThunk(
  'session/endSession',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    if (!state.session.currentSessionId) {
      return;
    }
    await apolloClient.mutate({
      mutation: END_SESSION_MUTATION,
      variables: { sessionId: state.session.currentSessionId },
    });
    dispatch(getUserSessions({ page: 1 }));
    dispatch(sessionSlice.actions.clearCurrentSession());
  },
);

export const processPlaceNodes = createAsyncThunk(
  'nodes/processPlaceNodes',
  async (ids: string[], { dispatch, getState }) => {
    const state = getState() as RootState;

    const idsToFetch = ids.filter((id) => !state.nodes.nodes[id]);
    const idsToAdd = ids.filter(
      (id) =>
        ![
          ...state.session.nodeQueue,
          ...state.session.nodeDisplayOrder,
        ].includes(id),
    );
    const fetchPromises = idsToFetch.map((id) =>
      dispatch(
        fetchPlaceNode({
          id,
          name: state.map.placesMap[id]?.tags?.name || '',
          area: state.map.area?.tags?.name || '',
        }),
      ),
    );

    dispatch(sessionSlice.actions.addPlaceNodes(idsToAdd));

    await Promise.all(fetchPromises);

    if (!state.session.currentNode && ids.length > 0) {
      dispatch(playNextTrack());
    }
  },
);

export const addNodeToSession = createAsyncThunk(
  'session/addNodeToSession',
  async (nodeId: string, { getState }) => {
    const state = getState() as RootState;
    const { currentSessionId } = state.session;

    try {
      await apolloClient.mutate({
        mutation: ADD_NODE_TO_SESSION_MUTATION,
        variables: { sessionId: currentSessionId || '', nodeId },
      });
    } catch (error) {
      console.error('Failed to mark node as interacted:', error);
      throw error;
    }
  },
);

export const markNodeInteracted = createAsyncThunk(
  'session/markNodeInteracted',
  async (nodeId: string) => {
    try {
      await apolloClient.mutate({
        mutation: MARK_NODE_INTERACTED_MUTATION,
        variables: { nodeId },
      });
    } catch (error) {
      console.error('Failed to mark node as interacted:', error);
      throw error;
    }
  },
);

export const enableReplayForUserNodes = createAsyncThunk(
  'session/enableReplayForUserNodes',
  async () => {
    await apolloClient.mutate({
      mutation: ENABLE_REPLAY_FOR_USER_NODES_MUTATION,
    });
  },
);

export const playNextTrack = createAsyncThunk(
  'session/playNextTrack',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { currentNode, nonReplayNodes } = state.session;
    const { nodes } = state.nodes;

    if (
      !currentNode ||
      nodes[currentNode].hasAutoPlayed ||
      !Array.isArray(nonReplayNodes)
    )
      return;

    if (nonReplayNodes.includes(currentNode)) {
      dispatch(nextInQueue());
      dispatch(playNextTrack());
      return;
    }

    const track = nodes[currentNode]?.track;
    if (!track) return;

    await TrackPlayer.setRepeatMode(RepeatMode.Off);
    await TrackPlayer.add([track]);
    await TrackPlayer.skipToNext();
    await new Promise((_) => setTimeout(_, 10));
    await TrackPlayer.play();

    const subscription = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      async () => {
        dispatch(nextInQueue());
        subscription.remove();
        dispatch(playNextTrack());
      },
    );
  },
);

export const selectNode = createAsyncThunk(
  'session/selectNode',
  async ({ id }: { id: string }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { nodes } = state.nodes;

    dispatch(setCurrentNode(id));

    const track = nodes[id].track;
    if (track) {
      await TrackPlayer.reset();
      await TrackPlayer.load(track);
    }
  },
);

export const reloadTrack = createAsyncThunk(
  'session/reloadTrack',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { nodes } = state.nodes;
    const { currentNode } = state.session;

    if (currentNode && !(await TrackPlayer.getActiveTrack())) {
      const track = nodes[currentNode].track;
      if (track) {
        await TrackPlayer.reset();
        await TrackPlayer.load(track);
      }
    }
  },
);

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    nextInQueue: (state) => {
      const newCurrentNode = state.nodeQueue.shift();
      state.currentNode = newCurrentNode;
      if (newCurrentNode) {
        state.nodeDisplayOrder.push(newCurrentNode);
      }

      return state;
    },
    setCurrentNode: (state, action: PayloadAction<string>) => {
      state.currentNode = action.payload;
      return state;
    },
    setCurrentSessionId: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
      return state;
    },
    clearCurrentSession: (state) => {
      state = initialState;
      TrackPlayer.reset();
      return state;
    },
    addPlaceNodes: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      ids.map((id) => {
        if (state.currentNode) {
          state.nodeQueue.push(id);
        } else {
          state.currentNode = id;
          state.nodeDisplayOrder.push(id);
        }
      });

      return state;
    },
    setNonReplayNodes: (state, action: PayloadAction<string[]>) => {
      state.nonReplayNodes = action.payload;

      return state;
    },
  },
});

export const {
  nextInQueue,
  setCurrentNode,
  setCurrentSessionId,
  clearCurrentSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
