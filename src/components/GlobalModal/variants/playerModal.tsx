import React from 'react';
import Player, { TPlayerProps } from '@components/Player';

const PlayerModal: React.FC<TPlayerProps> = props => <Player {...props} />;

export default PlayerModal;
