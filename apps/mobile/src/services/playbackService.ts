import TrackPlayer, { Event, RemoteSeekEvent } from 'react-native-track-player';

const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteSeek, (event: RemoteSeekEvent) =>
    TrackPlayer.seekTo(event.position),
  );
};

export default PlaybackService;
