import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { GameType } from 'components/types';
import { Layout } from './Layout';
import { GameLobby, Game } from 'components';

const socket = new ReconnectingWebSocket('ws://localhost:8000/api/ws/lobby');

export const Main = () => {
  const [activeGames, setActiveGames] = useState<GameType[]>([]);

  useEffect(() => {
    socket.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };

    socket.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
    };

    socket.onmessage = function (e) {
      const server_message = JSON.parse(e.data);

      setActiveGames([...activeGames, { id: server_message?.game_id }]);

      return false;
    };
  }, [setActiveGames, activeGames]);

  return (
    <Layout
      main={<Game socket={socket} />}
      panel={<GameLobby websocket={socket} games={activeGames} />}
    />
  );
};
