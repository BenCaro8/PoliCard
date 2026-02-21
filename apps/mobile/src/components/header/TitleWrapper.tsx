import { FC, ReactNode } from 'react';
import { View, Text } from 'react-native';
import BackButton from './BackButton';
import styles from './styles/PocketnautTypography';

type Props = { backButton?: boolean; children: ReactNode };

const TitleWrapper: FC<Props> = ({ backButton = false, children }) => {
  return (
    <View style={styles.container}>
      {backButton && <BackButton />}
      <Text style={[styles.title, backButton && styles.titleMargin]}>
        {children}
      </Text>
    </View>
  );
};

export default TitleWrapper;
