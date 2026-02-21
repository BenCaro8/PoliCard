import { FC } from 'react';
import { usePagerContext } from '@/src/components/providers/PagerProvider';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import Launch from '@/src/pages/Launch';
import History from '@/src/pages/History';
import Community from '@/src/pages/Community';
import HistoryDelete from '@/src/components/header/HistoryDelete';
import PocketnautTypography from '@/src/components/header/PocketnautTypography';
import TitleWrapper from '@/src/components/header/TitleWrapper';
import SettingsButton from '@/src/components/header/SettingsHeader';
import styles from './styles';
import { FormattedMessage } from 'react-intl';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Landing: FC = () => {
  const { setState } = usePagerContext();

  const headers = [
    {
      leftHeader: (
        <TitleWrapper>
          <FormattedMessage id="Landing.history" defaultMessage="History" />
        </TitleWrapper>
      ),
      rightHeader: <HistoryDelete />,
    },
    { leftHeader: <PocketnautTypography />, rightHeader: <SettingsButton /> },
    {
      leftHeader: (
        <TitleWrapper>
          <FormattedMessage id="Landing.community" defaultMessage="Community" />
        </TitleWrapper>
      ),
      rightHeader: <SettingsButton />,
    },
  ];

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    const newPageIndex = event.nativeEvent.position;
    setState({ ...headers[newPageIndex] });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PagerView
        style={styles.container}
        initialPage={1}
        onPageSelected={handlePageSelected}
      >
        <History key="1" />
        <Launch key="2" />
        <Community key="3" />
      </PagerView>
    </GestureHandlerRootView>
  );
};

export default Landing;
