import { createContext, FC, ReactNode, useContext, useState } from 'react';

export type State = {
  leftHeader?: ReactNode;
  rightHeader?: ReactNode;
};

const initialState: State = {};

const PagerContext = createContext<{
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}>({
  state: initialState,
  setState: () => null,
});

export const usePagerContext = () => useContext(PagerContext);

type Props = {
  children: ReactNode;
};

const PagerProvider: FC<Props> = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <PagerContext.Provider value={{ state, setState }}>
      {children}
    </PagerContext.Provider>
  );
};

export default PagerProvider;
