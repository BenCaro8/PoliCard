import { FC, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { FormattedMessage } from 'react-intl';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import {
  getUserSessions,
  setIsMultiSelectActive,
  setPage,
  setSelectedSessions,
} from '@/src/utils/slices/history';
import { useAppSelector, useAppDispatch } from '../utils/store';
import { setCurrentSessionId } from '@/src/utils/slices/pastSession';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
  NativeScrollEvent,
  Vibration,
} from 'react-native';
import styles from './styles/History';

const History: FC = () => {
  const router = useRouter();
  const {
    sessions,
    loading,
    page,
    hasMore,
    selectedSessions,
    isMultiSelectActive,
  } = useAppSelector((state) => state.history);
  const dispatch = useAppDispatch();
  const loadingMore = useRef(false);

  useEffect(() => {
    if (!selectedSessions.length && isMultiSelectActive)
      dispatch(setIsMultiSelectActive(false));
  }, [dispatch, isMultiSelectActive, selectedSessions.length]);

  const onRefresh = useCallback(() => {
    dispatch(setPage(1));
    dispatch(getUserSessions({ page: 1 }));
  }, [dispatch]);

  const loadMoreSessions = useCallback(() => {
    if (hasMore && !loadingMore.current && !loading) {
      loadingMore.current = true;
      dispatch(getUserSessions({ page: page + 1 }))
        .unwrap()
        .then(() => {
          loadingMore.current = false;
          dispatch(setPage(page + 1));
        })
        .catch(() => {
          loadingMore.current = false;
        });
    }
  }, [dispatch, hasMore, loading, page]);

  const isCloseToBottom = (event: NativeScrollEvent) => {
    const { layoutMeasurement, contentOffset, contentSize } = event;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height;
  };

  const thumbnailUrl = null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(Number(dateString));

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSessionPress = (sessionId: string) => {
    Vibration.vibrate(20);
    if (isMultiSelectActive) {
      if (selectedSessions.includes(sessionId)) {
        dispatch(
          setSelectedSessions(selectedSessions.filter((i) => i !== sessionId)),
        );
      } else {
        dispatch(setSelectedSessions([...selectedSessions, sessionId]));
      }
    } else {
      dispatch(setCurrentSessionId(sessionId));
      router.push('/landing/history');
    }
  };

  const handleLongPress = (sessionId: string) => {
    if (!isMultiSelectActive) {
      Vibration.vibrate([50, 50]);
      dispatch(setSelectedSessions([sessionId]));
      dispatch(setIsMultiSelectActive(true));
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            sessions.length === 0 && styles.scrollContainerNoContent,
          ]}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              loadMoreSessions();
            }
          }}
          scrollEventThrottle={10}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={PRIMARY_ACCENT_COLOR}
              colors={[PRIMARY_ACCENT_COLOR]}
            />
          }
          scrollEnabled
        >
          {sessions.length === 0 ? (
            <View style={styles.noSessionsContainer}>
              <Text style={styles.noSessionsText}>
                <FormattedMessage
                  id="History.noPreviousSessions"
                  defaultMessage="No previous sessions found."
                />
              </Text>
              <Text style={styles.noSessionsText}>
                <FormattedMessage
                  id="History.refresh"
                  defaultMessage="Scroll down to refresh the page."
                />
              </Text>
            </View>
          ) : (
            sessions.slice().map((session, index) => (
              <TouchableWithoutFeedback
                key={session.sessionId}
                onLongPress={() => handleLongPress(session.sessionId)}
                onPress={() => handleSessionPress(session.sessionId)}
              >
                <View
                  style={[
                    styles.sessionContainer,
                    index ? styles.borderTop : undefined,
                    selectedSessions.includes(session.sessionId) &&
                      styles.selectedSession,
                  ]}
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>
                      {session.title || (
                        <FormattedMessage
                          id="History.sessionTitleDefault"
                          defaultMessage="Exploration Session"
                        />
                      )}
                    </Text>
                    <Text style={styles.date}>
                      {formatDate(session.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.thumbnailContainer}>
                    {thumbnailUrl ? (
                      <Image
                        source={{ uri: thumbnailUrl }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.noThumbnail}>
                        <Text style={styles.noThumbnailText}>
                          <FormattedMessage
                            id="History.noThumb"
                            defaultMessage="No Thumbnail"
                          />
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default History;
