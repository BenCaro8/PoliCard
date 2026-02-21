import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getConfigs } from '../helpers';
import { ConnectionStatus, ServiceTarget } from '@graphql';

export type Environment = {
  name: string;
  kubeContext: string;
};

export type Service = {
  name: string;
  url: string;
  target: ServiceTarget;
};

export type Config = {
  environments: Environment[];
  services: Service[];
};

export type State = {
  targetEnvironment: Environment;
  environments: Environment[];
  services: Service[];
  connectionStatus: ConnectionStatus;
};

const config = getConfigs();

const initialState: State = {
  targetEnvironment: config.environments[0],
  environments: config.environments,
  services: config.services,
  connectionStatus: ConnectionStatus.Connecting,
};

export const proxySlice = createSlice({
  name: 'proxy',
  initialState,
  reducers: {
    setTargetEnvironment: (state, action: PayloadAction<Environment>) => {
      state.targetEnvironment = action.payload;
      return state;
    },
    updateServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload;
      return state;
    },
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
      return state;
    },
    updateState: (state, action: PayloadAction<Partial<State>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setTargetEnvironment,
  updateServices,
  setConnectionStatus,
  updateState,
} = proxySlice.actions;

export default proxySlice.reducer;
