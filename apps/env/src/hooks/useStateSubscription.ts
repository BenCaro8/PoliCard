import { useDispatch } from 'react-redux';
import { useSubscription } from '@apollo/client';
import { updateState } from '../utils/slices/proxy';
import { gql } from '@gql';

const STATE_SUBSCRIPTION = gql(`
  subscription State {
    state {
      targetEnvironment {
        name
        kubeContext
      }
      services {
        name
        url
        target
      }
      connectionStatus
    }
  }
`);

export const useStateSubscription = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSubscription(STATE_SUBSCRIPTION, {
    onData: ({ data }) => {
      dispatch(
        updateState({
          targetEnvironment: data.data?.state.targetEnvironment,
          services: data.data?.state.services,
          connectionStatus: data.data?.state.connectionStatus,
        }),
      );
    },
  });

  return { loading, error };
};
