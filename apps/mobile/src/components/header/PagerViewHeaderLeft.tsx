import { FC } from 'react';
import { usePagerContext } from '../providers/PagerProvider';

const PagerViewHeaderLeft: FC = () => {
  const { state } = usePagerContext();
  return state.leftHeader;
};

export default PagerViewHeaderLeft;
