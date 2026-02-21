import { createContext, FC, ReactNode, useContext, useReducer } from 'react';

export type State = {
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  emailError?: string;
  displayNameError?: string;
  passwordError?: string;
  showBackButton: boolean;
};

const initialState: State = {
  email: '',
  displayName: '',
  password: '',
  confirmPassword: '',
  showBackButton: true,
};

export type Action = {
  type: keyof State;
  payload: State[keyof State];
};

const reducer = (state: State, action: Action): State => {
  return { ...state, [action.type]: action.payload };
};

const SignUpContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useSignUpContext = () => useContext(SignUpContext);

type Props = {
  children: ReactNode;
};

const SignUpProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SignUpContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpContext.Provider>
  );
};

export default SignUpProvider;
