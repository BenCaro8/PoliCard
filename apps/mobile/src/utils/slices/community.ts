import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { apolloClient } from '../apollo';
// import { COMMUNITY_CARD_FRAGMENT } from '@/src/components/CommunityCard';
// import { gql } from '@gql';

export type State = {
  nodeIds: string[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  error?: string;
};

const initialState: State = {
  nodeIds: [],
  loading: false,
  page: 1,
  hasMore: false,
};

// const GET_POPULAR_NODES_QUERY = gql(`
//   query GetPopularNodes($page: Int!, $pageSize: Int!) {
//     getPopularNodes(page: $page, pageSize: $pageSize) {
//       nodeId
//       title
//       type
//       location
//       primaryImageUrl
//       text
//       audioUrl
//       followOn
//     }
//   }
// `);

// const GET_NEWEST_NODES_QUERY = gql(`
//   query GetNewestNodes($page: Int!, $pageSize: Int!) {
//     getNewestNodes(page: $page, pageSize: $pageSize) {
//       nodes {
//         nodeId
//         ...CommunityCard
//       }
//       hasMore
//     }
//   }

//   ${COMMUNITY_CARD_FRAGMENT}
// `);

// export const getNewestNodes = createAsyncThunk(
//   'community/getNewestNodes',
//   async ({ page }: { page: number }, { dispatch }) => {
//     const { data } = await apolloClient.query({
//       query: GET_NEWEST_NODES_QUERY,
//       variables: { page, pageSize: 6 },
//       fetchPolicy: 'no-cache',
//     });

//     const nodeIds = data?.getNewestNodes?.nodes.map((node) => node.nodeId);

//     dispatch(communitySlice.actions.pushNodeIds(nodeIds || []));
//     dispatch(
//       communitySlice.actions.setHasMore(!!data?.getNewestNodes?.hasMore),
//     );
//   },
// );

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setNodeIds: (state, action: PayloadAction<string[]>) => {
      state.nodeIds = action.payload;
      return state;
    },
    pushNodeIds: (state, action: PayloadAction<string[]>) => {
      state.nodeIds = [...state.nodeIds, ...action.payload];
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
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getNewestNodes.pending, (state) => {
  //       state.loading = true;
  //     })
  //     .addCase(getNewestNodes.fulfilled, (state) => {
  //       state.loading = false;
  //     })
  //     .addCase(getNewestNodes.rejected, (state, action) => {
  //       state.error = action.payload as string;
  //       state.loading = false;
  //     });
  // },
});

export const { setNodeIds, pushNodeIds, setPage, setHasMore } =
  communitySlice.actions;

export default communitySlice.reducer;
