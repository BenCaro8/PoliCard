import { FC } from 'react';
import { usePagerContext } from '../providers/PagerProvider';

const PagerViewHeaderRight: FC = () => {
  const { state } = usePagerContext();
  return state.rightHeader;
};

export default PagerViewHeaderRight;
