import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity, View, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/utils/store';
import { deleteUserSessions } from '@/src/utils/slices/history';
import styles from './styles/HistoryDelete';

const HistoryDelete: FC = () => {
  const { isMultiSelectActive, selectedSessions } = useAppSelector(
    (state) => state.history,
  );
  const dispatch = useAppDispatch();

  const numSelected = selectedSessions.length;

  return (
    <View style={styles.container}>
      {isMultiSelectActive && numSelected > 0 && (
        <View style={styles.container}>
          <Text style={styles.text}>
            <FormattedMessage
              id="HistoryDelete.selectedNum"
              defaultMessage="{num} Selected"
              values={{ num: numSelected }}
            />
          </Text>
          <TouchableOpacity onPress={() => dispatch(deleteUserSessions())}>
            <View style={styles.iconContainer}>
              <Feather name="trash-2" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HistoryDelete;
