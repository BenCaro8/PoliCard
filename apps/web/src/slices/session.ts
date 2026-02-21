import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Role = 'user' | 'admin';

export type User = {
  id: string;
  username: string;
  role: Role;
};

type State = {
  user?: User;
};

const initialState: State = {};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = sessionSlice.actions;

export default sessionSlice.reducer;
