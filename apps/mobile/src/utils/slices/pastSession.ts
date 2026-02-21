import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addNodes, NodeData } from './nodes';
import { apolloClient } from '../apollo';
import TrackPlayer, { Track } from 'react-native-track-player';
import { RootState } from '../store';
import { gql } from '@gql';

export type State = {
  nodeDisplayOrder: string[];
  currentNode?: string;
  currentSessionId?: string;
};

const initialState: State = {
  nodeDisplayOrder: [],
};

const GET_USER_SESSION_NODES_QUERY = gql(`
  query GetUserSessionNodes($sessionId: String!, $page: Int!, $pageSize: Int!) {
    getUserSessionNodes(sessionId: $sessionId, page: $page, pageSize: $pageSize) {
      nodes {
        nodeId
        title
        type
        location
        primaryImageUrl
        text
        audioUrl
        followOn
      }
      hasMore
    }
  }
`);

export const fetchPastSessionNodes = createAsyncThunk(
  'pastSession/fetchPastSessionNodes',
  async (
    { sessionId, page }: { sessionId: string; page: number },
    { dispatch },
  ) => {
    const { data } = await apolloClient.query({
      query: GET_USER_SESSION_NODES_QUERY,
      variables: { sessionId, page, pageSize: 3 },
      fetchPolicy: 'no-cache',
    });

    const nodeIds: string[] = [];

    const nodeData: { [id: string]: NodeData } =
      data.getUserSessionNodes.nodes.reduce((acc, node) => {
        const id = node.nodeId;
        nodeIds.push(id);
        const track: Track = {
          id,
          url: node.audioUrl || '',
          title: node.title || 'Pocketnaut Audio',
          artist: 'Pocketnaut',
        };
        return { ...acc, [node.nodeId]: { ...node, track } };
      }, {});

    dispatch(addNodes(nodeData));

    dispatch(pastSessionSlice.actions.pushNodeDisplayOrder(nodeIds));
  },
);

export const selectNode = createAsyncThunk(
  'pastSession/selectNode',
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

export const pastSessionSlice = createSlice({
  name: 'pastSession',
  initialState,
  reducers: {
    setCurrentNode: (state, action: PayloadAction<string>) => {
      state.currentNode = action.payload;
      return state;
    },
    setCurrentSessionId: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
      return state;
    },
    pushNodeDisplayOrder: (state, action: PayloadAction<string[]>) => {
      state.nodeDisplayOrder = action.payload;
      return state;
    },
    resetPastSessionData: (state) => {
      state = initialState;
      TrackPlayer.reset();

      return state;
    },
  },
});

export const {
  setCurrentNode,
  setCurrentSessionId,
  pushNodeDisplayOrder,
  resetPastSessionData,
} = pastSessionSlice.actions;

export default pastSessionSlice.reducer;
