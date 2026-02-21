import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Track } from 'react-native-track-player';
import { Node, NodeImage } from '@/__generated__/graphql';
import { apolloClient } from '../apollo';
import { gql } from '@gql';

export type NodeData = Partial<Node> & {
  hasAutoPlayed?: boolean;
  loading?: boolean;
  error?: string;
  track?: Track;
  images?: NodeImage[];
};

type State = {
  nodes: { [id: string]: NodeData };
};

const initialState: State = {
  nodes: {},
};

const DELETE_IMAGE_MUTATION = gql(`
  mutation deleteImage($id: ID!) {
    deleteImage(id: $id)
  }
`);

const GET_IMAGES_QUERY = gql(`
  query GetImages($nodeId: String!, $limit: Int, $offset: Int) {
    getImages(nodeId: $nodeId, limit: $limit, offset: $offset) {
      imageId
      nodeId
      imageUrl
      uploadedBy
      uploadedAt
    }
  }
`);

const GET_PLACE_NODE_MUTATION = gql(`
  mutation GetPlaceNode($id: String!, $name: String!, $area: String!) {
    getPlaceNode(id: $id, name: $name, area: $area) {
      nodeId
      title
      type
      location
      primaryImageUrl
      text
      audioUrl
      followOn
    }
  }
`);

export const fetchPlaceNode = createAsyncThunk(
  'nodes/fetchPlaceNode',
  async (
    { id, name, area }: { id: string; name: string; area: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: GET_PLACE_NODE_MUTATION,
        variables: { id, name, area },
      });

      return { id, ...data?.getPlaceNode };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchNodeImages = createAsyncThunk(
  'nodes/fetchNodeImages',
  async (
    {
      nodeId,
      limit,
      offset,
    }: { nodeId: string; limit: number; offset: number },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: GET_IMAGES_QUERY,
        variables: { nodeId, limit, offset },
        fetchPolicy: 'network-only',
      });

      dispatch(
        nodesSlice.actions.setNodeImages({
          nodeId,
          images: data?.getImages || [],
        }),
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteNodeImage = createAsyncThunk(
  'nodes/deleteNodeImage',
  async (
    { imageId, nodeId }: { imageId: string; nodeId: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_IMAGE_MUTATION,
        variables: { id: imageId },
        fetchPolicy: 'network-only',
      });

      dispatch(fetchNodeImages({ nodeId, limit: 4, offset: 0 }));
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    updateNodeImage: (
      state,
      action: PayloadAction<{ id: string; imageFile: string }>,
    ) => {
      if (state.nodes[action.payload.id]) {
        state.nodes[action.payload.id].primaryImageUrl =
          action.payload.imageFile;
      }

      return state;
    },
    addNodes: (state, action: PayloadAction<{ [id: string]: NodeData }>) => {
      state.nodes = { ...state.nodes, ...action.payload };

      return state;
    },
    setNodeImages: (
      state,
      action: PayloadAction<{ nodeId: string; images: NodeImage[] }>,
    ) => {
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.payload.nodeId]: {
            ...state.nodes[action.payload.nodeId],
            images: action.payload.images,
          },
        },
      };
    },
    pushNodeImages: (
      state,
      action: PayloadAction<{ nodeId: string; images: NodeImage[] }>,
    ) => {
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.payload.nodeId]: {
            ...state.nodes[action.payload.nodeId],
            images: [
              ...(state.nodes[action.payload.nodeId]?.images || []),
              ...action.payload.images,
            ],
          },
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceNode.pending, (state, action) => {
        const id = action.meta.arg.id;
        if (!state.nodes[id]) {
          state.nodes[id] = {
            loading: true,
            error: undefined,
          };
        } else {
          state.nodes[id].loading = true;
          state.nodes[id].error = undefined;
        }
      })
      .addCase(fetchPlaceNode.fulfilled, (state, action) => {
        const nodeData = action.payload;
        const { id, audioUrl, title } = nodeData;
        const track: Track = {
          id,
          url: audioUrl || '',
          title: title || 'Pocketnaut Audio',
          artist: 'Pocketnaut',
        };
        state.nodes[id] = {
          ...nodeData,
          loading: false,
          track,
        };
      })
      .addCase(fetchPlaceNode.rejected, (state, action) => {
        const id = action.meta.arg.id;
        if (!state.nodes[id]) {
          state.nodes[id] = {
            loading: false,
            error: action.payload as string,
            text: '',
          };
        } else {
          state.nodes[id].loading = false;
          state.nodes[id].error = action.payload as string;
        }
      });
  },
});

export const { updateNodeImage, addNodes } = nodesSlice.actions;

export default nodesSlice.reducer;
