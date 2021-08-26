import React from 'react';
import { StyleSheet } from 'react-native';

import Player from '@components/Player';

type Props = {
};

const PlayerView: React.FC<Props> = () => {

  return (
    <Player
      autoPlay
      configuration={{
        url: 'https://video-ingestor-output-bucket.s3-eu-west-1.amazonaws.com/12338/manifest.m3u8',
        poster: 'https://actualites.music-opera.com/wp-content/uploads/2019/09/14OPENING-superJumbo.jpg',
        startOffset: 0,
      }}
      title="event title"
      subtitle="some subtitle"
      />
  );
}

export default PlayerView;