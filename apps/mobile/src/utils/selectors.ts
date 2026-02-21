import { RootState } from './store';

export const selectPlaceById = (state: RootState, id: string) =>
  state.nodes.nodes[id];
