import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@/__generated__/graphql';
import { apolloClient } from '../apollo';
import { gql } from '@gql';
import { RootState } from '../store';

export type State = {
  sessions: Session[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  error?: string;
  isMultiSelectActive: boolean;
  selectedSessions: string[];
};

const initialState: State = {
  sessions: [],
  loading: false,
  page: 1,
  hasMore: false,
  isMultiSelectActive: false,
  selectedSessions: [],
};

const GET_USER_SESSIONS_QUERY = gql(`
  query GetUserSessions($page: Int!, $pageSize: Int!) {
    getUserSessions(page: $page, pageSize: $pageSize) {
      hasMore
      sessions {
        sessionId
        userId
        title
        startTime
        endTime
        createdAt
        updatedAt
        nodes
      }
    }
  }
`);

const DELETE_USER_SESSIONS_MUTATION = gql(`
  mutation DeleteUserSessions($ids: [String!]!) {
    deleteSessions(ids: $ids)
  }
`);

export const getUserSessions = createAsyncThunk(
  'session/getUserSessions',
  async ({ page }: { page: number }, { getState, dispatch }) => {
    dispatch(historySlice.actions.setPage(page));
    const { data } = await apolloClient.query({
      query: GET_USER_SESSIONS_QUERY,
      variables: { page, pageSize: 7 },
      fetchPolicy: 'no-cache',
    });

    if (page === 1) {
      dispatch(
        historySlice.actions.setSessions(data?.getUserSessions.sessions || []),
      );
    } else {
      const state = getState() as RootState;
      dispatch(
        historySlice.actions.setSessions([
          ...state.history.sessions,
          ...(data?.getUserSessions.sessions || []),
        ]),
      );
    }
    dispatch(historySlice.actions.setHasMore(data?.getUserSessions.hasMore));
  },
);

export const deleteUserSessions = createAsyncThunk(
  'session/deleteUserSessions',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const ids = state.history.selectedSessions;
    await apolloClient.mutate({
      mutation: DELETE_USER_SESSIONS_MUTATION,
      variables: { ids },
    });

    dispatch(historySlice.actions.deleteSessions(ids));
  },
);

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
      return state;
    },
    deleteSessions: (state, action: PayloadAction<string[]>) => {
      state.sessions = state.sessions.filter(
        (session) => !action.payload.includes(session.sessionId),
      );
      state.selectedSessions = [];
      state.isMultiSelectActive = false;
      return state;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      return state;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
      return state;
    },
    setIsMultiSelectActive: (state, action: PayloadAction<boolean>) => {
      state.isMultiSelectActive = action.payload;
      return state;
    },
    setSelectedSessions: (state, action: PayloadAction<string[]>) => {
      state.selectedSessions = action.payload;
      return state;
    },
    clearHistory: (state) => {
      state = initialState;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserSessions.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getUserSessions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const {
  setSessions,
  deleteSessions,
  setPage,
  setIsMultiSelectActive,
  setSelectedSessions,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;
