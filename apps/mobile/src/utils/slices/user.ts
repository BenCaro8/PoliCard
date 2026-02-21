import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apolloClient } from '../apollo';
import { endSession } from './session';
import { clearMapData } from './map';
import { clearHistory } from './history';
import { User } from '@/__generated__/graphql';
import { gql } from '@gql';

export type State = {
  user?: User;
};

const initialState: State = {};

const LOGOUT_MUTATION = gql(`
  mutation LogoutUser {
    logoutUser
  }
`);

export const endUserLoginSession = createAsyncThunk(
  'user/endUserLoginSession',
  async (_, { dispatch }) => {
    await apolloClient.mutate({
      mutation: LOGOUT_MUTATION,
      fetchPolicy: 'no-cache',
    });

    await dispatch(endSession());
    dispatch(clearUser());
    dispatch(clearMapData());
    dispatch(clearHistory());
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      return state;
    },
    setUserMetadata: (state, action: PayloadAction<User['metadata']>) => {
      if (state.user) state.user.metadata = action.payload;
      return state;
    },
    clearUser: (state) => {
      return { ...state, user: undefined };
    },
  },
});

export const { setUser, setUserMetadata, clearUser } = userSlice.actions;

export default userSlice.reducer;
